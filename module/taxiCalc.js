var dbOpreate = require('../dataIO.js');
var gdal = require('gdal'); 
var moment = require('moment');

//城市区域出租车资源用量计算
function calcArea () {
	var promise = new Promise(async function(resolve, reject){
		try{
			var dataset = gdal.open('data/shp/cityArea_WGS84.shp');
			var layer = dataset.layers.get(0);

			var upPnts_gdal = [];
			var areaAnsC = [];
			var areaNormNumC = [];

			var tkPnts = await readTaxiPnt(60);
			var tkPntsArr = pntJsonToArr(tkPnts);
			var upPnts = await upPntsCalc(tkPntsArr);

			var taxiSum = tkPnts.length;
			var upPntSum = upPnts.length;

			var areaID = 1;

			layer.features.forEach(function(feature, i) {
				var areaUpNum = 0;
				var areaTaixNum = 0;
				var geometry = feature.getGeometry();

				//计算区域内出租车数量
				tkPntsArr.forEach(function (taxi){
					taxi.forEach(function (tkPnt){
						var point = new gdal.Point(tkPnt.lon[0],tkPnt.lon[1]);
						if(geometry.intersects(point)){
							areaTaixNum++;
							return;
						}
					});
				})

				//计算区域内上客点数量
				upPnts.forEach(function (upPnt, i){
					var point = new gdal.Point(upPnt.lon[0],upPnt.lon[1]);
					upPnts_gdal[i] = point;
					
					if(geometry.intersects(point))
						areaUpNum++;
				});

				//标准车量计算 (区域上客点数量 / 总上客点数量 * 出租车总量)
				var areaNormNum = areaUpNum / upPntSum * taxiSum;
				var areaNumEva = (areaNormNum || areaNormNum != 0)?(areaTaixNum / areaNormNum * 100):100;

				var mtime = moment("2017-01-01 10:00:00"); //test Time
				//var mtime = moment();
				var calcTime = mtime.format('YYYY-MM-DD HH:mm:ss');

				var areaAns = {"areaName":feature.fields.get(0),"areaID":areaID,"calcTime":calcTime,"areaEva":areaNumEva,"taxiNum":areaTaixNum,"upNum":areaUpNum,"normNum":areaNormNum};
				
				for (var fieldID in areaAns){
				    if (!areaAns[fieldID]) {
						areaAns[fieldID] = 0;
						if(fieldID == "areaEva"){
							areaAns[fieldID] = 100;
						}
					}
				}

				areaID++;
				areaAnsC[i] = areaAns;
			});
			resolve(areaAnsC);
		} catch(error) {
			reject(console.error(error));
		}
	});
	return promise;
}

// 在线出租车实时位置获取（五分钟内）
function loadTaxi() {
	var promise = new Promise(async function(resolve, reject){
		try{
			var tkPnts = await readTaxiPnt(10);
			var tkPntsArr = pntJsonToArr(tkPnts);

			var onlineTaxi = [];

			tkPntsArr.forEach(function (data){
				var taxiPnt = data[data.length - 1];
				onlineTaxi.push(taxiPnt);
			});

			resolve(onlineTaxi);
		}catch(error){
			reject(console.error(error));
		}
	});
	return promise;
}

//计算上客点数量
function upPntsCalc(tkPntsArr){
	var promise = new Promise(function(resolve, reject){
		try{
			var upPnts = [];

			tkPntsArr.forEach(function (data){
				data.sort(function(a, b) { return a.time > b.time ? 1 : -1;} );

				data.forEach(function (tkPnt, i){

					if(data[i+1] == null) return;
					if(tkPnt.state != data[i+1].state && tkPnt.state == "空车")
						upPnts.push(tkPnt);
				});
			});

			resolve(upPnts);
		}catch (error) {
			reject(console.error(error));
		}
	});
	return promise;
}

// 读取数据库中出租车点信息(时间间隔)
function readTaxiPnt (interval){
	var promise = new Promise(async function(resolve, reject){
		
		var mtime = moment("2017-01-01 18:00:00"); //test Time
		//var mtime = moment();

		var date = mtime.format('YYYY-MM-DD');
		var timeN = mtime.format('YYYY-MM-DD HH:mm:ss');
		var timeA = mtime.subtract(interval,'minute').format('YYYY-MM-DD HH:mm:ss');

		try{
			var tkPnts = await dbOpreate.getTkPnts(date, timeA, timeN);
			var tkPnts = eval("(" + tkPnts + ")");
			resolve(tkPnts);
		}catch(error){
			reject(console.error(error));
		}
	});
	return promise;
}

// 从JSON对象 分割为 每辆车的轨迹点数组
function pntJsonToArr (dataObj) {
	var dataset = [];
	dataObj.forEach(function(dataO){
		var flag = 0;

		dataO.lon = dataO.lon.split(","); //分割字符串(",")
		dataO.lon[0] = parseFloat(dataO.lon[0]);
		dataO.lon[1] = parseFloat(dataO.lon[1]);

		if(dataset.length != 0){
			dataset.forEach(function(data){
				if (data[0].plateNum == dataO.plateNum) {
					data.push(dataO);
					flag = 1;
					return;
				}
			});
		}

		if (dataset.length == 0 || flag == 0){
			var data = [];
			data.push(dataO);
			dataset.push(data);
		}
	});

	dataset.forEach(function (data){
		data.sort(function(a, b) {return a.time > b.time ? 1 : -1;});
	})

	dataCalc = dataset;

	return dataset;
}

exports.calcArea = calcArea;
exports.loadTaxi = loadTaxi;
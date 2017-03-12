var dbOpreate = require('../dataIO.js');
var gdal = require('gdal'); 
var moment = require('moment');

function calcDock(){
	var promise = new Promise(async function(resolve,reject){
		try{
			var dataset = gdal.open('data/shp/taxi_station.shp');
			var layer = dataset.layers.get(0);

			var upPnts_gdal = [];
			var dockAnsC = [];
			var dockNormNumC = [];

			var tkPnts = await readTaxiPnt(60);
			var tkPntsArr = pntJsonToArr(tkPnts);
			var upPnts = await upPntsCalc(tkPntsArr);

			var taxiSum = tkPnts.length;
			var upPntSum = upPnts.length;

			layer.features.forEach(function(feature, i){
				var geometry = feature.getGeometry();
				var dockBuf = geometry.buffer(800,0);

				var dockUpNum = 0;
				var dockTaixNum = 0;

				// 计算区域内出租车数量
				tkPntsArr.forEach(function (taxi){
					taxi.forEach(function (tkPnt){
						var point = new gdal.Point(tkPnt.lng,tkPnt.lat);
						if(dockBuf.intersects(point)){
							dockTaixNum++;
							return;
						}
					});
				})

				// 区域内上客点数量
				upPnts.forEach(function (upPnt, i){
					var point = new gdal.Point(upPnt.lng,upPnt.lat);
					upPnts_gdal[i] = point;
					
					if(dockBuf.intersects(point))
						dockUpNum++;
				});

				// 标准车量计算 (区域上客点数量 / 总上客点数量 * 出租车总量)
				var dockNormNum = dockUpNum / upPntSum * taxiSum;
				var dockCRate = dockCRate = dockUpNum / dockTaixNum;
				var dockCRateN = 1;
				var dockEva = 100;
				if(dockNormNum && dockNormNum != 0){
					dockCRateN = dockUpNum / dockNormNum;
					dockEva = (dockCRate / (dockCRateN * (dockTaixNum / dockNormNum))) * 100;
				}

				var mtime = moment();
				mtime.set({'year': 2017, 'month': 1-1, 'date': 1}); //test time 2
				var ctime = mtime.format('YYYY-MM-DD HH:mm:ss');

				var dockAns = {"dockID":feature.fields.get(0),"calcTime":ctime,"dockEva":dockEva,"taxiNum":dockTaixNum,"upNum":dockUpNum,"normNum":dockNormNum};
				
				for (var fieldID in dockAns){
				    if (!dockAns[fieldID]) {
						dockAns[fieldID] = 0;
						if(fieldID == "dockEva"){
							dockAns[fieldID] = 100;
						}
					}
				}
				dockAnsC.push(dockAns);
			});
			resolve(dockAnsC);

		}catch(error){
			reject(error);
		}
	});
	return promise;
}

//城市区域出租车资源用量计算
function calcArea(){
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

			layer.features.forEach(function(feature, i){
				var areaUpNum = 0;
				var areaTaixNum = 0;
				var geometry = feature.getGeometry();

				// 计算区域内出租车数量
				tkPntsArr.forEach(function (taxi){
					taxi.forEach(function (tkPnt){
						var point = new gdal.Point(tkPnt.lng,tkPnt.lat);
						if(geometry.intersects(point)){
							areaTaixNum++;
							return;
						}
					});
				})

				// 计算区域内上客点数量
				upPnts.forEach(function (upPnt, i){
					var point = new gdal.Point(upPnt.lng,upPnt.lat);
					upPnts_gdal[i] = point;
					
					if(geometry.intersects(point))
						areaUpNum++;
				});

				//标准车量计算 (区域上客点数量 / 总上客点数量 * 出租车总量)
				var areaNormNum = areaUpNum / upPntSum * taxiSum;
				var areaNumEva = (areaNormNum || areaNormNum != 0)?(areaTaixNum / areaNormNum * 100):100;

				var mtime = moment();
				mtime.set({'year': 2017, 'month': 1-1, 'date': 1}); //test time 2
				var ctime = mtime.format('YYYY-MM-DD HH:mm:ss');

				var areaAns = {"areaName":feature.fields.get(0),"areaID":areaID,"calcTime":ctime,"areaEva":areaNumEva,"taxiNum":areaTaixNum,"upNum":areaUpNum,"normNum":areaNormNum};
				
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
function loadTaxi(){
	var promise = new Promise(async function(resolve, reject){
		try{
			var tkPnts = await readTaxiPnt(5);
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
function readTaxiPnt(interval){
	var promise = new Promise(async function(resolve, reject){

		var mtime = moment();
		mtime.set({'year': 2017, 'month': 1-1, 'date': 1}); //test time 2

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
function pntJsonToArr(dataObj){
	var dataset = [];
	dataObj.forEach(function(dataO){
		var flag = 0;

		// dataO.lon = dataO.lon.split(","); //分割字符串(",")
		dataO.lng = parseFloat(dataO.lng);
		dataO.lat = parseFloat(dataO.lat);

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
exports.calcDock = calcDock;
exports.loadTaxi = loadTaxi;
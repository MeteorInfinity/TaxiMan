var taxiCalc = require('../module/taxiCalc.js');
var dataIO = require('../dataIO.js');
var moment = require('moment');

function readAreaAns(areaName, interval){
    var promise = new Promise(async function(resolve, reject){

    	moment.locale('zh-cn')
		var mtime = moment("2017-01-01 18:00:00"); //test Time
		//var mtime = moment();

		var timeN = mtime.format('YYYY-MM-DD HH:mm:ss');
		var timeA = mtime.subtract(interval,'hours').format('YYYY-MM-DD HH:mm:ss');

    	try{
    		var areaAns = await dataIO.getAreaAnsO(areaName, timeA, timeN);
			var areaAns = eval("(" + areaAns + ")");
    		
    		resolve(areaAns);
    	}catch(error){
    		reject(console.error(error));
    	}
	});
    return promise;
}

exports.readAreaAns = readAreaAns
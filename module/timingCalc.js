var taxiCalc = require('../module/taxiCalc.js');
var dbOpreate = require('../dataIO.js');

async function tcAreaTaxi (){
	try{
		var areaTaxiAns = await taxiCalc.calcArea();
		var mes = await dbOpreate.optAreaAns(areaTaxiAns);
		console.log("Timing Area Calc & Save SUCCESS " + mes.length + " " + new Date().toLocaleString());
	}catch(error){
		console.error(error);
	}
}

exports.tcAreaTaxi = tcAreaTaxi;
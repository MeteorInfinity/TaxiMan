var fs = require('fs');
var dataConvert = require('../module/dataConvert.js');

module.exports = {
    'GET /taxiDock': async (ctx, next) => {
    	try{
	    	await dataConvert.dock2json();
	    	ctx.response.body = eval("("+fs.readFileSync("./data/geoJson/cityDock_mapshaper.json")+")");
	    	console.log("GET Taxi Dock Json Data SUCCESS " + ctx.response.body.features.length);
    	}catch(error){
    		console.error(error);
    	}
	}
}
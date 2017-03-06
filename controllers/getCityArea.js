var fs = require('fs');
var dataConvert = require('../module/dataConvert.js');

module.exports = {
    'GET /cityArea': async (ctx, next) => {
    	try{
	    	await dataConvert.area2json();
	    	ctx.response.body = eval("("+fs.readFileSync("./data/geoJson/cityArea_mapshaper.json")+")");
	    	console.log("GET City Area Json Data SUCCESS " + ctx.response.body.features.length);
    	}catch(error){
    		console.error(error);
    	}
	}
}
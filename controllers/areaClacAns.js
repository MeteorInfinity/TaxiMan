var readAreaAns = require("../module/readAreaAns.js")

module.exports = {
    'GET /areaClacAns': async (ctx, next) => {

    	var areaName = ctx.request.query.areaName;
    	var interval = ctx.request.query.interval;

    	try{
    		ctx.response.body = await readAreaAns(areaName ,interval) ;
    		console.log("GET City Area Calc Result for " + interval + "Hours SUCCESS " + ctx.response.body.length);
    	}catch(error){
    		console.error(error);
    	}
	}
}
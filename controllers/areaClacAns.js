var readAreaAns = require("../module/readAreaAns.js")

module.exports = {
    'GET /areaClacAns': async (ctx, next) => {

    	try{
            var areaID = ctx.request.query.areaID;
            var interval = ctx.request.query.interval;

    		ctx.response.body = await readAreaAns(areaID ,interval);
    		console.log("GET City Area Calc Result for " + interval + "Hours SUCCESS " + ctx.response.body.length);
    	}catch(error){
    		console.error(error);
    	}
	}
}
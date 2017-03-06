var readAreaAns = require("../module/readAreaAns.js")

module.exports = {
    'GET /areaClacAnsC': async (ctx, next) => {

    	try{
            var interval = ctx.request.query.interval;

    		ctx.response.body = await readAreaAns.readAreaAnsC(interval);
    		console.log("GET All City Area Calc Result for " + interval + "Hours SUCCESS " + ctx.response.body.length);
    	}catch(error){
    		console.error(error);
    	}
	}
}
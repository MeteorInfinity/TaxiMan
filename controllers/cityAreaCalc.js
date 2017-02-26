var taxiCalc = require('../module/taxiCalc.js');

module.exports = {
    'GET /cityAreaCalc': async (ctx, next) => {
    	try{
    		ctx.response.body = await taxiCalc.calcArea();
    		console.log("GET City Area Calc Result SUCCESS " + ctx.response.body.length);
    	}catch(error){
    		console.error(error);
    	}
	}
}
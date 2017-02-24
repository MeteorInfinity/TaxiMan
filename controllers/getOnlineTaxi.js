var taxiCalc = require('../taxiCalc.js');

module.exports = {
    'GET /onlineTaxi': async (ctx, next) => {
    	try{
	    	ctx.response.body = await taxiCalc.loadTaxi();
	    	console.log("GET Online Taxi's Coord Point SUCCESS " + ctx.response.body.length);
	    }catch(error){
	    	console.error(error);
		}
	}
}
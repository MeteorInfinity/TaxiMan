var taxiCalc = require('../module/taxiCalc.js');

module.exports = {
    'GET /cityDockCalc': async (ctx, next) => {
    	try{
    		ctx.response.body = await taxiCalc.calcDock();
    		console.log(ctx.response.body[0].dockEva);
    		console.log("GET City Taxi Dock Calc Result SUCCESS " + ctx.response.body.length);
    	}catch(error){
    		console.error(error);
    	}
	}
}
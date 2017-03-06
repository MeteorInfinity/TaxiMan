const socketSend = require('../module/socketSend.js');

module.exports = {
    'POST /socketConnect': async (ctx, next) => {
    	try{

	    	var phoneNum = ctx.request.query.phoneNum;
	    	var textMesStr = ctx.request.query.textMesStr;

	    	var data = await socketSend(phoneNum,textMesStr);
	    	console.log("Socket Connect Success " + data);
    	}catch(error){
    		console.error(error);
    	}
	}
}
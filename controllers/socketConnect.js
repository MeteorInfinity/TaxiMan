const textMesBuild = require('../module/textMesBuild.js');
const socketSend = require('../module/socketSend.js');

module.exports = {
    'POST /socketConnect': async (ctx, next) => {
    	try{

	    	var phoneNum = ctx.request.body.tnPhoneNum;
	    	var textMesStr = ctx.request.body.tnText;

	    	var data = textMesBuild(phoneNum,textMesStr);
	    	var flag = await socketSend(data);
	    	console.log("Socket Connect Success " + data);
    	}catch(error){
    		console.error(error);
    	}
	}
}
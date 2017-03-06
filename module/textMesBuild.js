const iconv = require('iconv-lite');

Buffer.prototype.toByteArray = function(){
	return Array.prototype.slice.call(this, 0)
}

module.export = funtion(simCardStr, textMes){

	var textMesByte = iconv.encode(textMes,"GBK");
	var tmbLength = textMesByte.length;

	var strBuf = Buffer.alloc(12+tmbLength);
	strBuf[0] = 0x7e;
	strBuf[1] = 0x09;
	strBuf[2] = 0x03;
	scStr2Byt(simCardStr).copy(strBuf,3);
	strBuf[9] = strBuf[10] = 0;
	textMesByte.copy(strBuf,11);
	strBuf[11+tmbLength] = 0x7e;

	return strBuf;
}

function scStr2Byt(simCardStr){
	var numBuf = Buffer.alloc(6);
	var arr = new Int8Array(6);
	var startNumStr = simCardStr[0];
	arr[0] = parseInt(startNumStr);
	for(i=0; i<5; i++){
		var numStr = simCardStr[1+2*i]+simCardStr[2+2*i];
		arr[i+1]=parseInt(numStr);
	}

	var numBuf = Buffer.from(arr);
	var bytes = numBuf.toByteArray();

	console.log(bytes);

	return numBuf;
}

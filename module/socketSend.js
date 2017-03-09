const net = require('net');

const host = '127.0.0.1';
const port = 6969;

module.exports = function(bytes){
	var promise = new Promise(async function(resolve, reject){

		try{

			let client = new net.Socket();

			client.connect(port, host, function(){

			    console.log('Socket Clinet Connected To : ' + host + ':' + port);
			    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
			    client.write(bytes);

			});

			// 为客户端添加“data”事件处理函数
			// data是服务器发回的数据
			client.on('data', function(data) {
			    // 完全关闭连接
			    client.end();
			    resolve(data);    

			});

			// 为客户端添加“close”事件处理函数
			client.on('end', function() {
			    console.log('Connection closed');
			});

		}catch(error){
			reject(console.error(error));
		}
	});
	return promise;	
}
var mapshaper = require('mapshaper');

function area2json(){
	// mapshaper.runCommands('-i data/shp/cityArea_WGS84.shp -o data/geoJson/cityArea_mapshaper.json format=geojson precision=0.0001',function (Error){
	// 	if (Error) return console.error(Error);
	// });
	var promise = new Promise(async function(resolve, reject){

		await mapshaper.runCommands('-i data/shp/cityArea_WGS84.shp -o data/geoJson/cityArea_mapshaper.json format=geojson',function (Error){
			if (Error) reject(console.error(Error));
		});
		resolve(console.log("Area Data Convertor SUCCESS"));
	});

	return promise;
}

function dock2json(){
	// mapshaper.runCommands('-i data/shp/cityArea_WGS84.shp -o data/geoJson/cityArea_mapshaper.json format=geojson precision=0.0001',function (Error){
	// 	if (Error) return console.error(Error);
	// });
	var promise = new Promise(async function(resolve, reject){

		await mapshaper.runCommands('-i data/shp/taxi_station.shp -o data/geoJson/cityDock_mapshaper.json format=geojson',function (Error){
			if (Error) reject(console.error(Error));
		});
		resolve(console.log("Dock Data Convertor SUCCESS"));
	});

	return promise;
}

exports.area2json = area2json;
exports.dock2json = dock2json;
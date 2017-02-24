var mapshaper = require('mapshaper');

function shp2json (){
	// mapshaper.runCommands('-i data/shp/cityArea_WGS84.shp -o data/geoJson/cityArea_mapshaper.json format=geojson precision=0.0001',function (Error){
	// 	if (Error) return console.error(Error);
	// });
	var promise = new Promise(async function(resolve, reject){

		await mapshaper.runCommands('-i data/shp/cityArea_WGS84.shp -o data/geoJson/cityArea_mapshaper.json format=geojson',function (Error){
			if (Error) reject(console.error(Error));
		});
		resolve(console.log("data Convertor SUCCESS"));
	});

	return promise;
}

exports.shp2json = shp2json;
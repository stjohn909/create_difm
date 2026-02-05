var version = require("./package.json").version;
// var TuneIn  = require( 'node-tunein-radio');

var debug = beo.debug;
var stations;
var stations_list = require("./stations.json").stations;
var defaultSettings = { "favourites": {} };
var settings = JSON.parse(JSON.stringify(defaultSettings));

beo.bus.on('general', function (event) {
	if (event.header == "activatedExtension") {
		if (event.content.extension == "difm") {
			beo.sendToUI("difm", {
				header: "homeContent",
				content: {favourites: settings.favourites, "stations_list" : stations_list}
			});
		}
	}
});
/*
Calling Brighton ent re MRI and auth

*/
beo.bus.on('difm', function (event) {
	switch (event.header) {
		case "settings":
			if (event.content.settings) {
				settings = Object.assign(settings, event.content.settings);
			}
			break;
		// case "default":
		// 	if (event.content.stations) {
		// 		stations = Object.assign(settings, event.content.settings);
		// 	}
		// 	break;
	
		case "add-to-favourite":
			if (!settings.favourites[event.content.stationId]) {
				settings.favourites[event.content.stationId] = {
					title: stations_list[event.content.stationId].text,
					img: stations_list[event.content.stationId].image,
					url: stations_list[event.content.stationId].URL
				}
				isFavourite = true;
			} else {
				delete settings.favourites[event.content.stationId]
				isFavourite = false;
			}
			beo.sendToUI("difm", {
				header: "stationFavourited", 
				content: { 
					guide_id: event.content.stationId, 
					isFavourite: isFavourite 
				}
			});
			beo.sendToUI("difm", {
				header: "homeContent", 
				content: {
					favourites: settings.favourites 
				}
			});
			beo.saveSettings("difm", settings);
		}
});

function checkMPDStatus(callback) {
	if (beo.extensions.mpd && beo.extensions.mpd.isEnabled) {
		beo.extensions.mpd.isEnabled(callback);
	}
}

module.exports = {
	version: version,
	stations: stations,
	isEnabled: checkMPDStatus,
};

var difm = (function () {

	$(document).on("difm", function (event, data) {
		switch (data.header) {

			case "homeContent":
				if (data.content) {
					console.log("home content event header.");
					if (data.content.stations_list) {
						// stations_list = data.content.stations_list;
						// console.log("Num stations: "+ stations_list.length);
						// for (var key in stations_list) {
						// 	console.log("station: " + stations_list[key].name);
						// }
						Favourites(data.content.favourites);
						Stations(data.content.stations_list);
					}
				}
			case "stationFavourited": 
				if (data.content.guide_id) {
					if (data.content.isFavourite == true) {
						beo.setSymbol('.collection-item[data-guide-id="'+data.content.guide_id+'"] .collection-item-secondary-symbol', './common/symbols-black/star-filled.svg');
					} else {
						beo.setSymbol('.collection-item[data-guide-id="'+data.content.guide_id+'"] .collection-item-secondary-symbol', './common/symbols-black/star.svg');
					}
				}
				break;
		}

	});
	function Stations(radios) {
		if (radios) {
			stations_list = radios;
			console.log("Num stations: " + stations_list.length);
			for (var key in stations_list) {
				item = stations_list[key];
				itemOptions = {
					label: item.name,
					icon: item.asset_url,
					iconSize: "large",
					onclick: "difm.playDifm('"+item.streamurl+"', '"+item.name+"');",
					onclickSecondary: "difm.addToFavorite('"+item+"')",
					secondarySymbol: "./common/symbols-black/star.svg",
					data: { "data-guide-id": item }
				}
				$("#difm-default-items").append(beo.createCollectionItem(itemOptions));
			}
		}
	}
	function Favourites(radios) {
		if (radios) {
			stations_list = radios;
			console.log("Num favorites: " + stations_list.length);
			for (var key in stations_list) {
				item = stations_list[key];
				itemOptions = {
					label: item.name,
					icon: item.asset_url,
					iconSize: "small",
					onclick: "difm.playRadio('"+item.streamurl+"', '"+item.name+"');",
					onclickSecondary: "difm.addToFavorite('"+item+"')",
					secondarySymbol: "./common/symbols-black/star-filled.svg",
					data: { "data-guide-id": item }
				}
				$("#difm-favorite-items").append(beo.createCollectionItem(itemOptions));
			}
		}
	}
	function playDifm(link, title) {
		beo.sendToProduct("difm", { 
			header: "play",
			content: {
				URL: link,
				stationName: title
			}
		});
	}
	function addToFavorite(stationId) {
		console.log("Station ID: " + JSON.stringify(stationId));
		beo.sendToProduct("difm", { 
			header: "add-to-favourite",
			content: { stationId: stationId }
		});
	}
	return {
		addToFavorite: addToFavorite,
		playDifm: playDifm
	};

})();


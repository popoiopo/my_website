/*
personalData.js

Wessel de Jong
10206620

Programmeerproject
Prox data
*/

function dataParallel(callback) {
	// load in data
	d3.csv("json/Employee_List.csv", function(error, csv) {
	  	if (error) {
	  		throw error;
	  		return alert("Error loading data!");
	  	}

	  	d3.csv("json/parallel-proxOut-MC2.csv", function(error, csv_2) {
		  	if (error) {
		  		throw error;
		  		return alert("Error loading data!");
		  	}

		  	// get unique proxid's
			var output = [];

			for (var i = 0; i < csv_2.length; i++) {
			    if (output.indexOf(csv_2[i].proxid) == -1) {
	      			output.push(csv_2[i].proxid)
			    }
			};

			// final dataset
			var parallelData = {};
			var heatData = {};

			// add proxid's to dataset
			output.forEach(function(d) {
				if (!parallelData.hasOwnProperty(d)){
					parallelData[d] = {};
					heatData[d] = {};
				}
			});

			// add real names to dataset

			// only last name without number (001)
			var output_proxy = []

			output.forEach(function(d) {
				output_proxy.push(d.slice(1, -3));
			});
			// dataset for absent personnel in prox data
			var absent = []

			// couple proxid to last name
			csv.forEach(function(e){
				// take care of cases with space and "-"
				var lastName = e.LastName.substring(0, e.LastName.indexOf("-") != -1 ? e.LastName.indexOf("-") : e.LastName.length).substring(0, e.LastName.indexOf("Jr.") != -1 ? e.LastName.indexOf("Jr.") - 1 : e.LastName.length);

				// couple name of personnel with prox card id
				var index = output_proxy.indexOf(lastName.toLowerCase().replace(/\s/g, ''));

				// if last name is found couple this person to idprox in final dataset
				if (index != -1) {

					// parallelData[output[index]]["name"] = e.FirstName[0] + e.FirstName.slice(1).toLowerCase() + " " + e.LastName[0] + e.LastName.slice(1).toLowerCase()
					parallelData[output[index]]["name"] = output[index];

					// add proxid to personnel list for checking absence
					e["Proxid"] = output[index];

					output.splice(index,1);
					output_proxy.splice(index,1);
					// start with next name
					return;
				}

				// check absence
				if (e.hasOwnProperty("Proxid") == false) {
					absent.push(e.FirstName + " " + e.LastName);
				};

			});

			// data format for date data
			var formatDate = d3.time.format("%Y-%m-%d%H:%M:%S").parse;
			var formatDate_2 = d3.time.format("%Y-%m-%d");

			var keys = ["2016-05-31", "2016-06-01", "2016-06-02", "2016-06-03", "2016-06-04", "2016-06-05", "2016-06-06", "2016-06-07", "2016-06-08", "2016-06-09", "2016-06-10", "2016-06-11", "2016-06-12", "2016-06-13"]

			// add days
			for (key in parallelData) {
				for (var k = 0; k < keys.length; k++) {
					if (!parallelData[key].hasOwnProperty(keys[k])) {
						parallelData[key][keys[k]] = {};
					}
				};
			};

			csv_2.forEach(function(d){
				if (!parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))].hasOwnProperty("floor" + d.floor)){
					parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))]["floor" + d.floor] = {};
					parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))]["floor" + d.floor]["zone" + d.zone] = [];
					parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))]["floor" + d.floor]["zone" + d.zone].push(d);
				}
				else {
					if (!parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))]["floor" + d.floor].hasOwnProperty("zone" + d.zone)){
						parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))]["floor" + d.floor]["zone" + d.zone] = [];
						parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))]["floor" + d.floor]["zone" + d.zone].push(d);
					}
					else {
						parallelData[d.proxid][formatDate_2(formatDate(d.timestamp))]["floor" + d.floor]["zone" + d.zone].push(d);
					};
				};

				// //append floors to heatdata
				if (!heatData[d.proxid].hasOwnProperty("floor" + d.floor)){
					heatData[d.proxid]["floor" + d.floor] = [];
				};
			});


			var zones = {
				"floor1": ["zone1", "zone2", "zone3", "zone4", "zone5", "zone6", "zone7", "zone8"],
				"floor2": ["zone1", "zone2", "zone3", "zone4", "zone5", "zone6", "zone7"],
				"floor3": ["zone1", "zone2", "zone3", "zone4", "zone5", "zone6", "zoneServerRoom"]
			};

			for (proxid in heatData){
				for (floor in heatData[proxid]){
					keys.forEach(function(d){
						zones[floor].forEach(function(e){
							var value = 0

							if (parallelData[proxid][d].hasOwnProperty(floor)){
								if (parallelData[proxid][d][floor].hasOwnProperty(e)){
									value = parallelData[proxid][d][floor][e].length
								}
							};

							heatData[proxid][floor].push({
								day: d,
								zone: e,
								value: value
							});
						});;
					});
				};
			};

			// // create heatdata
			// for (proxid in parallelData){
			// 	for (day in parallelData[proxid]){
			// 		if (day != 'name'){
			// 			for (floor in parallelData[proxid][day]){
			// 				for (zone in parallelData[proxid][day][floor]){
			// 					heatData[proxid][floor].push({
			// 						day: day,
			// 						zone: zone,
			// 						value: + parallelData[proxid][day][floor][zone].length
			// 					});
			// 				};
			// 			};
			// 		};
			// 	};
			// };

			var zones = {
				"floor1": ["zone 1", "zone 2", "zone 3", "zone 4", "zone 5", "zone 6", "zone 7", "zone 8"],
				"floor2": ["zone 1", "zone 2", "zone 3", "zone 4", "zone 5", "zone 6", "zone 7"],
				"floor3": ["zone 1", "zone 2", "zone 3", "zone 4", "zone 5", "zone 6", "zone ServerRoom"]
			};

			for (proxid in heatData){
				for (floor in heatData[proxid]){
					heatData[proxid][floor].forEach(function(d){
						for (day in keys){
						}
					});
				}
			}

			var data = {parallelData: parallelData, heatData: heatData}
			callback(data);
		});

	});
};

/*
dataMaker.js

Wessel de Jong
10206620

Programmeerproject
Prox data
*/

// Laatste dataset
var data_general = {};
var floor_1 = {};
var floor_2 = {};
var floor_3 = {};

// Arrays om over te itereren om repetitie te voorkomen
var dataDays = [31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var dataHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
var dataFloors = [1, 2, 3];

// Functie die de data inlaadt en in een goed format gooit
(function dataMaker() {
    // Keys voor dataset
	var keys_general = ["floor_1", "floor_2", "floor_3"];
	var keys_floor_1 = ["zone_1", "zone_2", "zone_3", "zone_4", "zone_5", "zone_6", "zone_7", "zone_8"];
	var keys_floor_2 = ["zone_1", "zone_2", "zone_3", "zone_4", "zone_5", "zone_6", "zone_7"];
	var keys_floor_3 = ["zone_1", "zone_2", "zone_3", "zone_4", "zone_5", "zone_6", "zone_ServerRoom"];

    // Maak lege arrays aan om later data in te gooien
    for (var f = 0; f < keys_general.length; f++) {
        var floorKey = keys_general[f];
        eval("var general_" + floorKey + "= []");

        var keysArray = eval("keys_" + floorKey);
        for (var z = 0; z < keysArray.length; z++) {
            eval("var " + floorKey + "_" + keysArray[z] + "= []");
        }
    }

    //
	var floor_1_data = [floor_1_zone_1, floor_1_zone_2, floor_1_zone_3, floor_1_zone_4, floor_1_zone_5, floor_1_zone_6, floor_1_zone_7, floor_1_zone_8];
	var floor_2_data = [floor_2_zone_1, floor_2_zone_2, floor_2_zone_3, floor_2_zone_4, floor_2_zone_5, floor_2_zone_6, floor_2_zone_7];
	var floor_3_data = [floor_3_zone_1, floor_3_zone_2, floor_3_zone_3, floor_3_zone_4, floor_3_zone_5, floor_3_zone_6, floor_3_zone_ServerRoom];

	// Fixed prox data inladen
	d3.csv("json/parallel-proxOut-MC2.csv", function(error, csv) {
	  	if (error) throw error;

	  	// Maak voor elke verdieping een aparte dataset
        csv.forEach(function(d) {
	  		var floor = +d.floor;
            eval("general_floor_" + floor + ".push(d)");
            var floorDataLength = eval("floor_" + floor + "_data.length");
            if (d.zone === "ServerRoom") {
                floor_3_data[6].push(d);
            } else {
                eval("floor_" + floor + "_data[" + (+d.zone - 1) + "].push(d)");
            }
	  	});


	  	// Sla de verdieping data op in een grote array
	  	var floors = [general_floor_1, general_floor_2, general_floor_3];

	  	// Datumparsers
	  	var formatDate = d3.time.format("%Y-%m-%d%H:%M:%S");
		var formatDate_2 = d3.time.format("%Y-%m-%d %H");

		// Itereer over elke verdieping
		for (i = 0; i < floors.length; i++) {
            // Variabele om frequentie van scans per uur per dag bij te houden
			var tally = {};

			 // Voeg alle data toe die er is
			floors[i].forEach(function(d) {
				// Verkrijg datum en tijd van de scan
			    var datetime = formatDate.parse(d.timestamp);

		    	var date = formatDate_2(datetime).split(':')[0];
		    	tally[date] = (tally[date]||0) + 1;

			});

            // Voeg de waarde 0 toe voor uren waar er data mist
            tally = makeMissingData(tally);

			// Tijdelijke dataset voor elke verdieping
			var floor_data = [];

            // Sorteer de keys van de tally zodat de linegraph goed verschijnt
            var sortedTallyKeys = Object.keys(tally).sort();
			// Maak de definitieve dataset voor de verdieping
			for (j = 0; j < sortedTallyKeys.length; j++) {
			    floor_data.push({
			    	date: sortedTallyKeys[j],
			        frequency: tally[sortedTallyKeys[j]]
			    });
			}

			// Zet de data om
			floor_data.forEach(function(d){
				d.date = formatDate_2.parse(d.date);
				d.frequency = + d.frequency;
			})

			// puch separate floor data to one final dataset
			data_general[keys_general[i]] = floor_data;
		};

        // Doe exact hetzelfde voor elke verdieping, maar itereer dan over de zones
        for (var f = 0; f < dataFloors.length; f++) {
            var floor = dataFloors[f];
            var floorData = eval("floor_" + floor + "_data");
            for (var i = 0; i < floorData.length; i++) {
                var tally = {};

                floorData[i].forEach(function(d) {
                    var datetime = formatDate.parse(d.timestamp);
                    var date = formatDate_2(datetime).split(":")[0];
                    tally[date] = (tally[date] || 0) + 1;
                });

                tally = makeMissingData(tally);

                // Tijdelijke variabele voor de zonedata
                var zone_data = [];

                // Sorteer de tally keys
                var sortedTallyKeys = Object.keys(tally).sort();
                for (var j = 0; j < sortedTallyKeys.length; j++) {
                    zone_data.push({
                        date: sortedTallyKeys[j],
                        frequency: tally[sortedTallyKeys[j]]
                    });
                }

                // Zet de data om
                zone_data.forEach(function(d) {
                    d.date = formatDate_2.parse(d.date);
                    d.frequency = +d.frequency;
                });

                // Mep de zonedata in de grote array
                eval("floor_" + floor + "[keys_floor_" + floor + "[i]] = zone_data");
            }
        }

        // Maak een data object voor overzicht
		var data = {general:data_general, floor_1: floor_1, floor_2: floor_2, floor_3: floor_3};

        // Maak de 4 linegraphs aan met proxGrapher
        proxGrapher(data.general, "prox-general");
        proxGrapher(data.floor_1, "prox-svg_1");
        proxGrapher(data.floor_2, "prox-svg_2");
        proxGrapher(data.floor_3, "prox-svg_3");

        // parallellCoordinator(data, "floor1", "#parallel_1")
        // parallellCoordinator(data, "floor2", "#parallel_2")
        // parallellCoordinator(data, "floor3", "#parallel_3")

        // Bind de mouseover/mouseout en click events voor de fixed prox linegraphs
        bindProxEvents();
        hideLoadingIcon();
	});
})();

/* Functie om 0 waarden in te vullen bij data die mist
* Getallen met 1 karakterplek moeten zero-padded zijn.
*/
function makeMissingData(obj) {
    // Kopieer freq en krijg de keys
    var freq = obj;
    var freqKeys = Object.keys(freq);
    // Bekijk voor elke dag
    for (var j = 0; j < dataDays.length; j++) {
        var day = dataDays[j];
        // Bekijk voor elk uur
        for (var k = 0; k < dataHours.length; k++) {
            var hour = dataHours[k];
            // 31 mei
            if (day === 31) {
                if (hour < 10) {
                    if (freqKeys.indexOf("2016-05-31 0" + hour) === -1) {
                        freq["2016-05-" + day + " 0" + hour] = 0;
                    }
                }
                else {
                    if (freqKeys.indexOf("2016-05-31 " + hour) === -1) {
                        freq["2016-05-" + day + " " + hour] = 0;
                    }
                }
            } else if (day < 10) {
                // Dagen in juni
                if (hour < 10) {
                    if (freqKeys.indexOf("2016-06-0" + day + " 0" + hour) === -1) {
                        freq["2016-06-0" + day + " 0" + hour] = 0;
                    }
                } else {
                    if (freqKeys.indexOf("2016-06-0" + day + " " + hour) === -1) {
                        freq["2016-06-0" + day + " " + hour] = 0;
                    }
                }
            } else {
                if (hour < 10) {
                    if (freqKeys.indexOf("2016-06-" + day + " 0" + hour) === -1) {
                        freq["2016-06-" + day + " 0" + hour] = 0;
                    }
                } else {
                    if (freqKeys.indexOf("2016-06-" + day + " " + hour) === -1) {
                        freq["2016-06-" + day + " " + hour] = 0;
                    }
                }
            }
        }
    }
    // Geef het object terug met nullen voor de missende data
    return freq;
}

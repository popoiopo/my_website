var color_palet = ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"];

for (var i = 0; i < info.length; i++) {
	for (var e = 0; e < country_codes.length; e++) {
		if (document.getElementById(country_codes[e][0]) !== null) {
			if (info[i].Country_Code === country_codes[e][1]) {
				if (0 <= info[i].Price && info[i].Price < 0.5) 
					document.getElementById(country_codes[e][0]).style.fill = color_palet[0];
				if (0.5 <= info[i].Price && info[i].Price < 1) 
					document.getElementById(country_codes[e][0]).style.fill = color_palet[1];
				if (1 <= info[i].Price && info[i].Price < 1.5) 
					document.getElementById(country_codes[e][0]).style.fill = color_palet[2];
				if (1.5 <= info[i].Price && info[i].Price < 2) 
					document.getElementById(country_codes[e][0]).style.fill = color_palet[3];
				if (2 <= info[i].Price && info[i].Price < 2.5) 
					document.getElementById(country_codes[e][0]).style.fill = color_palet[4];
				if (2.5 <= info[i].Price && info[i].Price < 3) 
					document.getElementById(country_codes[e][0]).style.fill = color_palet[5];
				if (3 <= info[i].Price) 
					document.getElementById(country_codes[e][0]).style.fill = color_palet[6];
			};
		};
	};
};

function newtab(url )
{
  var win=window.open(url, '_blank');
}
/*
proxExtended.js

Wessel de Jong
10206620

Programmeerproject
Prox data
*/

var dateformat = d3.time.format("%Y-%m-%d").parse;
var dateformat_2 = d3.time.format("%a %d %b")

function parallellCoordinator(data, floor, id) {
    var floorDivSuffix;
    if (floor === "floor1") {
        floorDivSuffix = "floor-1";
    } else if (floor === "floor2") {
        floorDivSuffix = "floor-2";
    } else {
        floorDivSuffix = "floor-3";
    }


	var parallel = data["parallelData"];
	var heat = data["heatData"];

	var tooltip = d3.select("body")
	    .append("div")
	    .style("position", "absolute")
	    .style("z-index", "10")
	    .style("visibility", "hidden")
	    .html("")
	    .attr("id","tooltip");

  	// credits for parallel coordinates graph go to: http://bl.ocks.org/jasondavies/1341281
	var margin = {top: 115, right: 10, bottom: 10, left: 10},
		width = 760 - margin.left - margin.right,
		height = 550 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
				.rangePoints([0, width], 1),
		y = {},
		dragging = {};

	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		background,
		foreground;

	var svg = d3.select("#wrapper-" + floorDivSuffix).select("#first-" + floorDivSuffix).select(id)
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)
		//   .attr("display", "none")
		  .attr("class", "parallels")
		.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var proxy = dataConverter(parallel, floor);

	// Extract the list of dimensions and create a scale for each.
	x.domain(dimensions = d3.keys(parallel[Object.keys(parallel)[0]]).filter(function(d) {
		return d != "name" && (y[d] = d3.scale.linear()
		    .range([height, 0]))
			.tickFormat();
  	}));

	// get global max and set domain of each axis
	var max = 0

	dimensions.forEach(function(d){
		proxy.forEach(function(e){
			if(e[d] > max) {
				max = e[d];
			}
		})
	})

	for (key in y){
		y[key].domain([0, max])
	}

  	// Add grey background lines for context.
	background = svg.append("g")
		  .attr("class", "background")
		.selectAll("path")
		  .data(proxy)
		.enter().append("path")
		  .attr("d", path)
		  .style({'stroke-width' : '1.2'});

	// Add blue foreground lines for focus.
	foreground = svg.append("g")
		  .attr("class", "foreground" )
		.selectAll("path")
		  .data(proxy)
		.enter().append("path")
		  .attr("d", path)
		  .style({'stroke-width' : '1.2'})
		.on("click", function(n) {

			d3.selectAll(".active")
                .style("stroke", "steelblue")
                .style("stroke-width", "1.2");

			d3.selectAll('.foreground').select(".active").classed("active", false);

			d3.select(this).classed('active',true);

			heatmapper(heat[n.name], floor)
			tableMaker(n, floor)
		})

		.on("mouseover", function(){

			d3.selection.prototype.moveToFront = function() {
		      return this.each(function(){
		        this.parentNode.appendChild(this);
		      });
		    };

			d3.select(this).moveToFront()
		    	.style({'stroke-width' : '2.5'})
		    	.style("stroke", "red")
	    })

	    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	    .on("mouseout", function(d){
	    	if (!d3.select(this).classed("active")) {
				d3.select(this).transition().duration(100)
					.style({'stroke': 'steelblue' })
					.style({'stroke-width' : '1.2'})
					// return tooltip.style("visibility", "hidden");
			};
	    });

	// Add a group element for each dimension.
	var g = svg.selectAll(".dimension")
		  .data(dimensions)
		.enter().append("g")
		  .attr("class", "dimension")
		  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		  .call(d3.behavior.drag()
	        .origin(function(d) { return {x: x(d)}; })
	        .on("dragstart", function(d) {
	          dragging[d] = x(d);
	          background.attr("visibility", "hidden");
	        })
	        .on("drag", function(d) {
	          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
	          foreground.attr("d", path);
	          dimensions.sort(function(a, b) { return position(a) - position(b); });
	          x.domain(dimensions);
	          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
	        })
	        .on("dragend", function(d) {
	          delete dragging[d];
	          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
	          transition(foreground).attr("d", path);
	          background
	              .attr("d", path)
	            .transition()
	              .delay(500)
	              .duration(0)
	              .attr("visibility", null);
	        }));

	// Add an axis and title.
	g.append("g")
		  .attr("class", "axis")
		  .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
		.append("text")
		  .style("text-anchor", "middle")
		  .attr("y", -9)
		  .text(function(d) { return dateformat_2(dateformat(d)); })
		  .attr("dy", ".7em")
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
		  .attr("transform", "rotate(45)");

	// Add and store a brush for each axis.
	g.append("g")
		  .attr("class", "brush")
		  .each(function(d) {
		    d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
		  })
		.selectAll("rect")
		  .attr("x", -8)
		  .attr("width", 16);

	function position(d) {
		var v = dragging[d];
		return v == null ? x(d) : v;
	}

	function transition(g) {
		return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
		return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
	};

	// when brushing, don’t trigger axis dragging
	function brushstart() {
	    d3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
		var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
			  extents = actives.map(function(p) { return y[p].brush.extent(); });
			foreground.style("display", function(d) {
				return actives.every(function(p, i) {
				  return extents[i][0] <= d[p] && d[p] <= extents[i][1];
			}) ? null : "none";
		});
	}
};

function dataConverter(data, floor) {
	var proxy = []

	for (key in data){
		var temp = {}
		temp["name"] = key
		for (sleutel in data[key]) {
			if (sleutel != "name") {
				temp[sleutel] = 0
				if (data[key][sleutel].hasOwnProperty(floor)){
					for (cle in data[key][sleutel][floor]) {
						temp[sleutel] +=  data[key][sleutel][floor][cle].length
					};
				};
			};
		}
		proxy.push(temp);
	}

	return proxy;
};

function tableMaker (data, floor) {
    var floorDivSuffix;
    if (floor === "floor1") {
        floorDivSuffix = "floor-1";
    } else if (floor === "floor2") {
        floorDivSuffix = "floor-2";
    } else {
        floorDivSuffix = "floor-3";
    }

	var sum = 0,
		length = 0;

	for (day in data){
		if (day != "name") {
			sum += data[day];
			length++;
		};
	};

	var mean = parseInt(sum/length)

	document.getElementById("table-" + floorDivSuffix).style.display = "block";

	document.getElementById("floortext-" + floorDivSuffix).innerHTML = floor[floor.length - 1];
	document.getElementById("floortext-" + floorDivSuffix).style.fontWeight = 'bold';

	document.getElementById("proxidtext-" + floorDivSuffix).innerHTML = data["name"];
	document.getElementById("proxidtext-" + floorDivSuffix).style.fontWeight = 'bold';

	document.getElementById("detectionstext-" + floorDivSuffix).innerHTML = mean;
	document.getElementById("detectionstext-" + floorDivSuffix).style.fontWeight = 'bold';

};

function heatmapper(data, floor) {
    var floorDivSuffix;
    if (floor === "floor1") {
        floorDivSuffix = "floor-1";
    } else if (floor === "floor2") {
        floorDivSuffix = "floor-2";
    } else {
        floorDivSuffix = "floor-3";
    }

	document.getElementById("heatie-" + floorDivSuffix).style.display = "block";

	d3.select("#wrapper-" + floorDivSuffix).select("#second-" + floorDivSuffix).select("#heater-" + floorDivSuffix).remove()

	var zones = {
		"floor1": ["zone1", "zone2", "zone3", "zone4", "zone5", "zone6", "zone7", "zone8"],
		"floor2": ["zone1", "zone2", "zone3", "zone4", "zone5", "zone6", "zone7"],
		"floor3": ["zone1", "zone2", "zone3", "zone4", "zone5", "zone6", "zoneServerRoom"]
	};

	var margin_heat = { top: 115, right: 10, bottom: 10, left: 50 },
		width_heat = 800 - margin_heat.left - margin_heat.right,
		height_heat = 400 - margin_heat.top - margin_heat.bottom,
		gridSize = Math.floor(width_heat / 25),
		legendElementWidth = gridSize,
		// colors = ["#ffffd3","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
		colors = ["#ffffd3","#c7e9b4","#41b6c4","#225ea8","#081d58"],
		days = ["Tue 31 May", "Wed 01 Jun", "Thu 02 Jun", "Fri 03 Jun", "Sat 04 Jun", "Sun 05 Jun", "Mon 06 Jun", "Tue 07 Jun", "Wed 08 Jun", "Thu 09 Jun", "Fri 10 Jun", "Sat 11 Jun", "Sun 12 Jun", "Mon 13 Jun"];

	var svg = d3.select("#wrapper-" + floorDivSuffix).select("#second-" + floorDivSuffix).select("#heatie-" + floorDivSuffix).append("svg")
	  .attr("width", width_heat + margin_heat.left + margin_heat.right)
	  .attr("height", height_heat + margin_heat.top + margin_heat.bottom)
	  .attr("id", "heater-" + floorDivSuffix)
	  .append("g")
	  .attr("transform", "translate(" + margin_heat.left + "," + margin_heat.top + ")");

	var dayLabels = svg.selectAll(".dayLabel")
	  .data(zones[floor])
	  .enter().append("text")
	    .text(function (d) { return d; })
	    .attr("x", 12)
	    .attr("y", function (d, i) { return i * gridSize + 20; })
	    .style("text-anchor", "end")
	    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

	var timeLabels = svg.selectAll(".timeLabel")
	  .data(days)
	  .enter().append("text")
	    .text(function(d) { return d; })
	    .attr("x", function(d, i) { return 0.73 * i * gridSize + 25; })
	    .attr("y", function(d, i) { return - i * (gridSize * 0.73); })
	    .style("text-anchor", "end")
	    .attr("transform", "rotate(45)")
	    .attr("class", "days");

	var colorScale = d3.scale.quantile()
		.domain([0, 9 - 1, d3.max(data[floor], function (d) { return d.value; })])
		.range(colors);

	var cards = svg.selectAll(".hour")
	      .data(data[floor], function(d) {return days.indexOf(dateformat_2(dateformat(d.day))) +':'+ zones[floor].indexOf(d.zone);});

	cards.append("title");

	cards.enter().append("rect")
		.attr("y", function(d) { return ((zones[floor].indexOf(d.zone) - 1) * gridSize) + 50; })
		.attr("x", function(d) { return ((days.indexOf(dateformat_2(dateformat(d.day))) - 1) * gridSize) + 40; })
		.attr("rx", 4)
		.attr("ry", 4)
		.attr("class", "hour bordered")
		.attr("width", gridSize)
		.attr("height", gridSize)
		.style("fill", colors[0]);

	cards.transition().duration(1000)
		.style("fill", function(d) { return colorScale(d.value); })

	cards.select("title").text(function(d) { return d.value; });

	cards.exit().remove();

	var legend = svg.selectAll(".legend")
		.data([0].concat(colorScale.quantiles()), function(d) { return d; });

	legend.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", function(d, i) { return legendElementWidth * i * 1.5 + 100; })
		.attr("y", height_heat - 5)
		.attr("width", legendElementWidth * 1.5)
		.attr("height", gridSize / 2)
		.style("fill", function(d, i) { return colors[i]; });

	legend.append("text")
		.attr("class", "mono")
		.text(function(d) { return "≥ " + Math.round(d); })
		.attr("x", function(d, i) { return (legendElementWidth + 13) * i + 110; })
		.attr("y", height_heat - 10);

	legend.exit().remove();
};

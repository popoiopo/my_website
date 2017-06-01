/*
proxExtended.js

Wessel de Jong
10206620

Programmeerproject
Prox data
*/

// Functie die de linegraphs van de fixed prox data tekent
function proxGrapher(data, id) {
    // Afmetingen definieren
	var margin = {top: 10, right: 30, bottom: 250, left: 60},
	    margin2 = {top: 430, right: 30, bottom: 170, left: 60},
		width = 1100 - margin.left - margin.right,
	    width2 = 1100 - margin2.left - margin2.right,
	    height = 650 - margin.top - margin.bottom,
	    height2 = 650- margin2.top - margin2.bottom;

    // Achtervoegsel van de div id waar de linegraph in moet komen
    var fixedProxSuffix;
    if (id === "prox-general") {
        fixedProxSuffix = "general";
    } else if (id === "prox-svg_1") {
        fixedProxSuffix = "floor-1";
    } else if (id === "prox-svg_2") {
        fixedProxSuffix = "floor-2";
    } else {
        fixedProxSuffix = "floor-3";
    }

    // D3 date parser
	var parseDate = d3.time.format("%a %b %d %Y %H:%M:%S").parse;

    // Leuke kleuren maken
	var color = d3.scale.category10();

    // Bind de data keys aan de kleuren
	color.domain(Object.keys(data));

    // Bindt kleuren aan de data
	var floors = color.domain().map(function(floor) {
    	return {
    	  floor: floor,
    	  values: data[floor]
    	};
	});

    // Domein voor de x as bepalen
	var xDomain = [
		d3.min(floors, function(a) { return d3.min(a.values, function(b) {return b.date;}); }),
		d3.max(floors, function(a) { return d3.max(a.values, function(b) {return b.date;}); })
	];

	var x2Domain = xDomain;

    // Domein voor de y as bepalen
	var yDomain = [
		d3.min(floors, function(c) { return d3.min(c.values, function(v) { return v.frequency; }); }),
		d3.max(floors, function(c) { return d3.max(c.values, function(v) { return v.frequency; }); })
	];

	var y2Domain = yDomain;

    // X schalen definieren
	var x = d3.time.scale()
			.range([0, width])
			.domain(xDomain)
            .nice(),
	    x2 = d3.time.scale()
	    	.range([0, width2])
	    	.domain(x2Domain)
            .nice();

    // Y schalen definieren
	var y = d3.scale.linear()
			.range([height, 0])
			.domain(yDomain)
            .nice(),
	    y2 = d3.scale.linear()
	    	.range([height2, 0])
	    	.domain(y2Domain)
            .nice();

    // X as voor de linegraphs
    // De tickformats zorgen ervoor dat de dag en de maand ook weergegeven worden, maar dan worden de uren niet weergegeven als er wordt ingezoomd met de brush
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
        // .tickFormat(d3.time.format("%a %d %b"));

    // X as voor de brush
	var xAxis2 = d3.svg.axis()
	    .scale(x2)
	    .orient("bottom");
        // .tickFormat(d3.time.format("%a %d %b"));

    //Y as voor de linegraphs
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

    // De brush zelf definieren
	var brush = d3.svg.brush()
	    .x(x2)
	    .on("brush", brushed);

    // Definieer line voor de linegraphs
	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.frequency); });

    // Definieer line2 voor de brushlines
	var line2 = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x2(d.date); })
	    .y(function(d) { return y2(d.frequency); });

    // Maak een svg om op te tekenen en plak deze adhv welke floor meegegeven wordt
	var svg = d3.select("#fixed-prox-div-" + fixedProxSuffix).append("svg")
		.attr("id", id)
		.attr("class", "svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

    // Clip path zodat de lijnen niet langs de assen komen
	svg.append("defs").append("clipPath")
	    .attr("id", "clip-fixed-prox-" + fixedProxSuffix)
        .append("rect")
    	    .attr("width", width)
    	    .attr("height", height);

    // Focus is waar de linegraphs op komen
	var focus = svg.append("g")
	    .attr("class", "focus")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Context is waar de brushlijnen op komen
	var context = svg.append("g")
	    .attr("class", "context")
	    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    // X as maken op de focus
	focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Y as maken op de focus
	focus.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Detections");

    // X as maken op de context
	context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    // Maak de brush op de context
	context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);

    // Maak een G voor de lijnen in de focus
	var floor = focus.selectAll(".floor")
        .data(floors)
        .enter().append("g")
            .attr("class", "floor");

    // Maak de lijntjes in de G in de focus
	floor.append("path")
        .attr("class", "prox-lines")
        .attr("id", function(d) { return id + "_" + d.floor; })
        .attr("clip-path", "url(#clip-fixed-prox-" + fixedProxSuffix + ")")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.floor); });

    // Maak een G voor de lijnen in de context
	var floor2 = context.selectAll(".floor")
        .data(floors)
        .enter().append("g")
            .attr("class", "floor");

    // Maak de lijntjes in de G in de context
	floor2.append("path")
        .attr("class", "prox-lines")
        .attr("id", function(d) { return id + "_" + d.floor + "_slider"; })
        .attr("d", function(d) { return line2(d.values); })
        .style("stroke", function(d) { return color(d.floor); });

    // Functie die wordt aangeroepen als de brush wordt gebruikt
	function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.selectAll("path.prox-lines").attr("d", function(d) { return line(d.values); });
        focus.select(".x.axis").call(xAxis);
	}
}

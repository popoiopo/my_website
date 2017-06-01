// loads all data files asynchronously
queue()
  .defer(d3.csv, 'vhosts/happiness/data_files/data.csv')
  .defer(d3.csv, 'vhosts/happiness/data_files/data_par.csv')
  .defer(d3.csv, 'vhosts/happiness/data_files/codes.csv')
  .await(makelinked_views);

// the wonderfull function that start all the magic!!
function makelinked_views(error, data, data_par, codes) {

  // draws map
  drawmap();

  //draws legend
  draw_legend(data);

  // credits for parallel coordinates graph go to: http://bl.ocks.org/jasondavies/1341281
  var margin = {top: 115, right: 10, bottom: 10, left: 10},
      width = 960 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
      y = {},
      dragging = {};

  var line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      background,
      foreground;

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(data_par[0]).filter(function(d) {
    return d != "country" && (y[d] = d3.scale.linear()
        .domain(d3.extent(data_par, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data_par)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data_par)
    .enter().append("path")
      .attr("d", path);

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
      .attr("class", "variable")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

  // making the interactive clickable variable names
  g.append("g")
      .attr("class", "clickable")
    .append("text")
      .attr("id", function(d) { return d; })
      .attr("y", -100)
      .style("text-anchor", "middle")
      .style("font-size", "15px")
      .style("fill", "black")
      .text(function(d) { return d; })
      .on("click", function(d) {
        drawmap(d);
      });    

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

  // render map
  function drawmap(variable) {
  	// sets default variable for first load
    variable = variable || "life_expectancy";

    // removes the datamap on reload when new variable is chosen
    d3.select(".datamap").remove();

    // updates the legend for reload
    update_legend(data, variable);

    // makes int instead of string for data
    data.forEach(function(d) {
      d.country = d.country;
      d.life_expectancy = +d.life_expectancy;
      d.well_being = +d.well_being;
      d.happy_life_years = +d.happy_life_years;
      d.footprint = +d.footprint;
      d.HPI = +d.HPI;
      d.population = +d.population;
      d.GDP = +d.GDP;

      // adds content to label variable in order to be able to find countries
      codes.forEach(function(i) {
        if (d.country == i.country) {
            d.label = i.label3;
        };
      });
    });

    var dataset = {};

    // extracts all values from given variable, then calculates max and min value
    var onlyValues = data.map(function(obj){ return obj[variable] });
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // makes a pallet scale for the map
    var paletteScale = d3.scale.linear()
        .domain([minValue,maxValue])
        .range(["#edf8fb","#005824"]); // green color

    // fill dataset in appropriate format
    data.forEach(function(item){ 
        dataset[item.label] = { population: item.population, GDP: item.GDP, life_expectancy: item.life_expectancy, 
          well_being: item.well_being, happy_life_years: item.happy_life_years, footprint: item.footprint,
          HPI: item.HPI, fillColor: paletteScale(item[variable]) };
    });

    // actually making that pretty map!
    new Datamap({
        element: document.getElementById('container'),
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
              highlight(geography.properties.name);
            });
        },
        scope: 'world',
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#B3B5B5' },
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // change color on mouse hover
            highlightFillColor: '#a1d99b',
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<span id="infoname"<strong>', geo.properties.name, '</strong></span>',
                    '<br>population: <span style="color:yellow"<strong>', data.population, '</strong></span>',
                    '<br>GDP: <span style="color:yellow"<strong>', data.GDP, '</strong></span>',
                    '<br>Life expectancy: <span style="color:yellow"<strong>', data.life_expectancy, '</strong></span>',
                    '<br>Well being: <span style="color:yellow"<strong>', data.well_being, '</strong></span>',
                    '<br>Happy life years: <span style="color:yellow"<strong>', data.happy_life_years, '</strong></span>',
                    '<br>Carbon footprint: <span style="color:yellow"<strong>', data.footprint, '</strong></span>',
                    '<br>Happy people index: <span style="color:yellow"<strong>', data.HPI, '</strong></span>',
                    '</div>'].join('');
            }
        }
    });
  };

  // on click of a country, highlights the line representing that country in the parallel coords graph
  function highlight(country) {
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    //text for pop up tip
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Country:</strong></br><span class='pop_up_country'>" + country + "</span>";
      })

    svg.call(tip);

    // updates the chosen line and makes it interactive
    for (var i = 0; i < data_par.length; i++) {
      if (foreground[0][i].__data__.country == country) {
        d3.select(foreground[0][i])
          .style("stroke", "red")
          .style("stroke-width", "3")
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .on("click",function(){
            var move = d3.select(this);
            move.moveToFront();
          });
      }
    };
  }

  // drawing the initial legend
  function draw_legend(data, variable) {
  	variable = variable || "life_expectancy";
  	var width = 900;
  	var height = 20;

  	// re-evaluates variable values
  	var onlyValues = data.map(function(obj){ return obj[variable] });
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // selects body and appends svg
  	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	// calculates gradient
	var gradient = svg.append("defs")
	  .append("linearGradient")
	    .attr("id", "gradient")
	    .attr("x1", "0%")
	    .attr("y1", "100%")
	    .attr("x2", "100%")
	    .attr("y2", "100%")
	    .attr("spreadMethod", "pad");

	gradient.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#edf8fb")
	    .attr("stop-opacity", 1);

	gradient.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#005824")
	    .attr("stop-opacity", 1);

	// actually applies gradient
	svg.append("rect")
	    .attr("width", width)
	    .attr("height", height)
	    .style("fill", "url(#gradient)")

	// appends values in text to legend
	svg.append("text")
	  	.attr("class", "legend_value")
	  	.attr("id", "maximum")
	    .attr("x", width - 150)
	    .attr("y", (height / 2) + 2)
	    .style("fill", "white")
	    .style("font-weight", "bold")
	    .text("Maximum value: " + maxValue)

	svg.append("text")
	  	.attr("class", "legend_value")
	  	.attr("id", "minimum")
	    .attr("x", 50)
	    .attr("y", (height / 2) + 2)
	    .style("fill", "black")
	    .style("font-weight", "bold")
	    .text("Minimum value: " + minValue);

	svg.append("text")
	  	.attr("class", "legend_value")
	  	.attr("id", "var_name")
	    .attr("x", (width / 2) - 50)
	    .attr("y", height - 6)
	    .style("text-anchor", "left")
	    .style("fill", "yellow")
	    .style("font-size", 14)
	    .style("font-weight", "bold")
	    .text(variable);
  }

  // whenever another variable is chosen, updates the legend
  function update_legend(data, variable) {
  	var onlyValues = data.map(function(obj){ return obj[variable] });
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

	d3.select("#maximum")
		.text("Maximum value: " + maxValue);
	d3.select("#minimum")
		.text("Minimum value: " + minValue);
	d3.select("#var_name")
		.text(variable);
  };

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
  }

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
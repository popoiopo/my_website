// Set the dimensions of the canvas / graph
var margin = {top: 75, right: 80, bottom: 70, left: 50},
    width = 960 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Set x range
var x = d3.time.scale().range([0, width]);

// set y range
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
    .orient("left");

// Parse the date / time
var formatDate = d3.time.format("%d-%b"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Define the line
var line1 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temp_max); });

var line2 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temp_min); });

var line3 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temp_avg); });
    
var lineSvg = svg.append("g"); 

var focus = svg.append("g") 
    .style("display", "none");

// retrieve data
d3.csv("vhosts/weather/schiphol.csv", function(error, data) {
  if(error) console.log("Error: data not landed.");
    
    data.forEach(function(d) {
        d.date = d3.time.format("%Y%m%d").parse(d.date);
        d.temp_avg = +d.temp_avg;
        d.temp_min = +d.temp_min;
        d.temp_max = +d.temp_max;
    });

    // set domain
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([
      d3.min(data, function(d) { return d.temp_min; }),
      d3.max(data, function(d) { return d.temp_max; })
    ]);

    // Add the line path.
    lineSvg.append("path")
        .style("stroke", "red")
        .style("fill", "none")
        .attr("class", "line1")
        .attr("d", line1(data));

    // Add the line path.
    lineSvg.append("path")
        .style("stroke", "steelblue")
        .style("fill", "none")
        .attr("class", "line2")
        .attr("d", line2(data));

    // Add the line path.
    lineSvg.append("path")
        .style("stroke", "purple")
        .style("fill", "none")
        .attr("class", "line3")
        .attr("d", line3(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // making title
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 45)
      .text("Time in months of the year 2015")  

    // making y axis title
    svg.append("g")
      .attr("class", "y title")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", '12px')
      .text("Average temperature (degrees Celsius)");

    // making the title
    svg.append("text")
      .attr("x", (width / 2))           
      .attr("y", -(margin.top - 25))  
      .attr("text-anchor", "middle")  
      .style("font-size", "20px") 
      .style("text-decoration", "underline")  
      .text("Average temperature during the year 2015 in Schiphol");

    // showing data source
    svg.append("text")
      .attr("class", "data_source")
      .attr("text-anchor", "begin")
      .attr("x", 0)
      .attr("y", height + 60)
      .text("Data source: http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi")
      .style("font-size", '10px'); 

    // credits for interactivity go to: http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

    // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    var y_class = ["y1", "y2", "y3"];        

    for (var i = 0; i < y_class.length; i++) {
    // append the y lines
      focus.append("line")
          .attr("class", y_class[i])
          .style("stroke", "blue")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .attr("x1", width)
          .attr("x2", width);

      // appending circles
      focus.append("circle")
        .attr("class", y_class[i])
        .style("fill", "red")
        .style("stroke", "blue")
        .attr("r", 3);      
    };

    var color = ["purple", "steelblue", "red"];
    var class_name = ["avg_y1", "min_y1", "max_y1"];

    // place the values
    for (var i = 0; i < color.length; i++) {
      focus.append("text")
        .attr("class", class_name[i])
        .attr("dx", 8)
        .attr("dy", "-.3em")
        .style("fill", color[i]); 
    };
          
    // place the date
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "1em")
        .style("fill", "black");    

    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

    focus.select("circle.y1")
      .attr("transform",
            "translate(" + x(d.date) + "," +
                           y(d.temp_avg) + ")");
    focus.select("circle.y2")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.temp_min) + ")");
    focus.select("circle.y3")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.temp_max) + ")");

    focus.select("text.avg_y1")
        .attr("transform",
              "translate(" + (width - 100) + "," + 43 + ")")
        .text("Average temperature: " + d.temp_avg);

    focus.select("text.min_y1")
        .attr("transform",
              "translate(" + (width - 100) + "," + 56 + ")")
        .text("Minimum temperature: " + d.temp_min);

    focus.select("text.max_y1")
        .attr("transform",
              "translate(" + (width - 100) + "," + 30 + ")")       
        .text("Maximum temperature: " + d.temp_max);

    focus.select("text.y2")
        .attr("transform",
              "translate(" + (width - 100) + "," + 0 + ")")
        .style("font-weight", "bold")
        .text("Date: " + formatDate(d.date));        

    focus.select("line.x")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.temp_max) + ")")
                   .attr("y2", height - y(d.temp_max));                   

    focus.select("line.y1")
        .attr("transform",
              "translate(" + width * -1 + "," +
                             y(d.temp_avg) + ")")
                   .attr("x2", width + width);

    focus.select("line.y2")
        .attr("transform",
              "translate(" + width * -1 + "," +
                             y(d.temp_min) + ")")
                   .attr("x2", width + width);

    focus.select("line.y3")
        .attr("transform",
              "translate(" + width * -1 + "," +
                             y(d.temp_max) + ")")
                   .attr("x2", width + width);                                      
  }
});

function update_data() {
  var input = dropdown.options[dropdown.selectedIndex].value;
  input = +input;
  if (input == 1) {
    // retrieve data again
    d3.csv("vhosts/weather/schiphol.csv", function(error, data) {
      if(error) console.log("Error: data not landed.");
        
        data.forEach(function(d) {
            d.date = d3.time.format("%Y%m%d").parse(d.date);
            d.temp_avg = +d.temp_avg;
            d.temp_min = +d.temp_min;
            d.temp_max = +d.temp_max;
        });
      
      // set domain again
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([
        d3.min(data, function(d) { return d.temp_min; }),
        d3.max(data, function(d) { return d.temp_max; })
      ]);      

      // Select the section to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
      svg.select(".line1")   // change the line
          .duration(750)
          .attr("d", line1(data));
      svg.select(".line2")   // change the line
          .duration(1000)
          .attr("d", line2(data));
      svg.select(".line3")   // change the line
          .duration(1250)
          .attr("d", line3(data));
      svg.select(".x.axis") // change the x axis
          .duration(750)
          .call(xAxis);
      svg.select(".y.axis") // change the y axis
          .duration(750)
          .call(yAxis);
    });
  } else if(input == 2) {
    // retrieve data again
    d3.csv("vhosts/weather/rotterdam.csv", function(error, data) {
      if(error) console.log("Error: data not landed.");
        
        data.forEach(function(d) {
            d.date = d3.time.format("%Y%m%d").parse(d.date);
            d.temp_avg = +d.temp_avg;
            d.temp_min = +d.temp_min;
            d.temp_max = +d.temp_max;
        });         
      
      // set domain again
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([
        d3.min(data, function(d) { return d.temp_min; }),
        d3.max(data, function(d) { return d.temp_max; })
      ]);      

      // Select the section we want to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
      svg.select(".line1")   // change the line
          .duration(1000)
          .attr("d", line1(data));
      svg.select(".line2")   // change the line
          .duration(750)
          .attr("d", line2(data));
      svg.select(".line3")   // change the line
          .duration(1250)
          .attr("d", line3(data));
      svg.select(".x.axis") // change the x axis
          .duration(750)
          .call(xAxis);
      svg.select(".y.axis") // change the x axis
          .duration(750)
          .call(yAxis);    
    });
  };
}; 
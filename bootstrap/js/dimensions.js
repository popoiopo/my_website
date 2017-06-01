/*
* Team Gosia Warriors
* Gedeelde file voor general.html, floor1.html, floor2.html en floor3.html
*/

// Redirect bij druk op de knop
$(".button").click(function() {
    window.location = this.value;
});

// Maak eerst alle divs onzichtbaar, want
$(".floor-graphs-div").css("display", "none");

// maak ze alleen zichtbaar bij een druk op een van de floor knoppen
$(".floor-button").click(function() {
    // Geef aan welke knop is aangeklikt
    $(".floor-button").not(this).each(function() {
        $(this).css("background-color", "blue");
    });
    $(this).css("background-color", "red");

    $(".floor-graphs-div").css("display", "none");
    $("#floor-graphs-" + this.value).css("display", "");

    d3.selectAll(".active").style("stroke", "steelblue");
    d3.selectAll(".foreground").select(".active").classed("active", false);

    // Houd bij in een onzichtbare paragraph welke verdieping geshowd wordt
    // $("#current-visible-floor").html($(this).attr("number"));
});

// Afmetingen van de svg op de pagina
var margin = {top: 10, bottom: 175, left: 60, right: 30};
var width = 1100 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

var brushMargin = {top: 430, right: 30, bottom: 50, left: 60};
var brushHeight = 550 - brushMargin.top - brushMargin.bottom;

// Functie om de datum van de JSON om te zetten naar javascript Date
var dateFormat = d3.time.format("%Y-%m-%d %X");
var csvDateFormat = d3.time.format("%d-%m-%Y %H:%M");

// svg elementen voor elk van de vier pagina's
var svg = {
    general: d3.select("#general-div").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    f1: d3.select("#f1-div").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    f2: d3.select("#f2-div").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    f3: d3.select("#f3-div").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
};

// x schalen voor elk van de vier pagina's
var x = {
    general: d3.time.scale()
                .range([0, width]),
    f1: d3.time.scale()
            .range([0, width]),
    f2: d3.time.scale()
            .range([0, width]),
    f3: d3.time.scale()
            .range([0, width])
};

// x schalen voor de brush op elke pagina
var brushX = {
    general: d3.time.scale()
                .range([0, width]),
    f1: d3.time.scale()
            .range([0, width]),
    f2: d3.time.scale()
            .range([0, width]),
    f3: d3.time.scale()
            .range([0, width])
};

// y schalen voor elk van de vier pagina's
var y = {
    general: d3.scale.linear()
                .range([height, 0]),
    f1: d3.scale.linear()
            .range([height, 0]),
    f2: d3.scale.linear()
            .range([height, 0]),
    f3: d3.scale.linear()
            .range([height, 0])
};

// y schalen voor de brush op elke pagina
var brushY = {
    general: d3.scale.linear()
                .range([brushHeight, 0]),
    f1: d3.scale.linear()
            .range([brushHeight, 0]),
    f2: d3.scale.linear()
            .range([brushHeight, 0]),
    f3: d3.scale.linear()
            .range([brushHeight, 0])
};

// x assen voor elk van de vier pagina's
// De tickformats zorgen ervoor dat de dag en de maand ook weergegeven worden, maar dan worden de uren niet weergegeven als er wordt ingezoomd met de brush
var xAxis = {
    general: d3.svg.axis()
                .scale(x.general)
                .orient("bottom")
                .ticks(14),
                // .tickFormat(d3.time.format("%a %d %b")),
    f1: d3.svg.axis()
            .scale(x.f1)
            .orient("bottom")
            .ticks(14),
            // .tickFormat(d3.time.format("%a %d %b")),
    f2: d3.svg.axis()
            .scale(x.f2)
            .orient("bottom")
            .ticks(14),
            // .tickFormat(d3.time.format("%a %d %b")),
    f3: d3.svg.axis()
            .scale(x.f3)
            .orient("bottom")
            .ticks(14)
            // .tickFormat(d3.time.format("%a %d %b"))
};

// x as voor de brush op elke pagina
// De tickformats zorgen ervoor dat de dag en de maand ook weergegeven worden, maar dan worden de uren niet weergegeven als er wordt ingezoomd met de brush
var brushXAxis = {
    general: d3.svg.axis()
                .scale(brushX.general)
                .orient("bottom")
                .ticks(14),
                // .tickFormat(d3.time.format("%a %d %b")),
    f1: d3.svg.axis()
            .scale(brushX.f1)
            .orient("bottom")
            .ticks(14),
            // .tickFormat(d3.time.format("%a %d %b")),
    f2: d3.svg.axis()
            .scale(brushX.f2)
            .orient("bottom")
            .ticks(14),
            // .tickFormat(d3.time.format("%a %d %b")),
    f3: d3.svg.axis()
            .scale(brushX.f3)
            .orient("bottom")
            .ticks(14)
            // .tickFormat(d3.time.format("%a %d %b"))
};

// y assen voor elk van de vier pagina's
var yAxis = {
    general: d3.svg.axis()
                .scale(y.general)
                .orient("left"),
    f1: d3.svg.axis()
            .scale(y.f1)
            .orient("left"),
    f2: d3.svg.axis()
            .scale(y.f2)
            .orient("left"),
    f3: d3.svg.axis()
            .scale(y.f3)
            .orient("left")
};

// Lijnen voor elk van de vier pagina's adhv hun schalen
var line = {
    general: d3.svg.line()
                .x(function(d) {return x.general(d.timestamp);})
                .y(function(d) {return y.general(d.val);}),
    f1: d3.svg.line()
            .x(function(d) {return x.f1(d.timestamp);})
            .y(function(d) {return y.f1(d.val);}),
    f2: d3.svg.line()
            .x(function(d) {return x.f2(d.timestamp);})
            .y(function(d) {return y.f2(d.val);}),
    f3: d3.svg.line()
            .x(function(d) {return x.f3(d.timestamp);})
            .y(function(d) {return y.f3(d.val);})
};

// Lijnen van de brush op elke pagina
var brushLine = {
    general: d3.svg.line()
                .x(function(d) {return brushX.general(d.timestamp);})
                .y(function(d) {return brushY.general(d.val);}),
    f1: d3.svg.line()
            .x(function(d) {return brushX.f1(d.timestamp);})
            .y(function(d) {return brushY.f1(d.val);}),
    f2: d3.svg.line()
            .x(function(d) {return brushX.f2(d.timestamp);})
            .y(function(d) {return brushY.f2(d.val);}),
    f3: d3.svg.line()
            .x(function(d) {return brushX.f3(d.timestamp);})
            .y(function(d) {return brushY.f3(d.val);})
};

// Callback functie voor als de brush wordt gebruikt
var brushed = {
    general: function() {
        x.general.domain(brush.general.empty() ? brushX.general.domain() : brush.general.extent());
        focus.general.selectAll("path.lines-general").attr("d", line.general);
        focus.general.select("#general-x-axis").call(xAxis.general);
    },
    f1: function() {
        x.f1.domain(brush.f1.empty() ? brushX.f1.domain() : brush.f1.extent());
        focus.f1.selectAll("path.lines-f1").attr("d", line.f1);
        focus.f1.select("#f1-x-axis").call(xAxis.f1);
    },
    f2: function() {
        x.f2.domain(brush.f2.empty() ? brushX.f2.domain() : brush.f2.extent());
        focus.f2.selectAll("path.lines-f2").attr("d", line.f2);
        focus.f2.select(".x.axis").call(xAxis.f2);
    },
    f3: function() {
        x.f3.domain(brush.f3.empty() ? brushX.f3.domain() : brush.f3.extent());
        focus.f3.selectAll("path.lines-f3").attr("d", line.f3);
        focus.f3.select(".x.axis").call(xAxis.f3);
    }
};

// De brush zelf op elke pagina
var brush = {
    general: d3.svg.brush()
                .x(brushX.general)
                .on("brush", brushed.general),
    f1: d3.svg.brush()
            .x(brushX.f1)
            .on("brush", brushed.f1),
    f2: d3.svg.brush()
            .x(brushX.f2)
            .on("brush", brushed.f2),
    f3: d3.svg.brush()
            .x(brushX.f3)
            .on("brush", brushed.f3)
};

// Het canvas waarop de lijnen getekend worden
var focus = {
    general: svg.general.append("g")
                .attr("transform", "translate(0," + margin.top + ")"),
    f1: svg.f1.append("g")
                .attr("transform", "translate(0," + margin.top + ")"),
    f2: svg.f2.append("g")
                .attr("transform", "translate(0," + margin.top + ")"),
    f3: svg.f3.append("g")
                .attr("transform", "translate(0," + margin.top + ")")
};

// Het canvas waar de brush lijnen op komen
var context = {
    general: svg.general.append("g")
                .attr("class", "context")
                .attr("transform", "translate(0," + brushMargin.top + ")"),
    f1: svg.f1.append("g")
            .attr("class", "context")
            .attr("transform", "translate(0," + brushMargin.top + ")"),
    f2: svg.f2.append("g")
        .attr("class", "context")
        .attr("transform", "translate(0," + brushMargin.top + ")"),
    f3: svg.f3.append("g")
            .attr("class", "context")
            .attr("transform", "translate(0," + brushMargin.top + ")")
};

// Gedeelde functies
// Check of een variabele een array is
// Bron: http://stackoverflow.com/questions/8511281/check-if-a-variable-is-an-object-in-javascript
function isArray(variable) {
    return (!!variable) && (variable.constructor === Array);
}

// Check een string met een wildcard character *
// Bron: http://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
function wildcardCompare(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

// Events binden voor de prox graphs
function bindProxEvents() {
    $(".prox-lines").mouseover(function() {
        $(".prox-lines").not(this).each(function() {
            $(this).css("opacity", "0.2");
        });
    });

    $(".prox-lines").mouseout(function() {
        $(".prox-lines").each(function() {
            $(this).css("opacity", "1");
        });
    });

    $(".prox-checkbox").change(function() {
        $("#prox-" + this.value).toggle();
        $("#prox-" + this.value + "_slider").toggle();
    });
}

function hideLoadingIcon() {
    d3.select("#loading-icon").style("display", "none");
}

/*
* Team Gosia Warriors
* Javascript file bij general.html
* Tekent de visualisatie voor data die gaat over het gehele gebouw.
*/

(function() {
    // Lege arrays die worden gevuld met de ingelezen data
    var loopTempSchedule = [],
        supplySideOutletTemperature = [],
        waterHeaterGasRate = [],
        deliFanPower = [],
        supplySideInletMassFlowRate = [],
        hvacElectricDemandPower = [],
        heatScheduleValue = [],
        pumpPower = [],
        waterHeaterTankTemperature = [],
        supplySideInletTemperature = [],
        windDirection = [],
        totalElectricDemandPower = [],
        drybulbTemperature = [],
        waterHeaterSetpoint = [],
        windSpeed = [],
        coolScheduleValue = [];

    // Zones en verdiepingen waarvoor hazium data gemete is
    var haziumZones = ["F_1_Z_8A", "F_2_Z_2", "F_2_Z_4", "F_3_Z_1"];

    var haziumData = {};
    for (var i = 0; i < haziumZones.length; i++) {
        haziumData[haziumZones[i]] = [];
    }

    // Zet de div van de checkboxes eerst op onzichtbaar
    var generalCheckboxDiv = d3.select("#hazium-checkboxes");
    generalCheckboxDiv.style("display", "none");

    // Cache de checkboxes
    var checkboxLine1 = document.getElementById("general-checkbox-line-1");
    var checkboxLine2 = document.getElementById("general-checkbox-line-2");
    var checkboxLine3 = document.getElementById("general-checkbox-line-3");
    var checkboxLine4 = document.getElementById("general-checkbox-line-4");

    // Bind een on change event aan de checkboxes en toggle de lijnen die erbij horen
    $(".general-hazium-checkbox").change(function() {
        $("#general-" + this.value).toggle();
        $("#general-brush-" + this.value).toggle();
    });

    // Print header tekst adhv de dropdown keuze
    d3.select("#general-vis-info").text($("#general-dropdown :selected").text());

    // Event listener als de dropdown veranderd wordt
    $("#general-dropdown").change(changeGeneralHeader);

    function changeGeneralHeader() {
        // Update de header tekst
        d3.select("#general-vis-info").text($("#general-dropdown :selected").text());
        if ($("#general-dropdown :selected").val() == "haziumData") {
            generalCheckboxDiv.style("display", "");
        } else {
            generalCheckboxDiv.style("display", "none");
        }
        // Update de chart
        updateGeneralChart(eval($("#general-dropdown").val()));
    }

    d3.csv("json/hazium_data.csv", function(d) {
            // Format de data
            return {
                Time: new Date(csvDateFormat.parse(d.Time)),
                F_1_Z_8A: +d.F_1_Z_8A,
                F_2_Z_2: +d.F_2_Z_2,
                F_2_Z_4: +d.F_2_Z_4,
                F_3_Z_1: +d.F_3_Z_1
            };
        }, function(csverror, rows) {
            if (csverror) throw csverror;

            // Sla de data op in haziumData
            for (var i = 0; i < rows.length; i++) {
                for (var key in rows[i]) {
                    if (key !== "Time") {
                        haziumData[key].push({
                            timestamp: rows[i].Time,
                            val: rows[i][key]
                        });
                    }
                }
            }

            // Lees de data in
            d3.json("json/general-MC2.json", function(error, data) {
                if (error) throw error;

                for (var i = 0; i < data.length; i++) {
                    // Sla de timestamp en offset op om later te gebruiken
                    var datetime = new Date(dateFormat.parse(data[i].message["Date/Time"])/* - new Date().getTimezoneOffset() * 60 * 1000*/);
                    var timeoffset = data[i].offset;

                    // Vul de eerder gedefinieerde arrays met de ingelezen data
                    loopTempSchedule.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Loop Temp Schedule"]
                    });

                    supplySideOutletTemperature.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Supply Side Outlet Temperature"]
                    });

                    waterHeaterGasRate.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Water Heater Gas Rate"]
                    });

                    deliFanPower.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["DELI-FAN Power"]
                    });

                    supplySideInletMassFlowRate.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Supply Side Inlet Mass Flow Rate"]
                    });

                    hvacElectricDemandPower.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["HVAC Electric Demand Power"]
                    });

                    heatScheduleValue.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["HEAT Schedule Value"]
                    });

                    pumpPower.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Pump Power"]
                    });

                    waterHeaterTankTemperature.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Water Heater Tank Temperature"]
                    });

                    supplySideInletTemperature.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Supply Side Inlet Temperature"]
                    });

                    windDirection.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Wind Direction"]
                    });

                    totalElectricDemandPower.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Total Electric Demand Power"]
                    });

                    drybulbTemperature.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Drybulb Temperature"]
                    });

                    waterHeaterSetpoint.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Water Heater Setpoint"]
                    });

                    windSpeed.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["Wind Speed"]
                    });

                    coolScheduleValue.push({
                        timestamp: datetime,
                        offset: timeoffset,
                        val: +data[i].message["COOL Schedule Value"]
                    });
                }
                // Initialiseer de chart
                initGeneralChart(eval($("#general-dropdown").val()));
                
                $(".general-vis").click(function() {
                    if ($(this).parent("div#floor-graphs-general").length) {
                        $($("#floor-graphs-general-focus").contents()).appendTo("#floor-graphs-general");
                        $(this).appendTo("#floor-graphs-general-focus");
                    }
                });
            });
    });

    function initGeneralChart(dataVariable) {
        // Bereken de ranges van de data
        x.general.domain(d3.extent(dataVariable, function(d) {return d.timestamp;})).nice();
        y.general.domain([d3.min(dataVariable, function(d) {return d.val;}) - 0.1, d3.max(dataVariable, function(d) {return d.val;}) + 0.1]).nice();

        // Update ook de domeinen van de brushes
        brushX.general.domain(x.general.domain());
        brushY.general.domain(y.general.domain());

        // Bepaal waar de lijnen mogen verschijnen
        focus.general.append("defs").append("clipPath")
        .attr("id", "clip-general")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // Assen toevoegen
        focus.general.append("g")
            .attr("id", "general-x-axis")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis.general);

        focus.general.append("g")
            .attr("id", "general-y-axis")
            .attr("class", "y axis")
            .call(yAxis.general)
            // Een naam aan de y-as hangen
            .append("text")
                .attr("id", "general-y-label")
                .attr("transform", "rotate(-90)")
                .attr("y", 3)
                .attr("dy", ".75em")
                .style("text-anchor", "end")
                // Maak de label tekst de geselecteerde data uit de dropdown
                .text($("#general-dropdown :selected").text() + " (" + $("#general-dropdown :selected").attr("unit") + ")");

        // De lijn tekenen van de geselecteerde data
        focus.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-line")
            .attr("class", "lines-general")
            .attr("d", line.general)
            .attr("clip-path", "url(#clip-general)");

        // Dit zijn de lijnen voor de hazium data maar zet ze eerst op onzichtbaar
        focus.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-line-1")
            .attr("class", "lines-general")
            .attr("d", line.general)
            .attr("clip-path", "url(#clip-general)")
            .style("display", "none");

        focus.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-line-2")
            .attr("class", "lines-general")
            .attr("d", line.general)
            .attr("clip-path", "url(#clip-general)")
            .style("display", "none");

        focus.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-line-3")
            .attr("class", "lines-general")
            .attr("d", line.general)
            .attr("clip-path", "url(#clip-general)")
            .style("display", "none");

        focus.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-line-4")
            .attr("class", "lines-general")
            .attr("d", line.general)
            .attr("clip-path", "url(#clip-general)")
            .style("display", "none");

        // Plak de brush lijn in zijn eigen plekje
        var contextLine = context.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-brush-line")
            .attr("class", "lines-general")
            .attr("d", brushLine.general);

        // Brushlijnen voor de hazium data maar maak ze eerst onzichtbaar
        context.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-brush-line-1")
            .attr("class", "lines-general")
            .attr("d", brushLine.general)
            .style("display", "none");

        context.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-brush-line-2")
            .attr("class", "lines-general")
            .attr("d", brushLine.general)
            .style("display", "none");

        context.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-brush-line-3")
            .attr("class", "lines-general")
            .attr("d", brushLine.general)
            .style("display", "none");

        context.general.append("path")
            .datum(dataVariable)
            .attr("id", "general-brush-line-4")
            .attr("class", "lines-general")
            .attr("d", brushLine.general)
            .style("display", "none");

        // x as voor de brush slider
        context.general.append("g")
            .attr("id", "general-context-x-axis")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + brushHeight + ")")
            .call(brushXAxis.general);

        // Maak het oppervlak van de brush
        context.general.append("g")
            .attr("class", "x brush")
            .call(brush.general)
            .selectAll("rect")
                .attr("y", -6)
                .attr("height", brushHeight + 7);

        $(".lines-general").mouseover(function() {
            $(".lines-general").not(this).each(function() {
                $(this).css("opacity", "0.2");
            });
        });

        $(".lines-general").mouseout(function() {
            $(".lines-general").each(function() {
                $(this).css("opacity", "1");
            });
        });
    }

    function updateGeneralChart(dataVariable) {
        if (isArray(dataVariable)) {
            // Bereken de nieuwe ranges van de data
            x.general.domain(d3.extent(dataVariable, function(d) {return d.timestamp;})).nice();
            y.general.domain([d3.min(dataVariable, function(d) {return d.val;}) - 0.1, d3.max(dataVariable, function(d) {return d.val;}) + 0.1]).nice();

            // Update ook de domeinen van de brush
            brushX.general.domain(x.general.domain());
            brushY.general.domain(y.general.domain());

            // Pas de assen aan adhv de nieuwe ranges
            svg.general.select("#general-x-axis")
                .transition()
                    .duration(1000)
                    .call(xAxis.general);

            svg.general.select("#general-y-axis")
                .transition()
                    .duration(1000)
                    .call(yAxis.general);

            // Verander de labeltekst adhv de nieuwe data
            svg.general.select("#general-y-label")
                .transition()
                    .duration(1000)
                    .text($("#general-dropdown :selected").text() + " (" + $("#general-dropdown :selected").attr("unit") + ")");

            // Verander de gebonden data aan de lijn
            svg.general.select("#general-line")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", "");

            // Maak de hazium lijnen onzichtbaar
            svg.general.select("#general-line-1")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", "none");

            svg.general.select("#general-line-2")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", "none");

            svg.general.select("#general-line-3")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", "none");

            svg.general.select("#general-line-4")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", "none");

            // Pas de brush analoog aan de linechart aan
            var contextLine = context.general.select("#general-brush-line")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", "");

            // Maak de hazium brush lijnen onzichtbaar
            context.general.select("#general-brush-line-1")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", "none");

            context.general.select("#general-brush-line-2")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", "none");

            context.general.select("#general-brush-line-3")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", "none");

            context.general.select("#general-brush-line-4")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", "none");

            // Transition op de brush x as
            context.general.select("#general-context-x-axis")
                .transition()
                .duration(1000)
                    .call(brushXAxis.general);
        } else {
            // Het betreft de hazium concentraties
            var dataVariable = dataVariable;
            // Bepaal de nieuwe ranges
            x.general.domain(d3.extent(dataVariable.F_1_Z_8A, function(d) {return d.timestamp;})).nice();
            var yMin = 1000000;
            var yMax = 0;
            for (var zone in dataVariable) {
                if(d3.max(dataVariable[zone], function(d) {return d.val;}) > yMax) {
                    yMax = d3.max(dataVariable[zone], function(d) {return d.val;});
                }
                if(d3.min(dataVariable[zone], function(d) {return d.val;}) < yMin) {
                    yMin = d3.min(dataVariable[zone], function(d) {return d.val;});
                }
            }
            y.general.domain([yMin - 0.1, yMax + 0.1]).nice();

            // Update de brushdomeinen
            brushX.general.domain(x.general.domain());
            brushY.general.domain(y.general.domain());

            // Pas de assen aan adhv de nieuwe ranges
            svg.general.select("#general-x-axis")
                .transition()
                    .duration(1000)
                    .call(xAxis.general);

            svg.general.select("#general-y-axis")
                .transition()
                    .duration(1000)
                    .call(yAxis.general);

            // Verander de labeltekst adhv de nieuwe data
            svg.general.select("#general-y-label")
                .transition()
                    .duration(1000)
                    .text($("#general-dropdown :selected").text() + " (" + $("#general-dropdown :selected").attr("unit") + ")");

            // Verander de gebonden data aan de lijn en maak deze onzichtbaar
            svg.general.select("#general-line")
                .datum(dataVariable.F_1_Z_8A)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", "none");

            // Maak de haziumlijnen zichtbaar adhv de aangevinkte checkboxes
            svg.general.select("#general-line-1")
                .datum(dataVariable.F_1_Z_8A)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", function() {
                        if (checkboxLine1.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            svg.general.select("#general-line-2")
                .datum(dataVariable.F_2_Z_2)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", function() {
                        if (checkboxLine2.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            svg.general.select("#general-line-3")
                .datum(dataVariable.F_2_Z_4)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", function() {
                        if (checkboxLine3.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            svg.general.select("#general-line-4")
                .datum(dataVariable.F_3_Z_1)
                .transition()
                    .duration(1000)
                    .attr("d", line.general)
                    .style("display", function() {
                        if (checkboxLine4.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            // Pas de brush analoog aan de linechart aan en maak deze onzichtbaar
            var contextLine = context.general.select("#general-brush-line")
                .datum(dataVariable.F_1_Z_8A)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", "none");

            // Maak de haziumbrushlijnen zichtbaar adhv de aangevinkte checkboxes
            context.general.select("#general-brush-line-1")
                .datum(dataVariable.F_1_Z_8A)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", function() {
                        if (checkboxLine1.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            context.general.select("#general-brush-line-2")
                .datum(dataVariable.F_2_Z_2)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", function() {
                        if (checkboxLine2.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            context.general.select("#general-brush-line-3")
                .datum(dataVariable.F_2_Z_4)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", function() {
                        if (checkboxLine3.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            context.general.select("#general-brush-line-4")
                .datum(dataVariable.F_3_Z_1)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.general)
                    .style("display", function() {
                        if (checkboxLine4.checked) {
                            return "";
                        } else {
                            return "none";
                        }
                    });

            // Transition op de brush x as
            context.general.select("#general-context-x-axis")
                .transition()
                .duration(1000)
                    .call(brushXAxis.general);
        }
    }
})();

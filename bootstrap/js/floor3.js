/*
* Team Gosia Warriors
* Javascript file bij floor3.html, tekent de chart
*/

(function() {
    // Array van zones van floor 3 waarvoor sensorreadings zijn
    var f3zones = ["1", "2", "3", "5", "6", "7", "8", "9", "10", "11a", "11b", "11c", "12"];

    // Lege variabelen om later ingeladen data in op te slaan
    var f3lightsPower = {},
        f3equipmentPower = {},
        f3thermostatTemp = {},
        f3thermostatHeatingSetpoint = {},
        f3thermostatCoolingSetpoint = {},
        f3returnOutletCo2Concentration = {},
        f3supplyInletTemperature = {},
        f3supplyInletMassFlowRate = {},
        f3vavReheatDamperPosition = {},
        f3reheatCoilPower = {},
        f3vavAvailabilityManagerNightCycleControlStatus = [],
        f3vavSysSupplyFanFanPower = [],
        f3bathExhaustFanPower = [],
        f3vavSysHeatingCoilPower = [],
        f3vavSysOutdoorAirFlowFraction = [],
        f3vavSysOutdoorAirMassFlowRate = [],
        f3vavSysCoolingCoilPower = [],
        f3vavSysAirLoopInletTemperature = [],
        f3vavSysAirLoopInletMassFlowRate = [],
        f3vavSysSupplyFanOutletTemperature = [],
        f3vavSysSupplyFanOutletMassFlowRate = [];

    // Lege variabelen om later DOM elementen aan te binden
    var f3Zone1Checkbox, f3Zone2Checkbox, f3Zone3Checkbox, f3Zone5Checkbox, f3Zone6Checkbox, f3Zone7Checkbox, f3Zone8Checkbox,
        f3Zone9Checkbox, f3Zone10Checkbox, f3Zone11aCheckbox, f3Zone11bCheckbox, f3Zone11cCheckbox, f3Zone12Checkbox;

    // Maak placeholders voor elke zone, zone 12 heeft alleen REHEAT COIL Power en zone 9 heeft deze niet
    for (var i = 0; i < f3zones.length; i++) {
        var zone = "zone" + f3zones[i];
        if (zone !== "zone12") {
            f3lightsPower[zone] = [];
            f3equipmentPower[zone] = [];
            f3thermostatTemp[zone] = [];
            f3thermostatHeatingSetpoint[zone] = [];
            f3thermostatCoolingSetpoint[zone] = [];
            f3returnOutletCo2Concentration[zone] = [];
            f3supplyInletTemperature[zone] = [];
            f3supplyInletMassFlowRate[zone] = [];
            f3vavReheatDamperPosition[zone] = [];
        }
        if (zone !== "zone9") {
            f3reheatCoilPower[zone] = [];
        }

        // Bind de DOM elementen aan de lege variabelen
        eval("f3Zone" + f3zones[i] + "Checkbox = document.getElementById('f3-" + zone + "');");
    }

    // Event listener voor als een checkbox verandert
    $(".f3-zone-checkbox").change(function() {
        $("#" + this.id + "-line").toggle();
        $("#" + this.id + "-brush").toggle();
    });

    // Maak de header tekst adhv de dropdown
    d3.select("#f3-vis-info").text($("#f3-dropdown :selected").text());

    // Event listener voor als de dropdown verandert
    $("#f3-dropdown").change(changeF3Header);

    function changeF3Header() {
        // Update de header tekst als de dropdown verandert
        d3.select("#f3-vis-info").text($("#f3-dropdown :selected").text());
        // Update de chart adhv de nieuwe data uit de dropdown
        // updateChart.f3(eval($("#f3-sensors").val()));
        updateF3Chart(eval($("#f3-sensors").val()));
    }

    // Laad de data in
    d3.json("json/floor3-MC2.json", function(error, data) {
        if (error) throw error;

        for (var i = 0; i < data.length; i++) {
            // Sla de timestamp op voor later gebruik
            var datetime = new Date(dateFormat.parse(data[i]["Date/Time"])/* - new Date().getTimezoneOffset() * 60 * 1000*/);

            // Ga elke sensor per timestamp af
            for (var key in data[i]) {
                // Als het een sensorwaarde betreft
                if (key !== "Date/Time" && key !== "type" && key !== "floor") {
                    var zone = "zone";
                    // Check of het een zonereading was
                    if (wildcardCompare(key, "F_3_Z_10*")) {
                        zone += "10";
                    } else if (wildcardCompare(key, "F_3_Z_11A*")) {
                        zone += "11a";
                    } else if (wildcardCompare(key, "F_3_Z_11B*")) {
                        zone += "11b";
                    } else if (wildcardCompare(key, "F_3_Z_11C*")) {
                        zone += "11c";
                    } else if (wildcardCompare(key, "F_3_Z_12*")) {
                        zone += "12";
                    } else if (wildcardCompare(key, "F_3_Z_2*")) {
                        zone += "2";
                    } else if (wildcardCompare(key, "F_3_Z_3*")) {
                        zone += "3";
                    } else if (wildcardCompare(key, "F_3_Z_4*")) {
                        zone += "4";
                    } else if (wildcardCompare(key, "F_3_Z_5*")) {
                        zone += "5";
                    } else if (wildcardCompare(key, "F_3_Z_6*")) {
                        zone += "6";
                    } else if (wildcardCompare(key, "F_3_Z_7*")) {
                        zone += "7";
                    } else if (wildcardCompare(key, "F_3_Z_8*")) {
                        zone += "8";
                    } else if (wildcardCompare(key, "F_3_Z_9*")) {
                        zone += "9";
                    } else if (wildcardCompare(key, "F_3_Z_1*")) {
                        zone += "1";
                    } else {
                        // Anders gaat de reading over de hele verdieping
                        if (key === "F_3_VAV_SYS SUPPLY FAN:Fan Power") {
                            f3vavSysSupplyFanFanPower.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_BATH_EXHAUST:Fan Power") {
                            f3bathExhaustFanPower.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS HEATING COIL Power") {
                            f3vavSysHeatingCoilPower.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS Outdoor Air Flow Fraction") {
                            f3vavSysOutdoorAirFlowFraction.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS Outdoor Air Mass Flow Rate") {
                            f3vavSysOutdoorAirMassFlowRate.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS COOLING COIL Power") {
                            f3vavSysCoolingCoilPower.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS AIR LOOP INLET Temperature") {
                            f3vavSysAirLoopInletTemperature.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS AIR LOOP INLET Mass Flow Rate") {
                            f3vavSysAirLoopInletMassFlowRate.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS SUPPLY FAN OUTLET Temperature") {
                            f3vavSysSupplyFanOutletTemperature.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (key === "F_3_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate") {
                            f3vavSysSupplyFanOutletMassFlowRate.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else {
                            // F_3 VAV Availability Manager Night Cycle Control Status
                            f3vavAvailabilityManagerNightCycleControlStatus.push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        }
                    }

                    // De data betreft een zone
                    if (zone !== "zone") {
                        var sensorReading = key.substr(key.indexOf(" ") + 1, key.length);
                        // Check welke sensor het betreft
                        if (sensorReading === "Lights Power") {
                            f3lightsPower[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "Equipment Power") {
                            f3equipmentPower[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "Thermostat Temp") {
                            f3thermostatTemp[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "Thermostat Heating Setpoint") {
                            f3thermostatHeatingSetpoint[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "Thermostat Cooling Setpoint") {
                            f3thermostatCoolingSetpoint[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "VAV REHEAT Damper Position") {
                            f3vavReheatDamperPosition[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "REHEAT COIL Power") {
                            f3reheatCoilPower[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "RETURN OUTLET CO2 Concentration") {
                            f3returnOutletCo2Concentration[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else if (sensorReading === "SUPPLY INLET Temperature") {
                            f3supplyInletTemperature[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        } else {
                            // SUPPLY INLET Mass Flow Rate
                            f3supplyInletMassFlowRate[zone].push({
                                timestamp: datetime,
                                val: +data[i][key]
                            });
                        }
                    }
                }
            }
        }
        // Initialiseer de chart
        // initChart.f3(eval($("#f3-sensors").val()));
        initF3Chart(eval($("#f3-sensors").val()));

        $(".f3-vis").click(function() {
            if ($(this).parent("div#floor-graphs-floor-3").length) {
                var clickedDivId = $($("#floor-graphs-floor-3-focus")).contents().attr("id");
                if (clickedDivId === "f3-div") {
                    $($("#floor-graphs-floor-3-focus").contents()).prependTo("#floor-graphs-floor-3");
                } else if (clickedDivId === "fixed-prox-div-floor-3") {
                    $($("#floor-graphs-floor-3-focus").contents()).insertAfter($("#f3-div"));
                } else {
                    $($("#floor-graphs-floor-3-focus").contents()).appendTo("#floor-graphs-floor-3");
                }
                $(this).appendTo("#floor-graphs-floor-3-focus");
            }
        });
    });

    function initF3Chart(dataVariable) {
        if (isArray(dataVariable)) {
            // Data betreft de gehele verdieping
            // Bereken de ranges van de data
            x.f3.domain(d3.extent(dataVariable, function(d) {return d.timestamp;})).nice();
            y.f3.domain([d3.min(dataVariable, function(d) {return d.val;}) - 0.1, d3.max(dataVariable, function(d) {return d.val;}) + 0.1]).nice();

            // Bereken de brushdomeinen
            brushX.f3.domain(x.f3.domain());
            brushY.f3.domain(y.f3.domain());

            // Definieer het canvas waar de lijnen op mogen verschijnen
            focus.f3.append("defs").append("clipPath")
            .attr("id", "clip-f3")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            // Assen toevoegen
            focus.f3.append("g")
                .attr("id", "f3-x-axis")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis.f3);

            focus.f3.append("g")
                .attr("id", "f3-y-axis")
                .attr("class", "y axis")
                .call(yAxis.f3)
                // Een naam aan de y-as hangen
                .append("text")
                    .attr("id", "f3-y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 3)
                    .attr("dy", ".75em")
                    .style("text-anchor", "end")
                    // Maak de label tekst de geselecteerde data uit de dropdown
                    .text($("#f3-sensors :selected").text() + " (" + $("#f3-sensors :selected").attr("unit") + ")");

            // De lijn tekenen van de geselecteerde data
            focus.f3.append("path")
                .datum(dataVariable)
                .attr("id", "f3-line")
                .attr("class", "lines-f3 f3-general")
                .attr("d", line.f3)
                .attr("clip-path", "url(#clip-f3)");

            // Maak de brushlijn voor de gehele verdieping
            var contextLine = context.f3.append("path")
                .datum(dataVariable)
                .attr("id", "f3-brush-line")
                .attr("class", "lines-f3 f3-general")
                .attr("d", brushLine.f3);

            // x as voor de brush
            context.f3.append("g")
                .attr("id", "f3-context-x-axis")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + brushHeight + ")")
                .call(brushXAxis.f3);

            // Maak de brush zelf
            context.f3.append("g")
                .attr("class", "x brush")
                .call(brush.f3)
                .selectAll("rect")
                    .attr("y", -6)
                    .attr("height", brushHeight + 7);

            for (var i = 0; i < f3zones.length; i++) {
                // De checkboxes moeten niet werken als de data over de gehele verdieping gaat
                eval("f3Zone" + f3zones[i] + "Checkbox.disabled = true");
                var zone = "zone" + f3zones[i];

                // Bind de verdiepingsdata aan de zonelijnen maar maak deze onzichtbaar
                focus.f3.append("path")
                    .datum(dataVariable)
                    .attr("id", "f3-zone" + f3zones[i] + "-line")
                    .attr("class", "lines-f3 f3-" + zone)
                    .attr("d", line.f3)
                    .attr("clip-path", "url(#clip-f3)")
                    .style("display", "none");

                // En doe hetzelfde voor de brushlijnen
                context.f3.append("path")
                    .datum(dataVariable)
                    .attr("id", "f3-" + zone + "-brush")
                    .attr("class", "lines-f3 f3-" + zone)
                    .attr("d", brushLine.f3)
                    .style("display", "none");
            }
        } else {
            // Data betreft meerdere zones
            // Bereken de ranges van de data
            x.f3.domain(d3.extent(dataVariable.zone1, function(d) {return d.timestamp;})).nice();
            var yMin = 1000000;
            var yMax = 0;
            for (var zone in dataVariable) {
                if (d3.max(dataVariable[zone], function(d) {return d.val;}) > yMax) {
                    yMax = d3.max(dataVariable[zone], function(d) {return d.val;});
                }
                if (d3.min(dataVariable[zone], function(d) {return d.val;}) < yMin) {
                    yMin = d3.min(dataVariable[zone], function(d) {return d.val;});
                }
            }
            y.f3.domain([yMin - 0.1, yMax + 0.1]).nice();

            // Update de brushdomeinen
            brushX.f3.domain(x.f3.domain());
            brushY.f3.domain(y.f3.domain());

            // Definieer het canvas waar de lijnen op mogen verschijnen
            focus.f3.append("defs").append("clipPath")
            .attr("id", "clip-f3")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            // Assen toevoegen
            focus.f3.append("g")
                .attr("id", "f3-x-axis")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis.f3);

            focus.f3.append("g")
                .attr("id", "f3-y-axis")
                .attr("class", "y axis")
                .call(yAxis.f3)
                // Een naam aan de y-as hangen
                .append("text")
                    .attr("id", "f3-y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 3)
                    .attr("dy", ".75em")
                    .style("text-anchor", "end")
                    // Maak de label tekst de geselecteerde data uit de dropdown
                    .text($("#f3-sensors :selected").text() + " (" + $("#f3-sensors :selected").attr("unit") + ")");

            // De lijn tekenen met data van zone1 (willekeurig) maar maak deze onzichtbaar
            focus.f3.append("path")
                .datum(dataVariable.zone1)
                .attr("id", "f3-line")
                .attr("class", "lines-f3 f3-general")
                .attr("d", line.f3)
                .attr("clip-path", "url(#clip-f3)")
                .style("display", "none");

            // En doe hetzelfde voor de brushlijn
            var contextLine = context.f3.append("path")
                .datum(dataVariable.zone1)
                .attr("id", "f3-brush-line")
                .attr("class", "lines-f3 f3-general")
                .attr("d", brushLine.f3)
                .style("display", "none");

            // x as voor de brush
            context.f3.append("g")
                .attr("id", "f3-context-x-axis")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + brushHeight + ")")
                .call(brushXAxis.f3);

            // De brush zelf maken
            context.f3.append("g")
                .attr("class", "x brush")
                .call(brush.f3)
                .selectAll("rect")
                    .attr("y", -6)
                    .attr("height", brushHeight + 7);

            for (var i = 0; i < f3zones.length; i++) {
                var zone = "zone" + f3zones[i];

                // Bind de zonedata aan de zonelijnen maar check goed voor welke zone welke sensordata er beschikbaar is
                // En doe hetzelfde voor de brushlijnen
                if (zone !== "zone12" && zone !== "zone9") {
                    focus.f3.append("path")
                        .datum(dataVariable[zone])
                        .attr("id", "f3-" + zone + "-line")
                        .attr("class", "lines-f3 f3-" + zone)
                        .attr("clip-path", "url(#clip-f3)")
                        .attr("d", line.f3);

                    context.f3.append("path")
                        .datum(dataVariable[zone])
                        .attr("id", "f3-" + zone + "-brush")
                        .attr("class", "lines-f3 f3-" + zone)
                        .attr("d", brushLine.f3);
                } else if (zone === "zone9") {
                    // Er is voor zone 9 geen REHEAT COIL Power data beschikbaar
                    if ($("#f3-sensors").val() !== "f3reheatCoilPower") {
                        focus.f3.append("path")
                            .datum(dataVariable[zone])
                            .attr("id", "f3-" + zone + "-line")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("clip-path", "url(#clip-f3)")
                            .attr("d", line.f3);

                        context.f3.append("path")
                            .datum(dataVariable[zone])
                            .attr("id", "f3-" + zone + "-brush")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("d", brushLine.f3);
                    } else {
                        f3Zone9Checkbox.disabled = true;
                        focus.f3.append("path")
                            .datum(dataVariable.zone1)
                            .attr("id", "f3-" + zone + "-line")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("d", line.f3)
                            .attr("clip-path", "url(#clip-f3)")
                            .style("display", "none");

                        context.f3.append("path")
                            .datum(dataVariable.zone1)
                            .attr("id", "f3-" + zone + "-brush")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("d", brushLine.f3);
                    }
                } else if (zone === "zone12") {
                    // Er is voor zone 12 alleen REHEAT COIL Power data beschikbaar
                    if ($("#f3-sensors").val() === "f3reheatCoilPower") {
                        focus.f3.append("path")
                            .datum(dataVariable[zone])
                            .attr("id", "f3-" + zone + "-line")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("clip-path", "url(#clip-f3)")
                            .attr("d", line.f3);

                        context.f3.append("path")
                            .datum(dataVariable[zone])
                            .attr("id", "f3-" + zone + "-brush")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("d", brushLine.f3);
                    } else {
                        f3Zone12Checkbox.disabled = true;
                        focus.f3.append("path")
                            .datum(dataVariable.zone1)
                            .attr("id", "f3-" + zone + "-line")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("clip-path", "url(#clip-f3)")
                            .attr("d", line.f3)
                            .style("display", "none");

                        context.f3.append("path")
                            .datum(dataVariable.zone1)
                            .attr("id", "f3-" + zone + "-brush")
                            .attr("class", "lines-f3 f3-" + zone)
                            .attr("d", brushLine.f3);
                    }
                }
            }
        }
        // Breng een lijn naar voren als er over gehoverd wordt
        $(".lines-f3").mouseover(function() {
            $(".lines-f3").not(this).each(function() {
                $(this).css("opacity", "0.2");
            });
        });

        $(".lines-f3").mouseout(function() {
            $(".lines-f3").each(function() {
                $(this).css("opacity", "1");
            });
        });
    }

    function updateF3Chart(dataVariable) {
        if (isArray(dataVariable)) {
            // Data betreft de gehele verdieping
            // Bereken de nieuwe ranges
            x.f3.domain(d3.extent(dataVariable, function(d) {return d.timestamp;})).nice();
            y.f3.domain([d3.min(dataVariable, function(d) {return d.val;}) - 0.1, d3.max(dataVariable, function(d) {return d.val;}) + 0.1]).nice();

            // Update de brushdomeinen
            brushX.f3.domain(x.f3.domain());
            brushY.f3.domain(y.f3.domain());

            // Pas de assen aan adhv de nieuwe ranges
            svg.f3.select("#f3-x-axis")
                .transition()
                    .duration(1000)
                    .call(xAxis.f3);

            svg.f3.select("#f3-y-axis")
                .transition()
                    .duration(1000)
                    .call(yAxis.f3);

            // Update de label tekst adhv de dropdown
            svg.f3.select("#f3-y-label")
                .transition()
                    .duration(1000)
                    .text($("#f3-sensors :selected").text() + " (" + $("#f3-sensors :selected").attr("unit") + ")");

            // Update de verdiepingslijn adhv de nieuwe data
            svg.f3.select("#f3-line")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", line.f3)
                    .style("display", "");

            // En doe dat bij de brushlijn ook
            var contextLine = context.f3.select("#f3-brush-line")
                .datum(dataVariable)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.f3)
                    .style("display", "");

            // Transitie op de brush x as
            context.f3.select("#f3-context-x-axis")
                .transition()
                .duration(1000)
                    .call(brushXAxis.f3);

            for (var i = 0; i < f3zones.length; i++) {
                // De checkboxes moeten niet werken als de data over de gehele verdieping gaat
                eval("f3Zone" + f3zones[i] + "Checkbox.disabled = true");

                // Bind verdiepingsdata aan de zonelijnen maar maak deze onzichtbaar
                var zone = "zone" + f3zones[i];
                svg.f3.select("#f3-" + zone + "-line")
                    .datum(dataVariable)
                    .transition()
                    .duration(1000)
                    .attr("d", line.f3)
                    .style("display", "none");

                // En doe hetzelfde voor de brushlijnen
                context.f3.select("#f3-" + zone + "-brush")
                    .datum(dataVariable)
                    .transition()
                        .duration(1000)
                        .attr("d", brushLine.f3)
                        .style("display", "none");
            }
        } else {
            // Data gaat over meerdere zones
            // Bereken de nieuwe ranges
            x.f3.domain(d3.extent(dataVariable.zone1, function(d) {return d.timestamp;})).nice();
            var yMin = 1000000;
            var yMax = 0;
            for (var zone in dataVariable) {
                if (d3.max(dataVariable[zone], function(d) {return d.val;}) > yMax) {
                    yMax = d3.max(dataVariable[zone], function(d) {return d.val;});
                }
                if (d3.min(dataVariable[zone], function(d) {return d.val;}) < yMin) {
                    yMin = d3.min(dataVariable[zone], function(d) {return d.val;});
                }
            }
            y.f3.domain([yMin - 0.1, yMax + 0.1]).nice();

            // Update de brushdomeinen
            brushX.f3.domain(x.f3.domain());
            brushY.f3.domain(y.f3.domain());

            // Update de assen adhv de nieuwe ranges
            svg.f3.select("#f3-x-axis")
                .transition()
                    .duration(1000)
                    .call(xAxis.f3);

            svg.f3.select("#f3-y-axis")
                .transition()
                    .duration(1000)
                    .call(yAxis.f3);

            // Update de label adhv de dropdown
            svg.f3.select("#f3-y-label")
                .transition()
                    .duration(1000)
                    .text($("#f3-sensors :selected").text() + " (" + $("#f3-sensors :selected").attr("unit") + ")");

            // Bind zone1 data (willekeurig) aan de verdiepingslijn maar maak deze onzichtbaar
            svg.f3.select("#f3-line")
                .datum(dataVariable.zone1)
                .transition()
                    .duration(1000)
                    .attr("d", line.f3)
                    .style("display", "none");

            // En doe hetzelfde voor de brushlijn
            var contextLine = context.f3.select("#f3-brush-line")
                .datum(dataVariable.zone1)
                .transition()
                    .duration(1000)
                    .attr("d", brushLine.f3)
                    .style("display", "none");

            // Transitie op de brush x as
            context.f3.select("#f3-context-x-axis")
                .transition()
                .duration(1000)
                    .call(brushXAxis.f3);

            for (var i = 0; i < f3zones.length; i++) {
                // De checkboxes moeten weer werken als de data over meerdere zones
                eval("f3Zone" + f3zones[i] + "Checkbox.disabled = false");

                // Bind zonedata aan de zonelijnen maar check goed voor welke zones welke sensordata beschikbaar is
                // En doe hetzelfde voor de brushlijnen
                var zone = "zone" + f3zones[i];
                if (zone !== "zone9" && zone !== "zone12") {
                    svg.f3.select("#f3-" + zone + "-line")
                        .datum(dataVariable[zone])
                        .transition()
                            .duration(1000)
                            .attr("d", line.f3)
                            .style("display", function() {
                                // Laat de lijn alleen zien als de checkbox aangevinkt is
                                if (eval("f3Zone" + f3zones[i] + "Checkbox.checked")) {
                                    return "";
                                } else {
                                    return "none";
                                }
                            });

                    context.f3.select("#f3-" + zone + "-brush")
                        .datum(dataVariable[zone])
                        .transition()
                            .duration(1000)
                            .attr("d", brushLine.f3)
                            .style("display", function() {
                                if (eval("f3Zone" + f3zones[i] + "Checkbox.checked")) {
                                    return "";
                                } else {
                                    return "none";
                                }
                            });
                } else if (zone === "zone9") {
                    // Zone 9 heeft geen REHEAT COIL Power data
                    if ($("#f3-sensors").val() !== "f3reheatCoilPower") {
                        svg.f3.select("#f3-" + zone + "-line")
                            .datum(dataVariable[zone])
                            .transition()
                                .duration(1000)
                                .attr("d", line.f3)
                                .style("display", function() {
                                    // Laat de lijn alleen zien als de checkbox aangevinkt is
                                    if (eval("f3Zone" + f3zones[i] + "Checkbox.checked")) {
                                        return "";
                                    } else {
                                        return "none";
                                    }
                                });

                        context.f3.select("#f3-" + zone + "-brush")
                            .datum(dataVariable[zone])
                            .transition()
                                .duration(1000)
                                .attr("d", brushLine.f3)
                                .style("display", function() {
                                    if (eval("f3Zone" + f3zones[i] + "Checkbox.checked")) {
                                        return "";
                                    } else {
                                        return "none";
                                    }
                                });
                    } else {
                        f3Zone9Checkbox.disabled = true;
                        svg.f3.select("#f3-" + zone + "-line")
                            .datum(dataVariable.zone1)
                            .transition()
                                .duration(1000)
                                .attr("d", line.f3)
                                .style("display", "none");

                        context.f3.select("#f3-" + zone + "-brush")
                            .datum(dataVariable.zone1)
                            .transition()
                                .duration(1000)
                                .attr("d", brushLine.f3)
                                .style("display", "none");
                    }
                } else if (zone === "zone12") {
                    // Zone 12 heeft alleen REHEAT COIL Power data
                    if ($("#f3-sensors").val() === "f3reheatCoilPower") {
                        svg.f3.select("#f3-" + zone + "-line")
                            .datum(dataVariable[zone])
                            .transition()
                                .duration(1000)
                                .attr("d", line.f3)
                                .style("display", function() {
                                    // Laat de lijn alleen zien als de checkbox aangevinkt is
                                    if (eval("f3Zone" + f3zones[i] + "Checkbox.checked")) {
                                        return "";
                                    } else {
                                        return "none";
                                    }
                                });

                        context.f3.select("#f3-" + zone + "-brush")
                            .datum(dataVariable[zone])
                            .transition()
                                .duration(1000)
                                .attr("d", brushLine.f3)
                                .style("display", function() {
                                    if (eval("f3Zone" + f3zones[i] + "Checkbox.checked")) {
                                        return "";
                                    } else {
                                        return "none";
                                    }
                                });
                    } else {
                        f3Zone12Checkbox.disabled = true;
                        svg.f3.select("#f3-" + zone + "-line")
                            .datum(dataVariable.zone1)
                            .transition()
                                .duration(1000)
                                .attr("d", line.f3)
                                .style("display", "none");

                        context.f3.select("#f3-" + zone + "-brush")
                            .datum(dataVariable.zone1)
                            .transition()
                                .duration(1000)
                                .attr("d", brushLine.f3)
                                .style("display", "none");
                    }
                }
            }
        }
    }
})();

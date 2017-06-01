$(".button").click(function() {
    window.location = this.value;
});

floor = floor_selection();

var f3zones = ["1", "2", "3", "5", "6", "7", "8", "9", "10", "11a", "11b", "11c", "12"];

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

var f3Zone1Checkbox, f3Zone2Checkbox, f3Zone3Checkbox, f3Zone5Checkbox, f3Zone6Checkbox, f3Zone7Checkbox, f3Zone8Checkbox,
    f3Zone9Checkbox, f3Zone10Checkbox, f3Zone11aCheckbox, f3Zone11bCheckbox, f3Zone11cCheckbox, f3Zone12Checkbox;

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
}

d3.select("#f3-vis-info").text($("#f3-dropdown :selected").text());
$("#f3-dropdown").change(changeHeader);
var dateFormat = d3.time.format("%Y-%m-%d %X");

d3.json("json/floor3-MC2.json", function(error, data) {
    if (error) throw error;

    for (var i = 0; i < data.length; i++) {
        // console.log(data[i].message);
        var datetime = new Date(dateFormat.parse(data[i]["Date/Time"])/* - new Date().getTimezoneOffset() * 60 * 1000*/);
        // console.log(datetime);
        for (var key in data[i]) {
            if (key !== "Date/Time" && key !== "type" && key !== "floor") {
                var zone = "zone";
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
    initMap();
    d3.select("#loading-icon").style("display", "none");
});

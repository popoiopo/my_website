$(".button").click(function() {
    window.location = this.value;
});

floor = floor_selection();

var f2zones = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12a", "12b", "12c", "14", "15", "16"];

var f2lightsPower = {},
    f2equipmentPower = {},
    f2thermostatTemp = {},
    f2thermostatHeatingSetpoint = {},
    f2thermostatCoolingSetpoint = {},
    f2returnOutletCo2Concentration = {},
    f2supplyInletTemperature = {},
    f2supplyInletMassFlowRate = {},
    f2vavReheatDamperPosition = {},
    f2reheatCoilPower = {},
    f2vavAvailabilityManagerNightCycleControlStatus = [],
    f2vavSysSupplyFanFanPower = [],
    f2bathExhaustFanPower = [],
    f2vavSysHeatingCoilPower = [],
    f2vavSysOutdoorAirFlowFraction = [],
    f2vavSysOutdoorAirMassFlowRate = [],
    f2vavSysCoolingCoilPower = [],
    f2vavSysAirLoopInletTemperature = [],
    f2vavSysAirLoopInletMassFlowRate = [],
    f2vavSysSupplyFanOutletTemperature = [],
    f2vavSysSupplyFanOutletMassFlowRate = [];

for (var i = 0; i < f2zones.length; i++) {
    var zone = "zone" + f2zones[i];
    f2lightsPower[zone] = [];
    f2equipmentPower[zone] = [];
    f2thermostatTemp[zone] = [];
    f2thermostatHeatingSetpoint[zone] = [];
    f2thermostatCoolingSetpoint[zone] = [];
    f2returnOutletCo2Concentration[zone] = [];
    f2supplyInletTemperature[zone] = [];
    f2supplyInletMassFlowRate[zone] = [];
    f2vavReheatDamperPosition[zone] = [];
    f2reheatCoilPower[zone] = [];
}

d3.select("#f2-vis-info").text($("#f2-dropdown :selected").text());
$("#f2-dropdown").change(changeHeader);
var dateFormat = d3.time.format("%Y-%m-%d %X");


d3.json("json/floor2-MC2.json", function(error, data) {
    if (error) throw error;

    for (var i = 0; i < data.length; i++) {
        var datetime = new Date(dateFormat.parse(data[i]["Date/Time"])/* - new Date().getTimezoneOffset() * 60 * 1000*/);
        //console.log(datetime);
        for (var key in data[i]) {
            if (key !== "Date/Time" && key !== "type" && key !== "floor") {
                var zone = "zone";
                if (wildcardCompare(key, "F_2_Z_10*")) {
                    zone += "10";
                } else if (wildcardCompare(key, "F_2_Z_11*")) {
                    zone += "11";
                } else if (wildcardCompare(key, "F_2_Z_12A*")) {
                    zone += "12a";
                } else if (wildcardCompare(key, "F_2_Z_12B*")) {
                    zone += "12b";
                } else if (wildcardCompare(key, "F_2_Z_12C*")) {
                    zone += "12c";
                } else if (wildcardCompare(key, "F_2_Z_14*")) {
                    zone += "14";
                } else if (wildcardCompare(key, "F_2_Z_15*")) {
                    zone += "15";
                } else if (wildcardCompare(key, "F_2_Z_16*")) {
                    zone += "16";
                } else if (wildcardCompare(key, "F_2_Z_2*")) {
                    zone += "2";
                } else if (wildcardCompare(key, "F_2_Z_3*")) {
                    zone += "3";
                } else if (wildcardCompare(key, "F_2_Z_4*")) {
                    zone += "4";
                } else if (wildcardCompare(key, "F_2_Z_5*")) {
                    zone += "5";
                } else if (wildcardCompare(key, "F_2_Z_6*")) {
                    zone += "6";
                } else if (wildcardCompare(key, "F_2_Z_7*")) {
                    zone += "7";
                } else if (wildcardCompare(key, "F_2_Z_8*")) {
                    zone += "8";
                } else if (wildcardCompare(key, "F_2_Z_9*")) {
                    zone += "9";
                } else if (wildcardCompare(key, "F_2_Z_1*")) {
                    zone += "1";
                } else {
                    if (key === "F_2_VAV_SYS SUPPLY FAN:Fan Power") {
                        f2vavSysSupplyFanFanPower.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_BATH_EXHAUST:Fan Power") {
                        f2bathExhaustFanPower.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS HEATING COIL Power") {
                        f2vavSysHeatingCoilPower.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS Outdoor Air Flow Fraction") {
                        f2vavSysOutdoorAirFlowFraction.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS Outdoor Air Mass Flow Rate") {
                        f2vavSysOutdoorAirMassFlowRate.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS COOLING COIL Power") {
                        f2vavSysCoolingCoilPower.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS AIR LOOP INLET Temperature") {
                        f2vavSysAirLoopInletTemperature.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS AIR LOOP INLET Mass Flow Rate") {
                        f2vavSysAirLoopInletMassFlowRate.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS SUPPLY FAN OUTLET Temperature") {
                        f2vavSysSupplyFanOutletTemperature.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (key === "F_2_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate") {
                        f2vavSysSupplyFanOutletMassFlowRate.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else {
                        // F_2 VAV Availability Manager Night Cycle Control Status
                        f2vavAvailabilityManagerNightCycleControlStatus.push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    }
                }

                // De data betreft een zone
                if (zone !== "zone") {
                    var sensorReading = key.substr(key.indexOf(" ") + 1, key.length);
                    if (sensorReading === "Lights Power") {
                        f2lightsPower[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "Equipment Power") {
                        f2equipmentPower[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "Thermostat Temp") {
                        f2thermostatTemp[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "Thermostat Heating Setpoint") {
                        f2thermostatHeatingSetpoint[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "Thermostat Cooling Setpoint") {
                        f2thermostatCoolingSetpoint[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "VAV REHEAT Damper Position") {
                        f2vavReheatDamperPosition[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "REHEAT COIL Power") {
                        f2reheatCoilPower[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "RETURN OUTLET CO2 Concentration") {
                        f2returnOutletCo2Concentration[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else if (sensorReading === "SUPPLY INLET Temperature") {
                        f2supplyInletTemperature[zone].push({
                            timestamp: datetime,
                            val: +data[i][key]
                        });
                    } else {
                        // SUPPLY INLET Mass Flow Rate
                        f2supplyInletMassFlowRate[zone].push({
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

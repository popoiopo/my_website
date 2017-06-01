$(".button").click(function() {
    window.location = this.value;
});

floor = floor_selection();

var f1zones = ["1", "2", "3", "4", "5", "7", "8a", "8b"];

var f1lightsPower = {},
    f1equipmentPower = {},
    f1thermostatTemp = {},
    f1thermostatHeatingSetpoint = {},
    f1thermostatCoolingSetpoint = {},
    f1returnOutletCo2Concentration = {},
    f1supplyInletTemperature = {},
    f1supplyInletMassFlowRate = {},
    f1vavReheatDamperPosition = {},
    f1reheatCoilPower = {},
    f1vavAvailabilityManagerNightCycleControlStatus = [],
    f1vavSysSupplyFanFanPower = [],
    f1bathExhaustFanPower = [],
    f1vavSysHeatingCoilPower = [],
    f1vavSysOutdoorAirFlowFraction = [],
    f1vavSysOutdoorAirMassFlowRate = [],
    f1vavSysCoolingCoilPower = [],
    f1vavSysAirLoopInletTemperature = [],
    f1vavSysAirLoopInletMassFlowRate = [],
    f1vavSysSupplyFanOutletTemperature = [],
    f1vavSysSupplyFanOutletMassFlowRate = [],
    f1mechanicalVentilationMassFlowRate = [];

for (var i = 0; i < f1zones.length; i++) {
    var zone = "zone" + f1zones[i];
    f1lightsPower[zone] = [];
    f1equipmentPower[zone] = [];
    f1thermostatTemp[zone] = [];
    f1thermostatHeatingSetpoint[zone] = [];
    f1thermostatCoolingSetpoint[zone] = [];
    f1returnOutletCo2Concentration[zone] = [];
    f1supplyInletTemperature[zone] = [];
    f1supplyInletMassFlowRate[zone] = [];
    f1vavReheatDamperPosition[zone] = [];
    f1reheatCoilPower[zone] = [];
}

d3.select("#f1-vis-info").text($("#f1-dropdown :selected").text());
$("#f1-dropdown").change(changeHeader);
var dateFormat = d3.time.format("%Y-%m-%d %X");

d3.json("json/floor1-MC2.json", function(error, data) {
    if (error) throw error;

    for (var i = 0; i < data.length; i++) {
        //console.log(data[i].message["Date/Time"]);
        var datetime = new Date(dateFormat.parse(data[i].message["Date/Time"])/* - new Date().getTimezoneOffset() * 60 * 1000*/);
        // console.log(datetime);
        var timeoffset = data[i].offset;
        // Ga elke sensorwaarde af
        for (var key in data[i].message) {
            // Als de key een sensorwaarde betreft
            if (key !== "Date/Time" && key !== "type" && key !== "floor") {
                var zone = "zone";
                // Check of de sensorwaarde meerdere zones betreft
                if (wildcardCompare(key, "F_1_Z_1*")) {
                    zone += "1";
                } else if (wildcardCompare(key, "F_1_Z_2*")) {
                    zone += "2";
                } else if (wildcardCompare(key, "F_1_Z_3*")) {
                    zone += "3";
                } else if (wildcardCompare(key, "F_1_Z_4*")) {
                    zone += "4";
                } else if (wildcardCompare(key, "F_1_Z_5*")) {
                    zone += "5";
                } else if (wildcardCompare(key, "F_1_Z_7*")) {
                    zone += "7";
                } else if (wildcardCompare(key, "F_1_Z_8A*")) {
                    zone += "8a";
                } else if (wildcardCompare(key, "F_1_Z_8B*")) {
                    zone += "8b";
                } else {
                    // Zo niet, dan gaat de waarde over de gehele verdieping
                    if (key === "F_1_VAV_SYS SUPPLY FAN:Fan Power") {
                        f1vavSysSupplyFanFanPower.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_BATH_EXHAUST:Fan Power") {
                        f1bathExhaustFanPower.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS HEATING COIL Power") {
                        f1vavSysHeatingCoilPower.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS Outdoor Air Flow Fraction") {
                        f1vavSysOutdoorAirFlowFraction.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS Outdoor Air Mass Flow Rate") {
                        f1vavSysOutdoorAirMassFlowRate.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS COOLING COIL Power") {
                        f1vavSysCoolingCoilPower.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS AIR LOOP INLET Temperature") {
                        f1vavSysAirLoopInletTemperature.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS AIR LOOP INLET Mass Flow Rate") {
                        f1vavSysAirLoopInletMassFlowRate.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS SUPPLY FAN OUTLET Temperature") {
                        f1vavSysSupplyFanOutletTemperature.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (key === "F_1_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate") {
                        f1vavSysSupplyFanOutletMassFlowRate.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else {
                        // F_1 VAV Availability Manager Night Cycle Control Status
                        f1vavAvailabilityManagerNightCycleControlStatus.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    }
                }

                // De data betreft een zone
                if (zone !== "zone") {
                    var sensorReading = key.substr(key.indexOf(" ") + 1, key.length);
                    // Check welke sensor het was
                    if (sensorReading === "Lights Power") {
                        f1lightsPower[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "Equipment Power") {
                        f1equipmentPower[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "Thermostat Temp") {
                        f1thermostatTemp[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "Thermostat Heating Setpoint") {
                        f1thermostatHeatingSetpoint[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "Thermostat Cooling Setpoint") {
                        f1thermostatCoolingSetpoint[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "VAV REHEAT Damper Position") {
                        f1vavReheatDamperPosition[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "REHEAT COIL Power") {
                        f1reheatCoilPower[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "RETURN OUTLET CO2 Concentration") {
                        f1returnOutletCo2Concentration[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "SUPPLY INLET Temperature") {
                        f1supplyInletTemperature[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else if (sensorReading === "SUPPLY INLET Mass Flow Rate") {
                        f1supplyInletMassFlowRate[zone].push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    } else {
                        // Mechanical Ventilation Mass Flow Rate
                        f1mechanicalVentilationMassFlowRate.push({
                            timestamp: datetime,
                            offset: timeoffset,
                            val: +data[i].message[key]
                        });
                    }
                }
            }
        }
    }
    initMap();
    d3.select("#loading-icon").style("display", "none");
});

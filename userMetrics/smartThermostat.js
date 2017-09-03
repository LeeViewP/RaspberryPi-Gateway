exports.updateSourceNodesInNode = require(path.resolve(__dirname, 'customFunctions.js')).updateSourceNodesInNode;
exports.deleteNodeMetric = require(path.resolve(__dirname, 'customFunctions.js')).deleteNodeMetric;
exports.timeoutOffset = require('../metrics.js').timeoutOffset;

exports.motes = {
    SmartThermostat: {
        label: 'Climate Control (AI Based)',
        icon: 'appbar.thermometer.digital.svg',
        controls: {
            heatcontrol: {
                states: [
                    {
                        label: 'Heat',
                        css: 'background-color:#ff1100;color:#fff',
                        icon: 'fa-fire',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value == 'HEAT'; else return false; else return false; }
                    },
                    {
                        label: 'Heat',
                        icon: 'fa-fire',
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'MODE:' + 'HEAT';
                            processSerialData(fakeSerialMsg);
                            setTimeout(exports.thermostatTriggerTargetTemperatureEvent, 1000, node);
                            //updateNodeMetric({ nodeId: node._id, metric: { name: 'MODE', value: 'HEAT' } });
                            return;
                        },
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value != 'HEAT'; else return false; else return true; }
                    },
                ]
            },
            coldcontrol: {
                states: [
                    {
                        label: 'Cool',
                        css: 'background-color:#0077ff;color:#fff',
                        icon: 'fa-ge',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value == 'COOL'; else return false; else return false; }
                    },
                    {
                        label: 'Cool',
                        icon: 'fa-ge',
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'MODE:' + 'COOL';
                            processSerialData(fakeSerialMsg);
                            setTimeout(exports.thermostatTriggerTargetTemperatureEvent, 1000, node);
                            //updateNodeMetric({ nodeId: node._id, metric: { name: 'MODE', value: 'COOL' } });
                            return;
                        },
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value != 'COOL'; else return false; else return true; }
                    }

                ]
            },
            autocontrol: {
                states: [
                    {
                        label: 'Auto', action: '', icon: 'fa-balance-scale', css: 'background-color:#9BFFBE',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value == 'AUTO'; else return false; else return false; }
                    },
                    {
                        label: 'Auto', action: '', icon: 'fa-balance-scale',
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'MODE:' + 'AUTO';
                            processSerialData(fakeSerialMsg);
                            setTimeout(exports.thermostatTriggerTargetTemperatureEvent, 1000, node);
                            //updateNodeMetric({ nodeId: node._id, metric: { name: 'MODE', value: 'AUTO' } });
                            return;
                        },
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value != 'AUTO'; else return false; else return true; }
                    }
                ]
            },
            offcontrol: {
                states: [
                    {
                        label: 'Off',
                        css: 'background-color:#FF9B9B;color:#fff',
                        icon: 'power',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value == 'OFF'; else return false; else return false; }
                    },
                    {
                        label: 'Off',
                        icon: 'power',
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'MODE:' + 'OFF';
                            processSerialData(fakeSerialMsg);
                            setTimeout(exports.thermostatTriggerTargetTemperatureEvent, 1000, node);
                            //updateNodeMetric({ nodeId: node._id, metric: { name: 'MODE', value: 'OFF' } });
                            return;
                        },
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value != 'OFF'; else return false; else return true; }
                    }
                ],
                breakAfter: true,
            },
            holidaycontrol: {
                states: [
                    {
                        label: 'Holiday',
                        css: 'background-color:#FF9B9B;color:#fff',
                        icon: 'fa-plane',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value == 'HOLIDAY'; else return false; else return false; }
                    },
                    {
                        label: 'Holiday',
                        icon: 'fa-plane',
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'MODE:' + 'HOLIDAY';
                            processSerialData(fakeSerialMsg);
                            setTimeout(exports.thermostatTriggerTargetTemperatureEvent, 1000, node);
                            //updateNodeMetric({ nodeId: node._id, metric: { name: 'MODE', value: 'AWAY' } });
                            return;
                        },
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['MODE']) return node.metrics['MODE'].value != 'HOLIDAY'; else return false; else return true; }
                    }

                ]
            },
            schedulecontrol: {
                states: [
                    {
                        label: 'Schedule',
                        icon: 'fa-clock-o',
                        serverExecute: function (node) {
                            exports.editThermostatSchedule(node);
                        }
                    }

                ]
            },

        }
    },
};

exports.metrics = {
    MODE: { name: 'MODE', regexp: /MODE\:(COOL|HEAT|AUTO|OFF|HOLIDAY)/i, value: '' },
    TARGETHEAT: { name: 'TARGETHEAT', regexp: /TARGETHEAT\:([-\d\.]+)/i, value: '', unit: '°' },
    TARGETCOOL: { name: 'TARGETCOOL', regexp: /TARGETCOOL\:([-\d\.]+)/i, value: '', unit: '°' },
};

exports.events = {
    insideTemperaturePushToThermostatSourceNodes: {
        label: "Push to Source Nodes:Smart Thermostat Temperature",
        icon: "action",
        descr: "Push Temperature from this node to Thermostat Node",
        serverExecute: function (node) {
            if (node.metrics['C'] && (Date.now() - new Date(node.metrics['C'].updated).getTime() < 2000)) {
                var metricSource = new Object();
                metricSource.label = node.metrics['C'].label;
                metricSource.value = node.metrics['C'].value;
                metricSource.unit = node.metrics['C'].unit;
                metricSource.updated = node.metrics['C'].updated;
                metricSource.name = 'C';
                setTimeout(exports.updateSourceNodesInNode, 1200, { nodeId: settings.smartthermostat.nodeId.value, sourceNodeId: node._id, metric: metricSource });
            };
        }
    },
    insideHumidityPushToThermostatSourceNodes: {
        label: "Push to Source Nodes:Smart Thermostat Humidity",
        icon: "action",
        descr: "Push Humidity from this node to Thermostat Node",
        serverExecute: function (node) {
            if (node.metrics['H'] && (Date.now() - new Date(node.metrics['H'].updated).getTime() < 2000)) {
                var metricSource = new Object();
                metricSource.label = node.metrics['H'].label;
                metricSource.value = node.metrics['H'].value;
                metricSource.unit = node.metrics['H'].unit;
                metricSource.updated = node.metrics['H'].updated;
                metricSource.name = 'H';
                setTimeout(exports.updateSourceNodesInNode, 1300, { nodeId: settings.smartthermostat.nodeId.value, sourceNodeId: node._id, metric: metricSource });
            };
        }
    },
    // smartthermostatfunction: {
    //     label: 'Smart Thermostat Working Event',
    //     icon: 'clock',
    //     descr: 'Smart Thermostat Functionality',
    //     nextSchedule: function (node) { return 600000 / 20; }, //Run on 10 minute  //{ return exports.timeoutOffset(16, 0); }, //ie 16:00 (4pm)
    //     scheduledExecute: function (node) {

    //         //get outside temperature
    //         //var outsideTemperature = undefined;
    //         db.findOne({ _id: settings.meteoforecast.nodeId.value }, function (err, meteonode) {
    //             if (meteonode) {
    //                 if (meteonode.metrics != undefined) {

    //                     if (meteonode.metrics['MINC'] != undefined) {
    //                         console.log('Smart Thermostat Functionality: Outside temperature FOUND:' + meteonode.metrics['MINC'].value);
    //                         //outsideTemperature = meteonode.metrics['MINC'].value
    //                         thermostatFunctionality(node, meteonode.metrics['MINC'].value);

    //                     }
    //                 }
    //             }
    //         });


    //     }
    // },
    smartthermostattargettemperature: {
        label: 'Smart Thermostat Temperature Event',
        icon: 'clock',
        descr: 'Smart Thermostat get target temperatures',
        nextSchedule: function (node) {
            var nextSchedule = exports.thermostatGetNextSchedule(node);
            //  console.info('Smart Thermostat TARGET Event Next Schedule: '+ JSON.stringify(nextSchedule));
            var nextTime = new Date('1970/01/01 ' + nextSchedule.startTime + ':00');
            // console.info('Smart Thermostat TARGET Event Next Schedule: '+ JSON.stringify(nextTime.toLocaleTimeString()));
            // var nextdate = exports.timeoutOffset(nextTime.getHours(), nextTime.getMinutes(), nextTime.getSeconds(), 0);
            // console.info('Smart Thermostat TARGET Event Next Schedule: '+ JSON.stringify(nextdate));
            return exports.timeoutOffset(nextTime.getHours(), nextTime.getMinutes(), nextTime.getSeconds(), 0);
        },
        scheduledExecute: function (node) {
            var currentComfortType = exports.thermostatGetCurrrentComfortType(node);
            // console.info('Smart Thermostat TARGET Event Executing: '+ JSON.stringify(currentComfortType));
            var fakeSerialMsg = '[' + node._id + '] ';
            switch (node.metrics['MODE'].value) {
                case 'HEAT':
                    setTimeout(exports.deleteNodeMetric, 200, node._id, 'TARGETCOOL');
                    fakeSerialMsg += 'TARGETHEAT:' + currentComfortType.heat.temperature;
                    processSerialData(fakeSerialMsg);
                    break;
                case 'COOL':
                    setTimeout(exports.deleteNodeMetric, 250, node._id, 'TARGETHEAT');
                    fakeSerialMsg += 'TARGETCOOL:' + currentComfortType.cool.temperature;
                    processSerialData(fakeSerialMsg);
                    break;
                case 'HOLIDAY':
                    currentComfortType = metricsDef.comfortTypes['holiday'];
                    fakeSerialMsg += 'TARGETCOOL:' + currentComfortType.cool.temperature + ' ';
                    fakeSerialMsg += 'TARGETHEAT:' + currentComfortType.heat.temperature + ' ';
                    processSerialData(fakeSerialMsg);
                    break;
                case 'AUTO':
                    fakeSerialMsg += 'TARGETCOOL:' + currentComfortType.cool.temperature + ' ';
                    fakeSerialMsg += 'TARGETHEAT:' + currentComfortType.heat.temperature + ' ';
                    processSerialData(fakeSerialMsg);
                    break;
                case 'OFF':
                    // exports.deleteNodeMetric(node._id,'TARGETHEAT');
                    setTimeout(exports.deleteNodeMetric, 250, node._id, 'TARGETHEAT');
                    setTimeout(exports.deleteNodeMetric, 200, node._id, 'TARGETCOOL');
                    // fakeSerialMsg += 'TARGETCOOL:' + 'undefined' + ' ';
                    // fakeSerialMsg += 'TARGETHEAT:' + 'undefined' + ' ';
                    // //fakeSerialMsg += 'undefined';
                    // processSerialData(fakeSerialMsg);
                    break;
            }
        }
    },
    smartthermostatworker: {
        label: 'Smart Thermostat Worker Event',
        icon: 'clock',
        descr: 'Smart Thermostat Functionality',
        nextSchedule: function (node) { return settings.smartthermostat.thermostatworkerofffset.value }, //Run on 10 minute  //{ return exports.timeoutOffset(16, 0); }, //ie 16:00 (4pm)
        scheduledExecute: function (node) {
            //get outside temperature
            db.findOne({ _id: settings.meteoforecast.nodeId.value }, function (err, meteonode) {
                var metricKey = 'MINC';
                if (meteonode) {
                    if (meteonode.metrics != undefined) {
                        if (meteonode.metrics[metricKey] != undefined) {
                            var outsideTemperature = parseFloat(meteonode.metrics[metricKey].value);
                            //console.log('Smart Thermostat Functionality: Outside temperature FOUND:' + meteonode.metrics[metricKey].value);
                            //Let's get the new actualized value of the node 
                            db.findOne({ _id: node._id }, function (err, thNode) {
                                exports.thermostatWorker(thNode, outsideTemperature);
                            });
                        }
                    }
                }
            });
        }
    }
};

exports.comfortTypes = {
    home: {
        label: "Home",
        icon: "appbar.home.people.svg",
        heat: {
            icon: "fa-fire",
            temperature: 22.8
        },
        cool: {
            icon: "fa-ge",
            temperature: 24.8
        },
    },
    sleep: {
        label: "Sleep",
        icon: "appbar.moon.sleep.svg",
        heat: {
            icon: "fa-fire",
            temperature: 20
        },
        cool: {
            icon: "fa-ge",
            temperature: 26.8
        },
    },
    away: {
        label: "Away",
        icon: "appbar.man.suitcase.run.svg",
        heat: {
            icon: "fa-fire",
            temperature: 19.5
        },
        cool: {
            icon: "fa-ge",
            temperature: 27.8
        },
    },
    holiday: {
        label: "Holiday",
        icon: "appbar.plane.rotated.45.svg",
        heat: {
            icon: "fa-fire",
            temperature: 14
        },
        cool: {
            icon: "fa-ge",
            temperature: 30
        },
    },

};

exports.defaultThermostatSchedule = {
    "0": [
        { "startTime": "08:30", "comfortType": "home" },
        { "startTime": "23:30", "comfortType": "sleep" }
    ],
    "1": [
        { "startTime": "06:30", "comfortType": "home" },
        { "startTime": "08:30", "comfortType": "sleep" },
        { "startTime": "16:50", "comfortType": "home" },
        { "startTime": "23:30", "comfortType": "sleep" }
    ],
    "2": [
        { "startTime": "06:30", "comfortType": "home" },
        { "startTime": "08:30", "comfortType": "sleep" },
        { "startTime": "16:50", "comfortType": "home" },
        { "startTime": "23:30", "comfortType": "sleep" }
    ],
    "3": [
        { "startTime": "06:30", "comfortType": "home" },
        { "startTime": "08:30", "comfortType": "sleep" },
        { "startTime": "16:50", "comfortType": "home" },
        { "startTime": "23:30", "comfortType": "sleep" }
    ],
    "4": [
        { "startTime": "06:30", "comfortType": "home" },
        { "startTime": "08:30", "comfortType": "sleep" },
        { "startTime": "16:50", "comfortType": "home" },
        { "startTime": "23:30", "comfortType": "sleep" }
    ],
    "5": [
        { "startTime": "06:30", "comfortType": "home" },
        { "startTime": "08:30", "comfortType": "sleep" },
        { "startTime": "14:30", "comfortType": "home" },
        { "startTime": "23:30", "comfortType": "sleep" }
    ],
    "6": [
        { "startTime": "08:30", "comfortType": "home" },
        { "startTime": "23:30", "comfortType": "sleep" }
    ]
};


exports.editThermostatSchedule = function (node) {
    console.info('UPDATESMARTTERMOSTATSCHEDULE called for nodeId:' + node._id);
    var dbNode = new Object();
    db.find({ _id: node._id }, function (err, entries) {
        if (entries.length == 1) {
            dbNode = entries[0];
        }

        dbNode._id = node._id;
        if (dbNode.thermostatSchedule == undefined) {
            dbNode.thermostatSchedule = new Object();
            console.info('Thermostat Schedule Not Found: ' + JSON.stringify(dbNode));
            dbNode.thermostatSchedule = exports.defaultThermostatSchedule;
            dbNode.updated = new Date().getTime();

            db.update({ _id: dbNode._id }, { $set: dbNode }, {}, function (err, numReplaced) {
                //console.info('   [' + dbNode._id + '] DB-Updates:' + numReplaced + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId);
                console.info('UPDATESMARTTERMOSTATSCHEDULE: [' + dbNode._id + '] the Node:' + JSON.stringify(dbNode));
            });
        }
        io.sockets.emit('UPDATESMARTTERMOSTATSCHEDULE', dbNode); //post it back to all clients to confirm UI changes
        io.sockets.emit('UPDATENODE', dbNode); //post it back to all clients to confirm UI changes
    });
    // var dbNodeX = new Object();
    // db.find({ _id: dbNode._id }, function (err, entries) {
    //     if (entries.length == 1) {
    //         dbNodeX = entries[0];
    //         console.info('CHECK SAVED NODE UPDATESMARTTERMOSTATSCHEDULE: [' + dbNodeX._id + '] the Node:' + JSON.stringify(dbNodeX));
    //     }

    // });
}

exports.thermostatGetCurrrentComfortType = function (node) {
    var todaySchedules = [];
    todaySchedules = node.thermostatSchedule[(new Date()).getDay()].map(function (schedule) { return schedule });
    //Find first schedule of the day
    var todayFirstSchedules = todaySchedules.filter(function (schedule) {
        var d = new Date();
        return new Date('1970/01/01 ' + schedule.startTime) >= new Date('1970/01/01 00:00')
    });

    var todayFirstSchedule = todaySchedules[todaySchedules.indexOf(todayFirstSchedules[0])];
    //WE need to have full day filled so if the firs our is not 00:00 we have to add it from the last day
    if (new Date('1970/01/01 ' + todayFirstSchedule.startTime) > new Date('1970/01/01 00:00')) {
        //We dont have 00:00 schedule get previous day schedule
        var msecsIn1Day = 86400000;
        var yesterdayIndex = new Date((new Date()).getTime() - msecsIn1Day).getDay();
        // console.info('Smart Thermostat Functionality: yesterday index ' + JSON.stringify(yesterdayIndex));
        var yesterdaySchedules = node.thermostatSchedule[yesterdayIndex];

        var yesterdayLastSchedule = yesterdaySchedules[yesterdaySchedules.length - 1];
        yesterdayLastSchedule.startTime = '00:00';
        todaySchedules.unshift(yesterdayLastSchedule);

    }

    var nextSchedules = todaySchedules.filter(function (schedule) {
        var d = new Date();
        return new Date('1970/01/01 ' + schedule.startTime) > new Date('1970/01/01 ' + d.getHours() + ':' + d.getMinutes())
    });
    // console.log('Smart Thermostat Functionality: nextSchedules ' + JSON.stringify(nextSchedules));

    var currentSchedule = new Object();
    if (nextSchedules.length > 0) {
        // console.log('Smart Thermostat Functionality:' + JSON.stringify(nextSchedules));
        var index = todaySchedules.indexOf(nextSchedules[0]) - 1;
        currentSchedule = todaySchedules[index];
    }
    else {
        // console.log('Smart Thermostat Functionality: Unable to find a schedule using the last in array');
        currentSchedule = todaySchedules[todaySchedules.length - 1];
    }

    // console.log('Smart Thermostat Functionality: todaySchedules ' + JSON.stringify(todaySchedules));
    // console.log('Smart Thermostat Functionality: currentSchedule ' + JSON.stringify(currentSchedule));
    // Find comfort type
    return metricsDef.comfortTypes[currentSchedule.comfortType]
}
exports.thermostatGetNextSchedule = function (node) {
    var todaySchedules = [];
    todaySchedules = node.thermostatSchedule[(new Date()).getDay()].map(function (schedule) { return schedule });

    var nextSchedules = todaySchedules.filter(function (schedule) {
        var d = new Date();
        return new Date('1970/01/01 ' + schedule.startTime) > new Date('1970/01/01 ' + d.getHours() + ':' + d.getMinutes())
    });
    // console.log('Smart Thermostat Functionality:' + JSON.stringify(nextSchedules));
    // console.info(nextSchedules)
    //var nextSchedule = new Object();
    var index = 0;
    if (nextSchedules.length > 0) {
        // console.log('Smart Thermostat Functionality:' + JSON.stringify(nextSchedules));
        index = todaySchedules.indexOf(nextSchedules[0]);
        return todaySchedules[index];
    }
    else {
        // console.log('Smart Thermostat Functionality: Unable to find a schedule using the last in array');
        //there is no chedule left for today get first from tomorow
        var msecsIn1Day = 86400000;
        var tomorowIndex = new Date((new Date()).getTime() + msecsIn1Day).getDay();
        // console.info('Smart Thermostat Functionality: tomorow  index ' + JSON.stringify(tomorowIndex));
        var tomorowSchedules = node.thermostatSchedule[tomorowIndex];
        return tomorowSchedules[0];
        // var tomorowNextSchedule = tomorowSchedules[0];

        //var todayFirstSchedule = todaySchedules[todaySchedules.indexOf(todayFirstSchedules[0])];
        //todaySchedules[todaySchedules.indexOf(todayFirstSchedules[0])]
        // todaySchedules.push(tomorowNextSchedule);
        // index = todaySchedules.length - 1;
        // nextSchedule = todaySchedules[todaySchedules.length - 1];
    }
    // return todaySchedules[index];
    // nextSchedule = todaySchedules[index];
    // return nextSchedule;
    //console.log('Smart Thermostat Functionality: current schedule ' + JSON.stringify(currentSchedule));
    // Find comfort type
    //return metricsDef.comfortTypes[currentSchedule.comfortType]
}
exports.thermostatTriggerTargetTemperatureEvent = function (nodeX) {
    var node = new Object();
    db.find({ _id: nodeX._id }, function (err, entries) {
        if (entries.length == 1) {
            node = entries[0];
        }
        var eventKey = 'smartthermostattargettemperature';
        var event = metricsDef.events[eventKey];
        if (node.events[eventKey]) {
            if (node.events[eventKey] == 1) {
                exposeschedule(event.scheduledExecute, node, eventKey);
            }
        }

    });

}

exports.thermostatWorker = function (node, outsideTemperature) {
    console.info('Smart Thermostat Functionality: RUN');
    var modeKey = 'MODE';
    var avgTempKeky = 'AVGC';
    var targetHeatKey = 'TARGETHEAT';
    var targetCoolKey = 'TARGETCOOL';

    if (node.thermostatSchedule == null) {
        console.info('Smart Thermostat Functionality: Unable to find schedule program');
        return;
    }

    var currentInternalTemperature = undefined;
    var targetHeatTemperature = undefined;
    var targetCoolTemperature = undefined;

    if (node.metrics != undefined) {
        if (node.metrics[modeKey] == null) {
            console.info('Smart Thermostat Functionality: Unable to find metric MODE');
            return;
        } else {
            console.info('Smart Thermostat Functionality: current MODE ' + JSON.stringify(node.metrics[modeKey]));
        }
        //Get Inside temperature
        if (node.metrics[avgTempKeky] != undefined)
            currentInternalTemperature = parseFloat(node.metrics[avgTempKeky].value);
        //Get target heat temperature
        if (node.metrics[targetHeatKey] != undefined)
            targetHeatTemperature = parseFloat(node.metrics[targetHeatKey].value);
        //Get target cool temperature
        if (node.metrics[targetCoolKey] != undefined)
            targetCoolTemperature = parseFloat(node.metrics[targetCoolKey].value);
    }
    else {
        console.info('Smart Thermostat Functionality: metrics not found ');
        return;
    }
    exports.thermostatTemperaturesProcess(currentInternalTemperature, outsideTemperature, targetHeatTemperature, targetCoolTemperature);
}

exports.thermostatTemperaturesProcess = function (currentTemperature, outsideTemperature, targetHeatTemperature, targetCoolTemperature) {
    if (currentTemperature == undefined) {
        console.info('Smart Thermostat Temperature Process: invalid current temperature');
        return;
    }
    var temperatureHisteresis = parseFloat(settings.smartthermostat.temperatureDiferential.value);
    if (targetHeatTemperature == undefined)
        targetHeatTemperature = -100;
    if (targetCoolTemperature == undefined)
        targetCoolTemperature = 100;
    //Extend the temperature interval with thermostat histeresis
    var hlimitHeatTemperature = targetHeatTemperature - temperatureHisteresis;
    var hlimitCoolTemperature = targetCoolTemperature + temperatureHisteresis;

    var llimitHeatTemperature = targetHeatTemperature + temperatureHisteresis;
    var llimitCoolTemperature = targetCoolTemperature - temperatureHisteresis;
    console.info('Smart Thermostat Temperature Process: CurrentTemperature[' + currentTemperature + '] '
        + ' hHEAT[' + hlimitHeatTemperature + ']  hCOOL[' + hlimitCoolTemperature + ']'
        + ' lHEAT[' + llimitHeatTemperature + ']  lCOOL[' + llimitCoolTemperature + ']'
        + ' Outside Temperature [' + outsideTemperature + ']'
    );
    var message = 'Smart Thermostat Temperature Process: CurrentTemperature[' + currentTemperature + '] '
    + ' hHEAT[' + hlimitHeatTemperature + ']  hCOOL[' + hlimitCoolTemperature + ']'
    + ' lHEAT[' + llimitHeatTemperature + ']  lCOOL[' + llimitCoolTemperature + ']'
    + ' Outside Temperature [' + outsideTemperature + ']';

    //check to see if is inside the interval
    if ((currentTemperature >= hlimitHeatTemperature) && (currentTemperature <= hlimitCoolTemperature)) {
        //Lets see if we are inside the smaller interval
        console.info('Smart Thermostat Temperature Process: Im Inside the bigger interval');
        if ((currentTemperature >= llimitHeatTemperature) && (currentTemperature <= llimitCoolTemperature)) {
            // we are inside the interval so lets kill all the controlls
            sendMessageToNode({ nodeId: settings.smartthermostat.heatNodeId.value, action: 'OFF' });
            sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'OFF' });
            console.info('Smart Thermostat Temperature Process: Im Inside the interval kill all the heat/cool sources');
            sendEmail('Smart Thermostat Functionality', message + ' ALL OFF');
            // sendEmail('Smart Thermostat Functionality',
            //     'Inside the temperature interval kill all the heat/cool sources: ' + 'CurrentTemperature[' + currentTemperature + '] between HEAT[' + llimitHeatTemperature + '] and COOL[' + llimitCoolTemperature + ']');
        }
        else {
            //We do nothing let the temperature reach the limit
            // console.info('Smart Thermostat Temperature Process: Outside lower interval but inside the higher interval; let the sources on.');
            // sendEmail('Smart Thermostat Functionality',
            //     'Inside the temperature interval let heat/cool sources on: ' + 'CurrentTemperature[' + currentTemperature + '] between HEAT[' + hlimitHeatTemperature + '] and COOL[' + hlimitCoolTemperature + ']');
        }
    }
    else {
        //we are ouside the interval we have to do something lets see what
        console.info('Smart Thermostat Temperature Process: we are ouside the interval we have to do something lets see what');
        if (currentTemperature > hlimitCoolTemperature) {
            //Inside temperature is greater than cool temperature
            console.info('Smart Thermostat Functionality: Internal Temperature is on the high side of the interval lets check the outside temp');
            if (outsideTemperature > hlimitCoolTemperature) {
                // Outside temperature is greater then the set limit lets start cooling
                sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'ON' });
                console.info('Smart Thermostat Temperature Process: Outside temperature is greater then the set limit lets start cooling');
                sendEmail('Smart Thermostat Functionality', message + ' COOL ON');
                // sendEmail('Smart Thermostat Functionality',
                //     'Outside temperature is greater then the set limit lets start cooling: ' +
                //     'CurrentTemperature[' + currentTemperature + '] > COOL[' + hlimitCoolTemperature + '] and Outside Temperature [' + outsideTemperature + ']');

            }
            else {
                //Outside Temperature < upper limit and Inside Temp > upper limit; i think i dont care let's kill the AC
                //Outside is cooler than the cool limit and inside is hottter than the cool limit. maybe heat is gome bezerrk? lets kill all.
                sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'ON' });
                sendMessageToNode({ nodeId: settings.smartthermostat.heatNodeId.value, action: 'OFF' });
                console.info('Smart Thermostat Temperature Process: Outside Temperature < upper limit and Inside Temp > upper limit; i think i dont care lets kill the AC');
                sendEmail('Smart Thermostat Functionality', message + ' HEAT OFF and COOL ON');
                // sendEmail('Smart Thermostat Functionality',
                //     'Outside Temperature < upper limit and Inside Temp > upper limit; I think i dont care lets kill the AC (open a window? or heater is gone crazy) Kill all: ' +
                //     'CurrentTemperature[' + currentTemperature + '] > COOL[' + hlimitCoolTemperature + '] and Outside Temperature [' + outsideTemperature + ']');
            }
            //exit routine
            return;
        }

        if (currentTemperature < hlimitHeatTemperature) {
            //Internal Temperature is on the low side of the interval let's check the outside temp
            console.info('Smart Thermostat Temperature Process: Internal Temperature is on the low side of the interval lets check the outside temp');
            if (outsideTemperature > hlimitCoolTemperature) {
                //Outside Temperature is hiher than higher set limit smthing is wrong Too much cool kill the AC ALERT!!!
                sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'OFF' });
                sendEmail('Smart Thermostat Functionality', message + ' COOL OFF');
                console.info('Smart Thermostat Temperature Process: Outside Temperature is hiher than higher set limit smthing is wrong Too much cool kill the AC ALERT!!!');
                // sendEmail('Smart Thermostat Functionality',
                //     'Outside Temperature is hiher than higher set limit something is wrong Too much cool kill the AC ALERT!!!: ' +
                //     'CurrentTemperature[' + currentTemperature + '] COOL[' + hlimitCoolTemperature + '] and Outside Temperature [' + outsideTemperature + ']');
            }
            else {
                //Inside need heat and outside is smaller than the cooling limit set 
                // TO DO: check to see what we we use for heat

                //Turn the heater on
                sendMessageToNode({ nodeId: settings.smartthermostat.heatNodeId.value, action: 'ON' });
                console.info('Smart Thermostat Temperature Process: Outside Temperature is lower than higher set limit  and our internal Temperature is the same Lets start some heater');
                sendEmail('Smart Thermostat Functionality', message + ' HEAT ON');
                // sendEmail('Smart Thermostat Functionality',
                //     'Outside Temperature is lower than higher set limit  and our internal Temperature is the same Lets start some heater: ' +
                //     'CurrentTemperature[' + currentTemperature + '] COOL[' + hlimitCoolTemperature + '] Outside Temperature [' + outsideTemperature + ']  HEAT[' + hlimitHeatTemperature + ']');
            }
            // if (outsideTemperature < heatTemperatureLimit) {
            //     //Outside Temperature is lower than lower set limit  and our internal Temperature is the same Let's start the heater
            //     //Here we have to check if we can start AC for heating
            //     sendMessageToNode({ nodeId: settings.smartthermostat.heatNodeId.value, action: 'ON' });
            //     targetTemperature = currentComfortType.heat.temperature;
            //     console.info('Smart Thermostat Functionality: Outside Temperature is lower than lower set limit  and our internal Temperature is the same Lets start the heater');
            // }
            //return;
        }
    }
}

// global.thermostatFunctionality = function (thNode, outsideTemperature) {
//     console.info('Smart Thermostat Functionality: RUN');
//     if (thNode.metrics['MODE'] == null) {
//         console.info('Smart Thermostat Functionality: Unable to find metric MODE');
//         return;
//     }
//     else {
//         console.info('Smart Thermostat Functionality: current MODE ' + JSON.stringify(thNode.metrics['MODE']));
//     }
//     if (thNode.thermostatSchedule == null) {
//         console.info('Smart Thermostat Functionality: Unable to find schedule program');
//         return;
//     }

//     // Find comfort type
//     var currentComfortType = thermostatGetCurrentComfortType(thNode);
//     console.info('Smart Thermostat Functionality: current Comfort Type ' + JSON.stringify(currentComfortType));
//     var targetTemperature = 0;


//     var currentInternalTemperature = undefined;
//     //Get Inside temperature
//     if (thNode.metrics != undefined)
//         if (thNode.metrics['AVGC'] != undefined)
//             currentInternalTemperature = thNode.metrics['AVGC'].value;

//     switch (thNode.metrics['MODE'].value) {
//         case 'HEAT':
//             //targetTemperature = currentComfortType.heat.temperature;
//             var heatComfortType = currentComfortType;
//             heatComfortType.cool.temperature = 100; //Set the upper limit sky high to disable cooling
//             targetTemperature = thermostatTemperatureDecisions(currentInternalTemperature, outsideTemperature, heatComfortType);
//             break;
//         case 'COOL':
//             // targetTemperature = currentComfortType.cool.temperature;
//             var coolComfortType = currentComfortType;
//             coolComfortType.heat.temperature = -100; //Set the lower limit verry low to disable cooling
//             targetTemperature = thermostatTemperatureDecisions(currentInternalTemperature, outsideTemperature, coolComfortType);
//             break;
//         case 'AWAY':
//             currentComfortType = metricsDef.comfortTypes['away'];
//             targetTemperature = thermostatTemperatureDecisions(currentInternalTemperature, outsideTemperature, currentComfortType);
//             // if (currentInternalTemperature < metricsDef.comfortTypes['away'].heat.temperature - settings.smartthermostat.temperatureDiferential.value) {
//             //     //Need For Heat
//             //     targetTemperature = metricsDef.comfortTypes['away'].heat.temperature;
//             // }
//             // if (currentInternalTemperature > metricsDef.comfortTypes['away'].cool.temperature + settings.smartthermostat.temperatureDiferential.value) {
//             //     //  Need for Cool
//             //     targetTemperature = metricsDef.comfortTypes['away'].cool.temperature;
//             // }
//             // var heatDiff = Math.abs(metricsDef.comfortTypes['away'].heat.temperature - currentInternalTemperature);
//             // var coolDiff = Math.abs(metricsDef.comfortTypes['away'].cool.temperature - currentInternalTemperature);
//             // if (heatDiff > coolDiff) {
//             //     targetTemperature = metricsDef.comfortTypes['away'].cool.temperature

//             // }
//             // else {
//             //     targetTemperature = metricsDef.comfortTypes['away'].heat.temperature
//             // }
//             // if (targetTemperature == 0) targetTemperature = currentInternalTemperature

//             //Maybe here we have to check to see if we return heat or cool
//             //targetTemperature = metricsDef.comfortTypes['away'].heat.temperature;
//             break;
//         case 'AUTO':
//             targetTemperature = thermostatTemperatureDecisions(currentInternalTemperature, outsideTemperature, currentComfortType);
//             break;
//         case 'OFF':
//             //targetTemperature = 0;
//             break;
//     }
//     // if (targetTemperature > 0) {
//     //     var fakeSerialMsg = '[' + thNode._id + '] ' + 'TARGET:' + targetTemperature;
//     //     processSerialData(fakeSerialMsg);
//     // }

// }

// global.thermostatTemperatureDecisions = function (scurrentInternalTemperature, soutsideTemperature, currentComfortType) {
//     var currentInternalTemperature = parseFloat(scurrentInternalTemperature);
//     var outsideTemperature = parseFloat(soutsideTemperature);
//     console.info('Smart Thermostat Functionality: Outside temperature: ' + outsideTemperature);
//     console.info('Smart Thermostat Functionality: Inside temperature: ' + currentInternalTemperature);
//     console.info('Smart Thermostat Functionality: used Comfort Type ' + JSON.stringify(currentComfortType));
//     var targetTemperature = 0;
//     var heatTemperatureLimit = parseFloat(currentComfortType.heat.temperature) - parseFloat(settings.smartthermostat.temperatureDiferential.value)
//     var coolTemperatureLimit = parseFloat(currentComfortType.cool.temperature) + parseFloat(settings.smartthermostat.temperatureDiferential.value)
//     console.info('Smart Thermostat Functionality: Inside temperature lower limit >=' + heatTemperatureLimit)
//     console.info('Smart Thermostat Functionality: Inside temperature upper limit <=' + coolTemperatureLimit)
//     //Here we have to see what we have to use heat or cool
//     if (
//         (currentInternalTemperature >= heatTemperatureLimit) &&
//         (currentInternalTemperature <= coolTemperatureLimit)
//     ) {
//         //I'm Inside the interval kill all the heat/cool sources
//         sendMessageToNode({ nodeId: settings.smartthermostat.heatNodeId.value, action: 'OFF' });
//         sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'OFF' });
//         console.info('Smart Thermostat Functionality: Im Inside the interval kill all the heat/cool sources');
//         //try to determine what is target temperature
//         targetTemperature = currentInternalTemperature < outsideTemperature ? currentComfortType.cool.temperature : currentComfortType.heat.temperature;
//     }
//     else {
//         //I'm outside the interval something need to be done
//         //Let's check where we are
//         if (currentInternalTemperature > coolTemperatureLimit) {
//             // Internal Temperature is on the high side of the interval let's check the outside temp
//             console.info('Smart Thermostat Functionality: Internal Temperature is on the high side of the interval lets check the outside temp');
//             if (outsideTemperature > coolTemperatureLimit) {
//                 // Outside temperature is greater then the set limit lets start cooling
//                 sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'ON' });
//                 targetTemperature = currentComfortType.cool.temperature;
//                 console.info('Smart Thermostat Functionality: Outside temperature is greater then the set limit lets start cooling');
//             }
//             else {
//                 //Outside Temperature < upper limit and Inside Temp > upper limit; i think i dont care let's kill the AC
//                 sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'OFF' });
//                 targetTemperature = currentComfortType.cool.temperature;
//                 console.info('Smart Thermostat Functionality: Outside Temperature < upper limit and Inside Temp > upper limit; i think i dont care lets kill the AC');
//             }
//         }
//         else if (currentInternalTemperature < heatTemperatureLimit) {
//             //Internal Temperature is on the low side of the interval let's check the outside temp
//             console.info('Smart Thermostat Functionality: Internal Temperature is on the low side of the interval lets check the outside temp');
//             if (outsideTemperature > coolTemperatureLimit) {
//                 //Outside Temperature is hiher than higher set limit smthing is wrong Too much cool kill the AC ALERT!!!
//                 sendMessageToNode({ nodeId: settings.smartthermostat.coolNodeId.value, action: 'OFF' });
//                 targetTemperature = currentComfortType.cool.temperature;
//                 console.info('Smart Thermostat Functionality: Outside Temperature is hiher than higher set limit smthing is wrong Too much cool kill the AC ALERT!!!');
//             }

//             if (outsideTemperature < heatTemperatureLimit) {
//                 //Outside Temperature is lower than lower set limit  and our internal Temperature is the same Let's start the heater
//                 //Here we have to check if we can start AC for heating
//                 sendMessageToNode({ nodeId: settings.smartthermostat.heatNodeId.value, action: 'ON' });
//                 targetTemperature = currentComfortType.heat.temperature;
//                 console.info('Smart Thermostat Functionality: Outside Temperature is lower than lower set limit  and our internal Temperature is the same Lets start the heater');
//             }


//         }
//     }

//     console.info('Smart Thermostat Functionality: current target Temperature  ' + targetTemperature);
//     return targetTemperature
//     // if (targetTemperature != 0)
//     //     updateNodeMetric({ nodeId: node._id, metric: { name: 'ThC', value: targetTemperature } });
// }

// global.thermostatGetCurrentComfortType = function (thNode) {
//     //var todaySchedulesObject = thNode.thermostatSchedule[(new Date()).getDay()];
//     var todaySchedules = [];
//     todaySchedules = thNode.thermostatSchedule[(new Date()).getDay()].map(function (schedule) { return schedule });
//     //Find first schedule of the day
//     var todayFirstSchedules = todaySchedules.filter(function (schedule) {
//         var d = new Date();
//         return new Date('1970/01/01 ' + schedule.startTime) >= new Date('1970/01/01 00:00')
//     });

//     var todayFirstSchedule = todaySchedules[todaySchedules.indexOf(todayFirstSchedules[0])];
//     //WE need to have full day filled so if the firs our is not 00:00 we have to add it from the last day
//     if (new Date('1970/01/01 ' + todayFirstSchedule.startTime) > new Date('1970/01/01 00:00')) {
//         //We dont have 00:00 schedule get previous day schedule
//         var msecsIn1Day = 86400000;
//         var yesterdayIndex = new Date((new Date()).getTime() - msecsIn1Day).getDay();
//         console.info('Smart Thermostat Functionality: yesterday index ' + JSON.stringify(yesterdayIndex));
//         var yesterdaySchedules = thNode.thermostatSchedule[yesterdayIndex];

//         var yesterdayLastSchedule = yesterdaySchedules[yesterdaySchedules.length - 1];
//         yesterdayLastSchedule.startTime = '00:00';
//         todaySchedules.unshift(yesterdayLastSchedule);

//     }

//     var nextSchedules = todaySchedules.filter(function (schedule) {
//         var d = new Date();
//         return new Date('1970/01/01 ' + schedule.startTime) >= new Date('1970/01/01 ' + d.getHours() + ':' + d.getMinutes())
//     });
//     // console.info(nextSchedules)
//     var currentSchedule = new Object();
//     if (nextSchedules.length > 0) {
//         // console.log('Smart Thermostat Functionality:' + JSON.stringify(nextSchedules));
//         var index = todaySchedules.indexOf(nextSchedules[0]) - 1;
//         currentSchedule = todaySchedules[index];
//     }
//     else {
//         // console.log('Smart Thermostat Functionality: Unable to find a schedule using the last in array');
//         currentSchedule = todaySchedules[todaySchedules.length - 1];
//     }

//     //console.log('Smart Thermostat Functionality: current schedule ' + JSON.stringify(currentSchedule));
//     // Find comfort type
//     return metricsDef.comfortTypes[currentSchedule.comfortType]

// }
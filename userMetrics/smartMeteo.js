
//global.updateSourceNodesInNode = require('customFunctions.js').updateSourceNodesInNode;
exports.updateSourceNodesInNode = require(path.resolve(__dirname, 'customFunctions.js')).updateSourceNodesInNode;


exports.motes = {
    SmartMeteo: {
        label: 'Smart Meteo',
        icon: 'appbar.weather.symbol.svg',
    }
};
exports.metrics = {
    FORECAST:{ name: 'Forecast',  value: ''  },
    PT1:{name: 'PT1', value:'', graph:1, graphOptions: { legendLbl: 'Pressure Trend 1h', lines: { lineWidth: 1 } }},
    PT6:{name: 'PT6', value:'', graph:1, graphOptions: { legendLbl: 'Pressure Trend 6h', lines: { lineWidth: 1 } }},
    PT12:{name: 'PT12', value:'', graph:1 , graphOptions: { legendLbl: 'Pressure Trend 12h', lines: { lineWidth: 1 } }},
};

exports.events = {
    // forecastPush: {
    //     label: "Push: Pressure For Forecast",
    //     icon: "action",
    //     descr: "Push Pressure from this node to Forecast Node",
    //     serverExecute: function (node) {
    //         if (node.metrics['P'] && (Date.now() - new Date(node.metrics['P'].updated).getTime() < 2000)) {
    //             sendForecastToNode({ nodeId: node._id, forecastNodeId: settings.meteoforecast.nodeId.value });
    //         };
    //     }
    // },
    outsidePressurePushToSourceNodes: {
        label: "Push to Source Nodes:Smart Meteo Atmosferic Pressure",
        icon: "action",
        descr: "Push Atmosferic Pressure from this node to Meteo Node",
        serverExecute: function (node) {
            if (node.metrics['C'] && (Date.now() - new Date(node.metrics['C'].updated).getTime() < 2000)) {
                var metricSource = new Object();
                metricSource.label = node.metrics['P'].label;
                metricSource.value = node.metrics['P'].value;
                metricSource.unit = node.metrics['P'].unit;
                metricSource.updated = node.metrics['P'].updated;
                metricSource.name = 'P';
                setTimeout(exports.updateSourceNodesInNode, 1050, { nodeId: settings.meteoforecast.nodeId.value, sourceNodeId: node._id, metric: metricSource })
            };
        }
    },
    outsideTemperaturePushToSourceNodes: {
        label: "Push to Source Nodes:Smart Meteo Temperature",
        icon: "action",
        descr: "Push Temperature from this node to Meteo Node",
        serverExecute: function (node) {
            if (node.metrics['C'] && (Date.now() - new Date(node.metrics['C'].updated).getTime() < 2000)) {
                var metricSource = new Object();
                metricSource.label = node.metrics['C'].label;
                metricSource.value = node.metrics['C'].value;
                metricSource.unit = node.metrics['C'].unit;
                metricSource.updated = node.metrics['C'].updated;
                metricSource.name = 'C';
                console.log('outsideTemperaturePushToSourceNodes: ' + JSON.stringify({ nodeId: settings.meteoforecast.nodeId.value, sourceNodeId: node._id, metric: metricSource }));
                setTimeout(exports.updateSourceNodesInNode, 1400, { nodeId: settings.meteoforecast.nodeId.value, sourceNodeId: node._id, metric: metricSource })
            };
        }
    },
    outsideHumidityPushToSourceNodes: {
        label: "Push to Source Nodes:Smart Meteo Humidity",
        icon: "action",
        descr: "Push Humidity from this node to Meteo Node",
        serverExecute: function (node) {
            if (node.metrics['H'] && (Date.now() - new Date(node.metrics['H'].updated).getTime() < 2000)) {
                var metricSource = new Object();
                metricSource.label = node.metrics['H'].label;
                metricSource.value = node.metrics['H'].value;
                metricSource.unit = node.metrics['H'].unit;
                metricSource.updated = node.metrics['H'].updated;
                metricSource.name = 'H';
                setTimeout(exports.updateSourceNodesInNode, 1100, { nodeId: settings.meteoforecast.nodeId.value, sourceNodeId: node._id, metric: metricSource })
            };
        }
    },
    smartMeteoForecast:{
      label: "Smart Meteo Forecasting Event",
      icon: 'clock',
      descr: 'Smart Meteo Forecasting Functionality',
      condition: function (node){
        // console.log('Evaluating Smart Meteo Condition');
        // if (node.metrics['Forecast']){
        // console.log('Smart meteo has FORECAST:' +JSON.stringify(node.metrics['Forecast']));
        // var datadiff = Date.now() - new Date(node.metrics['Forecast'].updated).getTime();
        // console.log('Smart Meteo Forecast Time Difference :' + datadiff);
        // var conditionX = node.metrics['Forecast'] && (Date.now() - new Date(node.metrics['Forecast'].updated).getTime() > 2000);
        // console.log('Evaluating Condition :' + conditionX);
        // }

        return node.metrics['AVGP'] && (Date.now() - new Date(node.metrics['AVGP'].updated).getTime() < 2000)
      },
      serverExecute:function (node){
        console.log('Smart Meteo Start Executing');
        // var periodsToCalculate=[1,6,12];
        var metrictrend1 = getMetricTrend(node._id, "AVGP", 1, 1.3332239 * 100); //Average Pressure
        var pressureChange1 = getPressureChangeType(metrictrend1);
        console.log('Smart Meteo Metric trend :' + metrictrend1 + ' pressure change: ' +pressureChange1);
         setTimeout(updateNodeMetric,1720,{ nodeId: node._id, metric: { name: 'PT1', value: pressureChange1 } });

        var metrictrend6 = getMetricTrend(node._id, "AVGP", 6, 1.3332239 * 100); //Average Pressure
        var pressureChange6 = getPressureChangeType(metrictrend6);
        console.log('Smart Meteo Metric trend :' + metrictrend6 + ' pressure change: ' +pressureChange6);
         setTimeout(updateNodeMetric, 1740,{ nodeId: node._id, metric: { name: 'PT6', value: pressureChange6 } });

         var metrictrend12 = getMetricTrend(node._id, "AVGP", 12, 1.3332239 * 100); //Average Pressure
         var pressureChange12 = getPressureChangeType(metrictrend12);
         console.log('Smart Meteo Metric trend :' + metrictrend12 + ' pressure change: ' +pressureChange12);
         setTimeout(updateNodeMetric,1760, { nodeId: node._id, metric: { name: 'PT12', value: pressureChange12 } });

        setTimeout(updateNodeMetric,1780,{ nodeId: node._id, metric: { name: 'Forecast', value: getForecast(node._id, pressureChange1, pressureChange6) } });

      }
    }
};

// global.sendForecastToNode = function (node) {

//   var dbNode = new Object();

//   db.find({ _id: node.forecastNodeId }, function (err, entries) {
//     if (entries.length == 1) {
//       dbNode = entries[0];
//     }
//     // console.log("Forecast start pushing :" + node.nodeId);
//     dbNode._id = node.forecastNodeId;
//     dbNode.updated = new Date().getTime(); //update timestamp we last heard from this node, regardless of any matches
//     dbNode.rssi = undefined;
//     if (dbNode.metrics == undefined)
//       dbNode.metrics = new Object();

//     matchingMetric = metricsDef.metrics['PT1'];
//     var metrictrend1 = getMetricTrend(node.nodeId, "P", 1, 1.3332239 * 100);
//     var pressureChange1 = getPressureChangeType(metrictrend1);
//     if (dbNode.metrics[matchingMetric.name] == null) dbNode.metrics[matchingMetric.name] = new Object();
//     dbNode.metrics[matchingMetric.name].label = dbNode.metrics[matchingMetric.name].label || matchingMetric.name;
//     dbNode.metrics[matchingMetric.name].descr = dbNode.metrics[matchingMetric.name].descr || matchingMetric.descr || undefined;
//     dbNode.metrics[matchingMetric.name].value = pressureChange1;
//     dbNode.metrics[matchingMetric.name].unit = dbNode.unit || undefined;
//     dbNode.metrics[matchingMetric.name].updated = dbNode.updated;
//     dbNode.metrics[matchingMetric.name].pin = dbNode.metrics[matchingMetric.name].pin != undefined ? dbNode.metrics[matchingMetric.name].pin : matchingMetric.pin;
//     dbNode.metrics[matchingMetric.name].graph = dbNode.metrics[matchingMetric.name].graph != undefined ? dbNode.metrics[matchingMetric.name].graph : matchingMetric.graph;

//     //log data for graphing purposes, keep labels as short as possible since this log will grow indefinitely and is not compacted like the node database
//     if (dbNode.metrics[matchingMetric.name].graph == 1) {
//       var graphValue = metricsDef.isNumeric(matchingMetric.logValue) ? matchingMetric.logValue : pressureChange1; //existingNode.metrics[matchingMetric.name].value;
//       console.log('graphvalue : [' + graphValue + ']');
//       if (metricsDef.isNumeric(graphValue)) {
//         var ts = Math.floor(Date.now() / 1000); //get timestamp in whole seconds
//         var logfile = path.join(__dirname, dbDir, dbLog.getLogName(dbNode._id, matchingMetric.name));
//         try {
//           console.log('post: ' + logfile + '[' + ts + ',' + graphValue + ']');
//           dbLog.postData(logfile, ts, graphValue);
//         } catch (err) { console.error('   POST ERROR: ' + err.message); /*console.log('   POST ERROR STACK TRACE: ' + err.stack); */ } //because this is a callback concurrent calls to the same log, milliseconds apart, can cause a file handle concurrency exception
//       }
//       else console.log('   METRIC NOT NUMERIC, logging skipped... (extracted value:' + graphValue + ')');
//     }

//     matchingMetric = metricsDef.metrics['PT6'];
//     var metrictrend6 = getMetricTrend(node.nodeId, "P", 6, 1.3332239 * 100);
//     var pressureChange6 = getPressureChangeType(metrictrend6);
//     if (dbNode.metrics[matchingMetric.name] == null) dbNode.metrics[matchingMetric.name] = new Object();
//     dbNode.metrics[matchingMetric.name].label = dbNode.metrics[matchingMetric.name].label || matchingMetric.name;
//     dbNode.metrics[matchingMetric.name].descr = dbNode.metrics[matchingMetric.name].descr || matchingMetric.descr || undefined;
//     dbNode.metrics[matchingMetric.name].value = pressureChange6;
//     dbNode.metrics[matchingMetric.name].unit = dbNode.unit || undefined;
//     dbNode.metrics[matchingMetric.name].updated = dbNode.updated;
//     dbNode.metrics[matchingMetric.name].pin = dbNode.metrics[matchingMetric.name].pin != undefined ? dbNode.metrics[matchingMetric.name].pin : matchingMetric.pin;
//     dbNode.metrics[matchingMetric.name].graph = dbNode.metrics[matchingMetric.name].graph != undefined ? dbNode.metrics[matchingMetric.name].graph : matchingMetric.graph;

//     //log data for graphing purposes, keep labels as short as possible since this log will grow indefinitely and is not compacted like the node database
//     if (dbNode.metrics[matchingMetric.name].graph == 1) {
//       var graphValue = metricsDef.isNumeric(matchingMetric.logValue) ? matchingMetric.logValue : pressureChange6; //existingNode.metrics[matchingMetric.name].value;
//       console.log('graphvalue : [' + graphValue + ']');
//       if (metricsDef.isNumeric(graphValue)) {
//         var ts = Math.floor(Date.now() / 1000); //get timestamp in whole seconds
//         var logfile = path.join(__dirname, dbDir, dbLog.getLogName(dbNode._id, matchingMetric.name));
//         try {
//           console.log('post: ' + logfile + '[' + ts + ',' + graphValue + ']');
//           dbLog.postData(logfile, ts, graphValue);
//         } catch (err) { console.error('   POST ERROR: ' + err.message); /*console.log('   POST ERROR STACK TRACE: ' + err.stack); */ } //because this is a callback concurrent calls to the same log, milliseconds apart, can cause a file handle concurrency exception
//       }
//       else console.log('   METRIC NOT NUMERIC, logging skipped... (extracted value:' + graphValue + ')');
//     }

//     matchingMetric = metricsDef.metrics['PT12'];
//     var metrictrend12 = getMetricTrend(node.nodeId, "P", 12, 1.3332239 * 100);
//     var pressureChange12 = getPressureChangeType(metrictrend12);
//     if (dbNode.metrics[matchingMetric.name] == null) dbNode.metrics[matchingMetric.name] = new Object();
//     dbNode.metrics[matchingMetric.name].label = dbNode.metrics[matchingMetric.name].label || matchingMetric.name;
//     dbNode.metrics[matchingMetric.name].descr = dbNode.metrics[matchingMetric.name].descr || matchingMetric.descr || undefined;
//     dbNode.metrics[matchingMetric.name].value = pressureChange12;
//     dbNode.metrics[matchingMetric.name].unit = dbNode.unit || undefined;
//     dbNode.metrics[matchingMetric.name].updated = dbNode.updated;
//     dbNode.metrics[matchingMetric.name].pin = dbNode.metrics[matchingMetric.name].pin != undefined ? dbNode.metrics[matchingMetric.name].pin : matchingMetric.pin;
//     dbNode.metrics[matchingMetric.name].graph = dbNode.metrics[matchingMetric.name].graph != undefined ? dbNode.metrics[matchingMetric.name].graph : matchingMetric.graph;

//     //log data for graphing purposes, keep labels as short as possible since this log will grow indefinitely and is not compacted like the node database
//     if (dbNode.metrics[matchingMetric.name].graph == 1) {
//       var graphValue = metricsDef.isNumeric(matchingMetric.logValue) ? matchingMetric.logValue : pressureChange12; //existingNode.metrics[matchingMetric.name].value;
//       console.log('graphvalue : [' + graphValue + ']');
//       if (metricsDef.isNumeric(graphValue)) {
//         var ts = Math.floor(Date.now() / 1000); //get timestamp in whole seconds
//         var logfile = path.join(__dirname, dbDir, dbLog.getLogName(dbNode._id, matchingMetric.name));
//         try {
//           console.log('post: ' + logfile + '[' + ts + ',' + graphValue + ']');
//           dbLog.postData(logfile, ts, graphValue);
//         } catch (err) { console.error('   POST ERROR: ' + err.message); /*console.log('   POST ERROR STACK TRACE: ' + err.stack); */ } //because this is a callback concurrent calls to the same log, milliseconds apart, can cause a file handle concurrency exception
//       }
//       else console.log('   METRIC NOT NUMERIC, logging skipped... (extracted value:' + graphValue + ')');
//     }

//     matchingMetric = metricsDef.metrics['FORECAST'];

//     if (dbNode.metrics[matchingMetric.name] == null) dbNode.metrics[matchingMetric.name] = new Object();
//     dbNode.metrics[matchingMetric.name].label = dbNode.metrics[matchingMetric.name].label || matchingMetric.name;
//     dbNode.metrics[matchingMetric.name].descr = dbNode.metrics[matchingMetric.name].descr || matchingMetric.descr || undefined;
//     dbNode.metrics[matchingMetric.name].value = getForecast(node.nodeId, pressureChange1, pressureChange6);
//     dbNode.metrics[matchingMetric.name].unit = dbNode.unit || undefined;
//     dbNode.metrics[matchingMetric.name].updated = dbNode.updated;
//     dbNode.metrics[matchingMetric.name].pin = dbNode.metrics[matchingMetric.name].pin != undefined ? dbNode.metrics[matchingMetric.name].pin : matchingMetric.pin;
//     dbNode.metrics[matchingMetric.name].graph = dbNode.metrics[matchingMetric.name].graph != undefined ? dbNode.metrics[matchingMetric.name].graph : matchingMetric.graph;


//     db.findOne({ _id: dbNode._id }, function (err, doc) {
//       if (doc == null) {
//         db.insert(dbNode);
//         console.log('   [' + dbNode._id + '] DB-Insert new _id:' + dbNode._id + ' for Forecast');
//       }
//       else
//         db.update({ _id: dbNode._id }, { $set: dbNode }, {}, function (err, numReplaced) { console.log('   [' + dbNode._id + '] DB-Updates:' + numReplaced + ' for Forecast'); });

//       io.sockets.emit('UPDATENODE', dbNode); //post it back to all clients to confirm UI changes
//     });
//   });
// }

global.getMetricTrend = function (nodeId, metricKey, hours, unitConversion) {
  // unitConversion for mmHg To mb*100 = 1.3332239*100
  //  console.log("Forecasting hours:"+hours);

  start = ((new Date()).getTime()) - (3600000 * hours);	//Get start time
  //  console.log("Forecasting start:"+start);

  end = (new Date()).getTime();	//Get end time
  //  console.log("Forecasting end:"+end);

  var sts = Math.floor(start / 1000); //get timestamp in whole seconds
  var ets = Math.floor(end / 1000); //get timestamp in whole seconds
  var logfile = path.join(__dirname + '/../', dbDir, dbLog.getLogName(nodeId, metricKey));
  var logData = dbLog.getData(logfile, sts, ets);

  var ratePerHour = 0;
  //  console.log("Forecasting logData.length:"+logData.data.length);
  if (logData.data.length > 0) {

    var pastPressure = logData.data[0].v * unitConversion; //(logData[0]*1.3332239)*100; // put in units of mb * 100
    // console.log("Forecasting pastPressure:"+pastPressure);
    // console.log("Forecasting firstPressure mmHg:"+logData.data[0].v);
    var lastPressure = logData.data[logData.data.length - 1].v * unitConversion; //(logData[logData.length-1]*1.3332239)*100; // convert from mmHg to milibas and change to units of mb*100
    // console.log("Forecasting lastPressure:"+lastPressure);
    // console.log("Forecasting lastPressure mmHg:"+logData.data[logData.data.length - 1].v);
    // compute rate of change
    ratePerHour = 60 * (lastPressure - pastPressure) / (60 * hours);
    // console.log("Forecasting ratePerHour:"+ratePerHour);
    return ratePerHour;
  }
  else {
    return 0;
  }
}

global.getPressureChangeType = function (mbX100PerHour) {
  var absPressure = Math.abs(mbX100PerHour);
  var pressureChange = 0; //by default we suppose is 0 and get rid of checking is 0
  if (absPressure > 200)
    pressureChange = 4;
  else if (absPressure > 120)
    pressureChange = 3;
  else if (absPressure > 53)
    pressureChange = 2;
  else if (absPressure > 0)
    pressureChange = 1;
  if (mbX100PerHour < 0)
    pressureChange *= (-1);
  return pressureChange;
  //  console.log("Forecasting mbX100PerHour:"+mbX100PerHour);
  //  console.log("Forecasting pressureChangeType:"+pressureChange);
}

global.getForecast = function (nodeId, pressureChange1, pressureChange5) {
  // var stringR = "";
  //console.log("Forecasting start forecasting :" + nodeId);

  // var mt1 = getMetricTrend(nodeId, "P", 1, 1.3332239 * 100);
  // console.log("Forecasting trend 1h:"+mt1);
  //var pressureChange1 = getPressureChangeType(metrictrend1);
  // console.log("Forecasting pressureChangeType 1h:" + pressureChange1);

  // var mt5 = getMetricTrend(nodeId, "P", 6, 1.3332239 * 100);
  // console.log("Forecasting trend 6h:"+mt5);
  //var pressureChange5 = getPressureChangeType(metrictrend6);
  //console.log("Forecasting pressureChangeType 6h:" + pressureChange5);

  // Sudden decrease, even if small, indicates a nearby disturbance; normally bringing wind, and short showers. 
  if (pressureChange1 <= pressureChangeType.FALLING_QUICKLY && pressureChange5 > pressureChangeType.FALLING) {
    return "Brief Shower";
  }
  // Moderate, slow fall in pressure indicates low pressure area is passing at a distance. Any marked change in weather unlikely.
  else if (pressureChange1 == pressureChangeType.FALLING_SLOWLY && pressureChange5 == pressureChangeType.FALLING_SLOWLY) {
    return "Unchanged";
  }
  // Large, slow decrease indicates a long period of poor weather. Coming weather will be more pronounced if pressure started rising before dropping.
  else if ((pressureChange1 == pressureChangeType.FALLING_SLOWLY || pressureChange1 == pressureChangeType.FALLING) &&
    (pressureChange5 == pressureChangeType.FALLING_SLOWLY || pressureChange5 == pressureChangeType.FALLING)) {
    return "Poor Weather";
  }
  // Large pressure drop signals a coming storm in 5 to 6 hours.
  else if (pressureChange1 <= pressureChangeType.FALLING_QUICKLY && pressureChange5 <= pressureChangeType.FALLING) {
    return "Approaching Storm";
  }
  // If pressure rise is large and prolonged, count on a many days of good weather ahead.
  else if ((pressureChange1 == pressureChangeType.RISING_SLOWLY || pressureChange1 == pressureChangeType.RISING) &&
    (pressureChange5 == pressureChangeType.RISING_SLOWLY || pressureChange5 == pressureChangeType.RISING)) {
    return "Good Weather";
  }
  // If an upward and quick change, storminess is moving out and clearing may be coming in the very near future although it may be quite windy.
  else if (pressureChange1 >= pressureChangeType.RISING_QUICKLY && pressureChange5 >= pressureChangeType.RISING) {
    return "Clearing";
  }
  // If the pressure is changing by more than 1 mb/hour and if the tendency is downward, expect more stormy weather on the way.
  else if (pressureChange1 == pressureChangeType.PLUMMETING) {
    return "Very Stormy";
  }
  else if (pressureChange1 == pressureChangeType.FALLING_QUICKLY) {
    return "Stormy";
  }
  else if (pressureChange1 == pressureChangeType.FALLING || pressureChange1 == pressureChangeType.FALLING_SLOWLY) {
    return "Rain";
  }
  else if (pressureChange1 == pressureChangeType.STEADY) {
    return "Unchanged";
  }
  else if (pressureChange1 == pressureChangeType.RISING_SLOWLY || pressureChange1 == pressureChangeType.RISING) {
    return "Fair";
  }
  else if (pressureChange1 == pressureChangeType.RISING_QUICKLY || pressureChange1 == pressureChangeType.SOARING) {
    return "Clear, Dry";
  }
  else {
    return "Err ";
  }
}

global.pressureChangeType = {
  SOARING: 4,
  RISING_QUICKLY: 3,
  RISING: 2,
  RISING_SLOWLY: 1,
  STEADY: 0,
  FALLING_SLOWLY: -1,
  FALLING: -2,
  FALLING_QUICKLY: -3,
  PLUMMETING: -4
};
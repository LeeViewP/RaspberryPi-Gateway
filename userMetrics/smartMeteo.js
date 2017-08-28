
//global.updateSourceNodesInNode = require('customFunctions.js').updateSourceNodesInNode;
exports.updateSourceNodesInNode = require(path.resolve(__dirname, 'customFunctions.js')).updateSourceNodesInNode;


exports.motes = {
  SmartMeteo: {
    label: 'Smart Meteo',
    icon: 'appbar.weather.symbol.svg',
  }
};
exports.metrics = {
  FORECAST: { name: 'Forecast',regexp:/\bForecast\:("Brief Shower|Unchanged|Poor Weather|Approaching Storm|Good Weather|Clearing|Very Stormy|Stormy|Rain|Fair|Clear, Dry|Error)\b/i, value: '' },
  PT1: { name: 'PT1',regexp:/\bPT1\:([-\d\.]+)\b/i, value: '', graph: 1, graphOptions: { legendLbl: 'Pressure Trend 1h', lines: { lineWidth: 1 } } },
  PT6: { name: 'PT6',regexp:/\bPT6\:([-\d\.]+)\b/i, value: '', graph: 1, graphOptions: { legendLbl: 'Pressure Trend 6h', lines: { lineWidth: 1 } } },
  PT12: { name: 'PT12',regexp:/\bPT12\:([-\d\.]+)\b/i, value: '', graph: 1, graphOptions: { legendLbl: 'Pressure Trend 12h', lines: { lineWidth: 1 } } },
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
        // console.log('outsideTemperaturePushToSourceNodes: ' + JSON.stringify({ nodeId: settings.meteoforecast.nodeId.value, sourceNodeId: node._id, metric: metricSource }));
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
  smartMeteoForecast: {
    label: "Smart Meteo Forecasting Event",
    icon: 'clock',
    descr: 'Smart Meteo Forecasting Functionality',
    condition: function (node) {
      return node.metrics['AVGP'] && (Date.now() - new Date(node.metrics['AVGP'].updated).getTime() < 2000) &&
        node.metrics['Forecast'] && (Date.now() - new Date(node.metrics['Forecast'].updated).getTime() > 1000) && // anfd if forecast is not updated in the last second
        node.metrics['PT1'] && (Date.now() - new Date(node.metrics['PT1'].updated).getTime() > 1000) &&
        node.metrics['PT6'] && (Date.now() - new Date(node.metrics['PT6'].updated).getTime() > 1000) &&
        node.metrics['PT12'] && (Date.now() - new Date(node.metrics['PT12'].updated).getTime() > 1000)
    },
    serverExecute: function (node) {
      console.info('Smart Meteo Start Executing');
      // var periodsToCalculate=[1,6,12];
      var fakeSerialMsg = '[' + node._id + '] ';
      var metrictrend1 = getMetricTrend(node._id, "AVGP", 1, 1.3332239 * 100); //Average Pressure
      var pressureChange1 = getPressureChangeType(metrictrend1);
      fakeSerialMsg += 'PT1:' + (pressureChange1) + ' ';

      var metrictrend6 = getMetricTrend(node._id, "AVGP", 6, 1.3332239 * 100); //Average Pressure
      var pressureChange6 = getPressureChangeType(metrictrend6);
      fakeSerialMsg += 'PT6:' + (pressureChange6) + ' ';


      var metrictrend12 = getMetricTrend(node._id, "AVGP", 12, 1.3332239 * 100); //Average Pressure
      var pressureChange12 = getPressureChangeType(metrictrend12);
      fakeSerialMsg += 'PT12:' + (pressureChange12) + ' ';

      var forecast = getForecast(node._id, pressureChange1, pressureChange6);
      fakeSerialMsg += 'Forecast:' + (forecast) + ' ';

      // console.info('Smart Meteo Metric :' + fakeSerialMsg);
      processSerialData(fakeSerialMsg);


    }
  }
};

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
    return "Error";
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
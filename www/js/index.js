function startApp() {
  var nodes = {};        //this holds the current nodes data
  var selectedNodeId;    //points to the selected node ID
  var selectedMetricKey; //points to the selected metric name of the selected node
  var motesDef;          //holds the definition of the motes (from server side metrics.js)
  var metricsDef;        //holds the definition of the metrics (from server side metrics.js)
  var eventsDef;
  var comfortTypesDef;
  var settingsDef;
  var settingsDefBindMap;
  var boundSettings;
  var showHiddenNodes = false, showRawSend = false;
  var selectedSchedulePeriod;
  var selectedScheduleDay = (new Date()).getDay();
  var socket = io();
  var serverTimeOffset = 0;
  $('#nodeList').hide();

  socket.emit('GETSERVERTIME');
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n); //http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844
  }

  function sortNodeListByOrderCSV(newOrderCSV) {
    var orderArray = newOrderCSV.split(',');
    $('#nodeList').find('li:not(:first)').sort(function (a, b) {
      return orderArray.indexOf($(a).attr('id')) - orderArray.indexOf($(b).attr('id'));
    }).appendTo('#nodeList');
  }

  function LOG(data) {
    $('#log').val(new Date().toLocaleTimeString() + ' : ' + data + '\n' + $('#log').val());
    if ($('#log').val().length > 10000) $('#log').val($('#log').val().slice(0, 10000));
  };

  socket.on('connect', function () {
    LOG('Connected!');
    $('#loadingSocket').html('<span style="color:#2d0">Connected!</span><br/><br/>Waiting for data..');
  });

  socket.on('disconnect', function () {
    $('#log').val(new Date().toLocaleTimeString() + ' : Disconnected!\n' + $('#log').val());
    $("#loader").show();
    $('#loadingSocket').html('Socket was <span style="color:red">disconnected.</span><br/><br/>Waiting for socket connection..');
    if ($.mobile.activePage.attr('id') != 'homepage')
      $.mobile.navigate('#homepage', { transition: 'slide' });
    $('#nodeList').hide();
  });

  socket.on('UPDATENODE', function (entry) {
    updateNode(entry);
    refreshNodeListUI();
  });

  socket.on('UPDATESMARTTERMOSTATSCHEDULE', function (entry) {
    updateNode(entry);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var tabsParent = $('#thermostatTabs').parent();
    $('#thermostatTabs').remove();
    var tabs = $('<div/>', { 'data-role': "tabs", 'id': "thermostatTabs" }).appendTo(tabsParent);
    var thNavBar = $('<div/>', { 'data-role': "navbar", 'id': "thermostatNavbar" }).appendTo(tabs);

    var thUl = $('<ul/>', { 'id': "thermostatScheduleWeekDays" }).appendTo(thNavBar);

    for (var day in entry.thermostatSchedule) {
      var thLi = $('<li/>', { class: "tab" }).appendTo(thUl);
      var thLiA = $('<a/>', { 'href': "#day" + day, text: days[day], 'scheduled-day': day }).appendTo(thLi);
      thLiA.addClass('scheduleday');
      var thTab = $('<div/>', { 'id': "day" + day }).appendTo(tabs);
      var thTabUl = $('<ul/>', { 'data-role': "listview", 'data-inset': "true", 'id': "listview" + day }).appendTo(thTab);
      var thTabUlDivider = $('<li/>', { 'data-role': "divider", 'id': "listDivider" + day }).appendTo(thTabUl);
      var thDividerH = $('<h2/>', { 'text': days[day] + ' Schedule' }).appendTo(thTabUlDivider);
      //var thDividerAdd =  $('<a/>', {'href':"#thermostatScheduleDetatils", 'data-role':"button", 'data-inline':"true", 'data-icon':"plus", 'data-iconpos':"notext", 'data-mini':"true", 'title':"Add new schedule" }).appendTo(thTabUlDivider); 
      var thDividerAddContainer = $('<div/>').appendTo(thTabUlDivider);
      thDividerAddContainer.addClass("ui-li-count ui-body-inherit");
      var thDividerAdd = $('<a/>', { 'href': "#thermostatScheduleDetails", 'data-role': "button", 'data-inline': "true", 'data-icon': "plus", 'data-iconpos': "notext", 'data-mini': "true", 'title': "Add new schedule" }).appendTo(thDividerAddContainer);
      thDividerAdd.addClass("newschedule");
      for (var schedule in entry.thermostatSchedule[day]) {
        var comfortType = getComfortType(entry.thermostatSchedule[day][schedule].comfortType);

        var thTabLi = $('<li/>').appendTo(thTabUl);
        var thASchedule = $('<a/>', { 'href': "#thermostatScheduleDetails", 'scheduled-period': schedule }).appendTo(thTabLi);
        thASchedule.addClass('scheduledetails');
        var thComfortTypeImage = $('<img/>', { 'src': "images/" + comfortType.icon, }).appendTo(thASchedule);
        var thStartHour = $('<div/>', { 'id': "thStartHour" + day + schedule, 'style': "float:right;" }).appendTo(thASchedule);
        thStartHour.text(entry.thermostatSchedule[day][schedule].startTime);
        var thConfortType = $('<div/>', { 'text': comfortType.label }).appendTo(thASchedule);
        var thConfortTypeTemperatures = $('<div/>').appendTo(thASchedule); //newBtn.addClass('ui-icon-' + state.icon);
        var thSpanHeat = $('<span/>', { 'data-icon': comfortType.heat.icon, 'style': "color:#ff1100; border-style: hidden;background-color: transparent" }).appendTo(thConfortTypeTemperatures);
        thSpanHeat.addClass('ui-btn ui-btn-inline ui-btn-icon-left ui-icon-' + comfortType.heat.icon);
        thSpanHeat.text(comfortType.heat.temperature + "°");

        var thSpanCool = $('<span/>', { 'data-icon': comfortType.cool.icon, 'text': comfortType.cool.temperature + "°", 'style': "color:#0077ff; border-style: hidden;background-color: transparent;" }).appendTo(thConfortTypeTemperatures);
        thSpanCool.addClass('ui-btn ui-btn-inline ui-btn-icon-left ui-icon-' + comfortType.cool.icon);
        var thAOption = $('<a/>', {
          'href': "#schedule-option-popup",
          'title': "Schedule Options",
          'scheduled-period': schedule,
          'data-role': "button", 'data-icon': "action",
          'data-iconpos': "notext", 'data-rel': "popup",
          'data-position-to': "window",
          'data-transition': "pop"
        }).appendTo(thTabLi);
        thAOption.addClass('scheduledetails');
      }
      thTabUl.listview().listview('refresh');
      $('#listview' + day).listview('refresh');
    }
    // thUl.listview().listview('refresh');
    //  $('#thermostatScheduleWeekDays').listview('refresh');

    tabsParent.enhanceWithin();
    tabs.tabs({ active: selectedScheduleDay });

    //$('#thermostatSchedulePage').trigger('pagecreate');
    //$('#thermostatScheduleWeekDays').trigger('create');
    $.mobile.changePage('#thermostatSchedulePage', { transition: 'slide' });
    //alert(JSON.stringify(entry));
  });

  socket.on('UPDATENODES', function (entries) {
    $("#loader").hide();
    $("#nodeList").empty();
    $('#nodeList').append('<li id="uldivider" data-role="divider"><h2>Nodes</h2><span class="ui-li-count ui-li-count16">Count: 0</span></li>');
    $('#nodeList').show();
    for (var i = 0; i < entries.length; ++i)
      updateNode(entries[i]);
    refreshNodeListUI();
    if ($.mobile.activePage.attr('id') != 'homepage')
      $.mobile.navigate('#homepage', { transition: 'slide' });
  });

  socket.on('MOTESDEF', function (motesDefinition) {
    motesDef = motesDefinition;
    $("#nodeMoteType").empty();
    $('#nodeMoteType').append('<option value="">Select type...</option>');
    for (var mote in motesDef)
      $('#nodeMoteType').append('<option value="' + mote + '">' + motesDef[mote].label || mote + '</option>');
    $("#nodeMoteType").selectmenu();
  });

  socket.on('COMFORTTYPESDEF', function (comfortTypesDefinition) {
    comfortTypesDef = comfortTypesDefinition;
    $("#addComfortType").empty();
    $('#addComfortType').append('<option value="">Select type...</option>');
    for (var key in comfortTypesDef)
      $('#addComfortType').append('<option value="' + key + '">' + (comfortTypesDef[key].label || key) + '</option>');
    $("#addComfortType").selectmenu();

    $('#addComfortType').change(function () {
      if ($(this).val()) {
        $('#addComfortTypeDescr').html('<span style="color:#fff">Action: </span> ' + (comfortTypesDef[$(this).val()].label || ''));
        $('#addSchedule_OK').show();
      }
      else {
        $('#addComfortTypeDescr').html(' ');
        $('#addSchedule_OK').hide();
      }
    });
  });

  socket.on('METRICSDEF', function (metricsDefinition) {
    metricsDef = metricsDefinition;
  });

  socket.on('EVENTSDEF', function (eventsDefinition) {
    eventsDef = eventsDefinition;
    $('#addEventType').change(function () {
      if ($(this).val()) {
        $('#addEventDescr').html('<span style="color:#000">Action: </span>' + (eventsDef[$(this).val()].icon ? '<span class="ui-btn-icon-notext ui-icon-' + eventsDef[$(this).val()].icon + '" style="position:relative;float:left"></span>' : '') + (eventsDef[$(this).val()].descr || key));
        $('#addEvent_OK').show();
      }
      else {
        $('#addEventDescr').html(' ');
        $('#addEvent_OK').hide();
      }
    });
  });

  socket.on('SETTINGSDEF', function (newSettingsDef) {
    settingsDef = newSettingsDef;
    $('#settingsList').empty();
    settingsDefBindMap = {};
    for (var sectionName in settingsDef) {
      var sectionSettings = settingsDef[sectionName];
      if (!sectionSettings.exposed) continue;
      var sectionLI = $('<li data-role="list-divider">' + sectionName + '</li>');
      $('#settingsList').append(sectionLI);

      for (var settingName in sectionSettings) {
        var setting = sectionSettings[settingName];
        if (setting.exposed === false) continue;
        if (setting.value == undefined) continue;

        var settingLI; //ORIGINAL WITHOUT DESCR TOOLTIPS - var settingLI = $('<li class="ui-field-contain"><label for="'+sectionName+'-'+settingName+'">'+settingName+':</label><input '+(setting.password?'type="password"':'type="text"')+' name="'+sectionName+'-'+settingName+'" id="'+sectionName+'-'+settingName+'" value="'+setting.value+'" data-clear-btn="true"'+(setting.editable===false?' disabled="disabled"':'')+'></li>');
        if (setting.description) {
          settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">'
            + '<a href="#popupInfo-' + sectionName + '-' + settingName + '" data-rel="popup" data-transition="pop">' + settingName + '</a>'
            + '<div id="popupInfo-' + sectionName + '-' + settingName + '" data-role="popup" data-overlay-theme="b" class="popupInfo"><b>'
            + settingName + '</b>: ' + setting.description
            + '</div>'
            + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');
        }
        else
          settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">' + settingName + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');

        settingsDefBindMap[sectionName + '.' + settingName + '.value'] = '#' + sectionName + '-' + settingName;
        $('#settingsList').append(settingLI);
      }
    }

    $('#settingsList').listview().listview('refresh').trigger("create");
    boundSettings = Bind(settingsDef, settingsDefBindMap);
  });

  $("#settingsSave").click(function () {
    socket.emit('UPDATESETTINGSDEF', boundSettings);
    $.mobile.navigate('#homepage', { transition: 'fade' });
  });

  socket.on('NODELISTREORDER', function (orderCSV) {
    sortNodeListByOrderCSV(orderCSV);
  });

  socket.on('SERVERTIME', function (serverMillisSinceEpoch) {
    serverTimeOffset = Date.now() - serverMillisSinceEpoch;
    LOG('SERVERTIME OFFSET: ' + serverTimeOffset + 'ms');
  });

  socket.on('SERVERSTARTTIME', function (serverMillisSinceProcessStart) {
    $('#status-uptime').attr('data-time', serverMillisSinceProcessStart + serverTimeOffset);
  });

  socket.on('UPDATETIME', function (curentTime) {
    $(".datetime").each(function () {

      //d+'';                  // "Sun Dec 08 2013 18:55:38 GMT+0100"
      //d.toDateString();      // "Sun Dec 08 2013"
      //d.toISOString();       // "2013-12-08T17:55:38.130Z"
      //d.toLocaleDateString() // "8/12/2013" on my system
      //d.toLocaleString()     // "8/12/2013 18.55.38" on my system
      //d.toUTCString()  
      var d = new Date(curentTime);
      var options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
      $(this).html(d.toLocaleString('ro-RO', options));
    });
  });

  $(document).on("pagecreate", "#eventAdd", function () { if ($('addEventType').val()) $('#addEvent_OK').show(); else $('#addEvent_OK').hide(); });
  $(document).on("pagecreate", "#scheduleAdd", function () { if ($('addComfortType').val()) $('#addSchedule_OK').show(); else $('#addSchedule_OK').hide(); });

  socket.on('LOG', function (data) {
    LOG(data);
  });

  socket.on('PLAYSOUND', function (soundFile) {
    new Audio(soundFile).play();
  });

  graphData = [];
  metricGraphWrapper = $('#metricGraphWrapper');
  metricGraph = $('#metricGraph');
  var plot;
  var graphOptions;
  var graphFrozen;

  function renderPlot() {
    metricGraphWrapper.show();
    $("div[ui-role='loadinggraph']").hide();
    metricGraph.width(metricGraphWrapper.width()).height(metricGraphWrapper.height() - $('#graphControls').height()); //this assumes the 'pageshow' page event already happened, otherwise will fail to set the width correctly and should be moved in that event
    plot = $.plot(metricGraph, [{ label: graphOptions.legendLbl, data: graphData }], graphOptions);

    //graph value tooltips
    metricGraph.bind("plothover", function (event, pos, item) {
      if (item) {
        var date = new Date(item.datapoint[0]);

        for (var mkey in metricsDef) {
          if (metricsDef[mkey].name == graphOptions.metricName) {
            //The displayed value of a metric on the graph can get it's value from the following places, from lowest to highest priority:
            // - actual raw value stored in the log
            // - metricDef.logValue
            // - metricDef.value
            // - metricDef.valOverride
            // - metricDef.value='' and metricDef.logValue='' are special - they capture the first regex match group of the raw metric (or whole match if no groups specified with regex capturing parentheses)
            // - a specific metricDef.logValue that matches the value in the log takes priority over anything else
            if (metricsDef[mkey].value === '' || metricsDef[mkey].logValue === '' || metricsDef[mkey].logValue === item.datapoint[1]) {
              item.unit = metricsDef[mkey].unit || item.unit;
              item.graphValPrefix = metricsDef[mkey].graphValPrefix != undefined ? metricsDef[mkey].graphValPrefix : item.graphValPrefix;
              item.graphValSuffix = metricsDef[mkey].graphValSuffix != undefined ? metricsDef[mkey].graphValSuffix : item.graphValSuffix;
              item.valOverride = metricsDef[mkey].valOverride || (metricsDef[mkey].value === '' ? item.datapoint[1] : metricsDef[mkey].value) || (metricsDef[mkey].logValue === '' ? item.datapoint[1] : metricsDef[mkey].logValue) || item.valOverride;
              if (metricsDef[mkey].logValue === item.datapoint[1]) break;
            }
          }
        }

        var val = date.format("mmm-d, ") + '<b>' + date.format('h:MM') + '</b>' + date.format('tt') + '<br/><b>' + (item.graphValPrefix || '') + (item.valOverride || item.datapoint[1]/*.toFixed(2)*/) + '</b>' + (item.unit || '') + (item.graphValSuffix || '');
        $("#tooltip").html(val)
          .css({ top: item.pageY - 40, left: item.pageX + 7 })
          .fadeIn(200);
      } else
        $("#tooltip").hide();
    });

    $(document).off("pageshow", "#metricdetails", renderAndCloneStat);
  }

  function refreshGraph(freezeGraph) {
    graphData = [];
    graphFrozen = freezeGraph || false;
    graphOptions = {
      lines: { show: true, steps: true, fill: true },
      xaxis: { mode: "time", timezone: "browser", min: graphView.start, max: graphView.end },
      yaxis: { min: null, max: null, autoscaleMargin: 0.05 },
      grid: { hoverable: true, clickable: true, backgroundColor: { colors: ['#000', '#666'] } },
      selection: { mode: "x" },
      //series: { colors: [{ opacity: 0.8 }, { brightness: 0.6, opacity: 0.8 } ]},
      //bars: { show: true, lineWidth: 0, fill: true, fillColor: { colors: [ { opacity: 0.8 }, { opacity: 0.1 } ] } },
      //points: { show: true, radius: 2 },
      //{series: { points: { show: true, radius: 2 } }, grid: { hoverable: true }}
    };

    //ask socket for the data
    socket.emit('GETGRAPHDATA', selectedNodeId, selectedMetricKey, graphView.start, graphView.end);
  }

  function exportGraph() {
    socket.emit('GETGRAPHDATA', selectedNodeId, selectedMetricKey, graphView.start, graphView.end, true);
  }

  function renderAndCloneStat() {
    renderPlot();
    $(graphStat).clone().appendTo('#metricGraph');
  }

  socket.on('EXPORTDATAREADY', function (rawData) {
    //package and stream the data to the browser
    graphData = [];
    var csv = 'data:text/csv;charset=utf-8,unix_timestamp(ms),excel_timestamp,' + rawData.options.legendLbl + '\n';

    rawData.graphData.data.forEach(function (logItem, index) {
      dataString = logItem.t + ',' + (logItem.t / (1000 * 60 * 60 * 24) + 25569) + ',' + logItem.v;
      csv += index < rawData.graphData.data.length ? dataString + '\n' : dataString;
    });

    var encodedUri = encodeURI(csv);
    var link = document.createElement('a');
    link.setAttribute('id', 'exportLink');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', selectedNodeId + '_' + rawData.options.legendLbl + '.csv');
    document.body.appendChild(link); // Required for FF
    link.click(); //make it stream to the browser
    $('#exportLink').remove();
  });

  socket.on('EXPORTNODELOGSCSVREADY', function (rawData) {
    var sets = rawData;
    var csv = 'data:text/csv;charset=utf-8,unix_timestamp(ms),excel_timestamp'; //header start

    var mergedData = {};
    var setCount = 0;

    rawData.sets.forEach(function (set, setIndex) {
      set.data.forEach(function (point, index) {
        var nullPaddedArray = []; //left padding
        var i = 0;
        while (i++ < setIndex) nullPaddedArray.push(null);
        (mergedData[point.t] = mergedData[point.t] || nullPaddedArray).push(point.v);
      });
      Object.keys(mergedData).forEach(function (key) {
        if (mergedData[key].length - 1 < setIndex) mergedData[key].push(null); //right padding
      });
      csv += ',' + set.label;
    });
    csv += '\n'; //header end

    Object.keys(mergedData).forEach(function (key) {
      csv += key;
      csv += ',' + (key / (1000 * 60 * 60 * 24) + 25569);
      for (var i = 0; i < mergedData[key].length; i++)
        csv += ',' + (mergedData[key][i] || '');
      csv += '\n';
    });

    var encodedUri = encodeURI(csv);
    var link = document.createElement('a');
    link.setAttribute('id', 'exportLink');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', selectedNodeId + '_' + nodes[selectedNodeId].descr + '.csv');
    document.body.appendChild(link); // Required for FF
    link.click(); //make it stream to the browser
    $('#exportLink').remove();
  });

  socket.on('GRAPHDATAREADY', function (rawData) {
    graphData = [];
    var max = Number.NEGATIVE_INFINITY;
    var min = Number.POSITIVE_INFINITY;
    var minmax = 0;

    for (var key in rawData.graphData.data) {
      graphData.push([rawData.graphData.data[key].t, rawData.graphData.data[key].v]); //build flot series from raw data
      max = Math.max(max, rawData.graphData.data[key].v);
      min = Math.min(min, rawData.graphData.data[key].v);
    }

    //override autoscaleMargin and min/max from metrics graphOptions (if any defined); allows custom Y scaling of graphs
    if (rawData.options.yaxis) graphOptions.yaxis.autoscaleMargin = rawData.options.yaxis.autoscaleMargin || graphOptions.yaxis.autoscaleMargin;
    if (rawData.options.yaxis) min = rawData.options.yaxis.min != undefined ? rawData.options.yaxis.min : min;
    if (rawData.options.yaxis) max = rawData.options.yaxis.max != undefined ? rawData.options.yaxis.max : max;

    //defining the upper and lower margin
    minmax = (max - min) * graphOptions.yaxis.autoscaleMargin;
    if (min == max)  // in case of only one value in the dataset (motion detection)
      minmax = graphOptions.yaxis.autoscaleMargin * min;
    min -= minmax;
    max += minmax;
    graphOptions.xaxis.min = graphView.start;
    graphOptions.xaxis.max = graphView.end;
    graphOptions.yaxis.min = min;
    graphOptions.yaxis.max = max;

    graphOptions = $.extend(true, graphOptions, rawData.options); //http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
    $(graphStat).html(rawData.graphData.msg != undefined ? rawData.graphData.msg : (rawData.graphData.data.length + (rawData.graphData.totalIntervalDatapoints != rawData.graphData.data.length ? ' / ' + rawData.graphData.totalIntervalDatapoints : '') + 'pts (' + rawData.graphData.queryTime + 'ms) (' + humanFileSize(rawData.graphData.totalIntervalDatapoints * 9) + '/' + humanFileSize(rawData.graphData.logSize) + ')'));
    //need to defer plotting until after pageshow is finished rendering, otherwise the wrapper will return an incorrect width of "100"
    if (metricGraphWrapper.width() == 100)
      $(document).on("pageshow", "#metricdetails", renderAndCloneStat);
    else {
      renderAndCloneStat()
    }
  });

  $(window).resize(function () {
    if ($.mobile.activePage.attr('id') == 'metricdetails' && nodes[selectedNodeId].metrics[selectedMetricKey].graph && metricGraph.is(':visible')) {
      metricGraph.width(metricGraphWrapper.width());
      graphOptions.xaxis.min = graphView.start;
      graphOptions.xaxis.max = graphView.end;
      $.plot(metricGraph, [{ label: graphOptions.legendLbl, data: graphData }], graphOptions);
      $(graphStat).clone().appendTo('#metricGraph');
    }
  });

  $(window).on("navigate", function (event, data) { $("#tooltip").hide(); }); //hide graph tooltip on any navigation

  $("#graphZoomIn").click(function () { graphView.zoomin(); refreshGraph(true); });
  $("#graphZoomOut").click(function () { graphView.zoomout(); refreshGraph(true); });
  $('#graphPanRight').click(function () { graphView.panright(); refreshGraph(true); });
  $('#graphPanLeft').click(function () { graphView.panleft(); refreshGraph(true); });
  //$('#graphReset').click(function () {graphView.resetDomain(); refreshGraph();});
  $('#graphExport').click(function (e) { e.preventDefault(); exportGraph(); });
  $('.graphControl').click(function () { graphView.setDomain($(this).attr("hours")); refreshGraph(); });
  metricGraph.bind("plotselected", function (event, ranges) {
    graphView.start = ranges.xaxis.from;
    graphView.end = ranges.xaxis.to;
    refreshGraph(true);
  });

  function addGraphDataPoint(point) {
    if (graphFrozen) return;

    //shift visible timeline
    graphOptions.xaxis.min = graphView.start = point[0] - (graphView.end - graphView.start); //calculate new min
    graphOptions.xaxis.max = graphView.end = point[0];

    graphData.push(point); //add new data point

    //remove points that are invisible after shifting the visible timeline
    var i = 0;
    while (graphData[i]) {
      if (graphData[i++][0] < graphView.start)
        graphData.shift();
    }

    //plot = $.plot(metricGraph, [graphData], graphOptions);
    $.plot(metricGraph, [{ label: graphOptions.legendLbl, data: graphData }], graphOptions);
    //redraw alternative:
    //plot.setData([graphData]);
    //plot.setupGrid(); //only necessary if your new data will change the axes or grid
    //plot.draw();
    $(graphStat).clone().appendTo('#metricGraph');
  }

  /// resolves any metrics in the label or description of a node
  function nodeResolveString(theString, metrics) {
    for (var key in metrics) {
      if (/\{.+\}/ig.test(theString) == false) return theString; //if string has no more "{...}" just return it
      metric = metrics[key];
      theString = theString.replace('{' + metric.label + '}', metricsValues({ 0: metric }, true));
      theString = theString.replace('{' + metric.label + ':updated}', ago(metric.updated).tag);
    }
    return theString;
  }

  function metricsValues(metrics, ignorePin) {
    if (ignorePin === undefined) ignorePin = false; //default param
    var label = '';
    var metric;
    for (var key in metrics) {
      metric = metrics[key];
      if (metric.pin == '1' || metrics.length == 1 || ignorePin) {
        var agoText = ago(metric.updated).text;
        //metric.value + (metric.unit || '')
        var metricValue = (metric.unit) ? (metric.value + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
        label += '<span data-time="' + metric.updated + '" class="nodeMetricAgo" style="color:' + ago(metric.updated).color + '" title="' + agoText + '">' + metricValue + '</span> ';
      }
    }
    label = label.trim();
    return label;
  }

  function getNodeIcon(node) {
    if (motesDef != undefined && node.type != undefined && motesDef[node.type] != undefined)
      return motesDef[node.type].icon || 'icon_default.png';
    return 'icon_default.png';
  };

  function getComfortTypeIcon(comfortType) {
    if (comfortTypesDef != undefined && comfortType != undefined && comfortTypesDef[comfortType] != undefined)
      return comfortTypesDef[comfortType].icon || 'icon_default.png';
    return 'icon_default.png';
  };
  function getComfortType(comfortType) {
    if (comfortTypesDef != undefined && comfortType != undefined && comfortTypesDef[comfortType] != undefined)
      return comfortTypesDef[comfortType] || new Object();
    return new Object();
  };


  function resolveRSSIImage(rssi) {
    if (rssi == undefined) return '';
    var img;
    //if (Math.abs(rssi) > 95) img = 'icon_rssi_7.png';
    //else if (Math.abs(rssi) > 90) img = 'icon_rssi_6.png';
    //else if (Math.abs(rssi) > 85) img = 'icon_rssi_5.png';
    //else if (Math.abs(rssi) > 80) img = 'icon_rssi_4.png';
    //else if (Math.abs(rssi) > 75) img = 'icon_rssi_3.png';
    //else if (Math.abs(rssi) > 70) img = 'icon_rssi_2.png';
    //else img = 'icon_rssi_1.png';
    //return '<img class="listIcon20px" src="images/'+img+'" title="RSSI:-'+Math.abs(rssi)+'" /> ';

    if (Math.abs(rssi) > 95) img = 'appbar.connection.quality.veryhigh.svg';
    else if (Math.abs(rssi) > 90) img = 'appbar.connection.quality.high.svg';
    else if (Math.abs(rssi) > 85) img = 'appbar.connection.quality.medium.svg';
    else if (Math.abs(rssi) > 80) img = 'appbar.connection.quality.low.svg';
    else if (Math.abs(rssi) > 75) img = 'appbar.connection.quality.verylow.svg';
    else if (Math.abs(rssi) > 70) img = 'appbar.connection.quality.extremelylow.svg';
    else img = 'appbar.connection.quality.extremelylow.svg';
    var image = $('<img/>',
      {
        'class': "listIcon20px"
        , 'src': "images/" + img
        , 'title': "RSSI:" + Math.abs(rssi)
        //,style: "display:block;float:right;"
        //,style: "position:absolute;left:0;bottom:0;"
      });
    return image.prop('outerHTML');
    // return '<img class="listIcon20px svg" src="images/' + img + '" title="RSSI:-' + Math.abs(rssi) + '" style="display:block;float:right;"/> ';

  }

  function resolveBatteryImage(voltage) {

    var img;
    var minVoltage = 3.35;
    if (voltage < 3.55) img = "appbar.battery.0.svg";
    else if (voltage < 3.85) img = "appbar.battery.1.svg";
    else if (voltage < 4.15) img = "appbar.battery.2.svg";
    else if (voltage < 4.9) img = "appbar.battery.3.svg";
    else img = "appbar.battery.chargging.svg";
    var lobat = voltage < minVoltage ? ' blink' : '';
    var image = $('<img/>',
      {
        'class': "listIcon20px"
        , 'src': "images/" + img
        , 'title': "Battery:" + Math.abs(voltage)
        //,style: "position:absolute;left:0;bottom:0;"
      });
    return image.prop('outerHTML');
    // return '<img class="listIcon20px svg' + lobat + '" src="images/' + img + '" title="Battery:' + Math.abs(voltage) + '" style="display:block;float:right;"/> ';

  }

  function updateNode(node) {
    LOG(JSON.stringify(node));
    if (isNumeric(node._id)) {
      nodes[node._id] = node;
      // if (node._id == 300)
      //   console.log('Climate Control: ' + JSON.stringify(node));
      var nodeValue = metricsValues(node.metrics);
      var lowBat = node.metrics != null ? node.metrics.V != null : false //&& node.metrics.V.value < 3.55 : false;
      var newLI = $('<li id="' + node._id + '"><a node-id="' + node._id + '" href="#nodedetails" class="nodedetails"><img class="productimg" src="images/' + getNodeIcon(node) + '"><h2>' + (nodeResolveString(node.label, node.metrics) || node._id) + ' ' +

        ago(node.updated, 0).tag + (node.hidden ? ' <img class="listIcon20px" src="images/appbar.eye.hide.svg" />' : '') + '</h2><p>' +
        (nodeResolveString(node.descr, node.metrics) || '&nbsp;') + '</p>' +
        (nodeValue ? '<span class="ui-li-count ui-li-count16">' + nodeValue + '</span>' : '') +
        resolveRSSIImage(node.rssi) + ' ' +
        (lowBat ? resolveBatteryImage(node.metrics.V.value) : '') +
        '</a></li>');
      var existingNode = $('#nodeList li#' + node._id);
      if (node.hidden)
        if (showHiddenNodes)
          newLI.addClass('hiddenNodeShow');
        else
          newLI.addClass('hiddenNode');
      if (existingNode.length)
        existingNode.replaceWith(newLI);
      else $('#nodeList').append(newLI);
      if (node._id == selectedNodeId) refreshNodeDetails(node);
    }
  }

  function refreshNodeListUI() {
    var hiddenCount = $('.hiddenNode, .hiddenNodeShow').length;
    $('#uldivider span').html('Count: ' + ($('#nodeList li:not(#uldivider)').length) + (hiddenCount > 0 ? ', ' + hiddenCount + ' hidden' : ''));
    if (hiddenCount > 0)
      $('#btnHiddenNodesToggle').show();
    else {
      showHiddenNodes = false;
      $('#btnHiddenNodesToggle').css('background-color', '').hide();
    }

    //default jquery sortable - will only work in desktop browsers but is the best and most consistent (+ it's jquery native)
    $('#nodeList').sortable({
      items: 'li:not(:first)',
      containment: 'parent',
      opacity: 0.5,
      delay: 200,
      scroll: true,
      update: function (event, ui) {
        var listIds = [];
        var items = $('#nodeList li:not(:first)');
        for (var i = 0; typeof (items[i]) != 'undefined'; listIds.push(items[i++].getAttribute('id')));
        socket.emit('UPDATENODELISTORDER', listIds.join(','));
      },
    });

    $('#nodeList').listview('refresh'); //re-render the listview
  }

  /// http://stackoverflow.com/a/20732091
  function humanFileSize(size) {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  };

  /// calculated a style for an "ago" label based on a given timestamp in the past
  function ago(time, agoPrefix) {
    agoPrefix = (typeof agoPrefix !== 'undefined') ? agoPrefix : true;
    var now = new Date().getTime() - serverTimeOffset;
    var update = new Date(time).getTime();
    var lastupdate = (now - update) / 1000;
    var s = (now - update) / 1000;
    var m = s / 60;
    var h = s / 3600;
    var d = s / 86400;
    var updated = s.toFixed(0) + 's';
    if (s < 6) updated = 'now';
    if (s >= 60) updated = m.toFixed(0) + 'm';
    if (h >= 2) updated = h.toFixed(0) + 'h';
    if (h >= 24) updated = Math.floor(d) + 'd' + ((s % 86400) / 3600).toFixed(0) + 'h'; //2d3h = two days and 3 hours ago (51hrs)
    var theColor = 'ff8800'; //dark orange //"rgb(255,125,20)";
    if (s < 6) theColor = "00ff00"; //dark green
    if (s < 30) theColor = "33cc33"; //green
    else if (s < 60) theColor = 'ffcc00'; //light orange
    if (h >= 3) theColor = 'ff0000'; //red
    theColor = '#' + theColor;
    updated = updated + (agoPrefix && updated !== 'now' ? ' ago' : '');
    return { text: updated, color: theColor, tag: '<span data-time="' + time + '" class="nodeAgo" style="color:' + theColor + ';">' + updated + '</span>' };
  }

  /// updates the "ago" labels text and color according the to elapsed time since the last update timestamp associated with those labels
  function updateAgos() {
    $("span.nodeAgo").each(function () {
      var timestamp = parseInt($(this).attr('data-time'));
      var agoResult = ago(timestamp, false);
      $(this).css('color', agoResult.color);
      $(this).html(agoResult.text);
    });

    $("span.nodeMetricAgo").each(function () {
      var timestamp = parseInt($(this).attr('data-time'));
      var agoResult = ago(timestamp);
      $(this).css('color', agoResult.color);
      $(this).prop('title', agoResult.text);
    });
  }

  //refresh "updated X ago" indicators
  var updateAgosTimer = setInterval(updateAgos, 3000);

  $("#btnSearch").click("tap", function (event) {
    if ($("#searchBox").is(":visible")) {
      $("#searchBox").slideUp('fast');
      $("#btnSearch").css('background-color', '');
    }
    else {
      $("#searchBox").slideDown('fast');
      $("#btnSearch").css('background-color', '#9bffbe');
    }
    $("#nav-panel").popup("close");
  });

  $("#btnHiddenNodesToggle").click("tap", function (event) {
    if (showHiddenNodes) {
      $(".hiddenNodeShow").removeClass('hiddenNodeShow').addClass('hiddenNode');
      $('#btnHiddenNodesToggle').css('background-color', '');
      showHiddenNodes = false;
    }
    else {
      $(".hiddenNode").removeClass('hiddenNode').addClass('hiddenNodeShow');
      $('#btnHiddenNodesToggle').css('background-color', '#ffcaca');
      showHiddenNodes = true;
    }
    $("#nav-panel").popup("close");
  });

  $("#btnHideNodeToggle").click("tap", function (event) {
    if ($("#btnHideNodeToggle").hasClass('hidden'))
      $("#btnHideNodeToggle").removeClass('hidden').css('background-color', '');
    else $("#btnHideNodeToggle").addClass('hidden').css('background-color', '#D00');;
  });

  $("#btnRawToggle").click("tap", function (event) {
    if ($(".rawAction").is(":visible")) {
      $(".rawAction").slideUp('fast');
      $("#btnRawToggle").removeClass('ui-btn-b');
    }
    else {
      $(".rawAction").slideDown('fast');
      $("#btnRawToggle").addClass('ui-btn-b');
    }
  });

  $("#beepBtn").click("tap", function (event) {
    socket.emit('GATEWAYMESSAGE', 'BEEP');
  });

  function refreshNodeDetails(node) {
    $('#nodeLabel').val(node.label || '');
    $('#nodeDetailTitle').html(nodeResolveString(node.label, node.metrics) || 'Node details');
    $('#nodeMoteType').val(node.type || '');
    $("#nodeMoteType").selectmenu('refresh', true);
    $('#nodeDescr').val(node.descr || '');
    $('#nodeDetailImage').attr('src', 'images/' + getNodeIcon(node));

    if (node.hidden) $("#btnHideNodeToggle").addClass('hidden').css('background-color', '#D00');
    else $("#btnHideNodeToggle").removeClass('hidden').css('background-color', '');;

    $('.nodeID').html(node._id);
    if (node.rssi) { $('#rssiinfo').show(); $('.nodeRSSI').html(node.rssi); $('.nodeRSSIImage').html(resolveRSSIImage(node.rssi)); }
    //      if (node.rssi) { $('#rssiinfo').show(); $('.nodeRSSI').html(node.rssi); }
    else $('#rssiinfo').hide();
    $('.nodeUpdated').html(ago(node.updated, false).tag);

    $('#metricList').empty();
    for (var key in node.metrics) {
      var metric = node.metrics[key];
      var metricValue = metricsValues([metric]);
      var newLI = $('<li id="' + key + '"><a metric-id="' + key + '" href="#metricdetails" class="metricdetails"><img class="ui-li-icon icon" src="images/' +
        (metric.pin == 1 ? 'appbar.pin.svg' : 'blank.png') + '" />' + metric.label + ' ' + (metric.graph == 1 ? '<img class="ui-li-icon icon" src="images/appbar.graph.bar.svg" /> ' : '') + ago(metric.updated, 0).tag + '<span class="ui-li-count ui-li-count16">' + metricValue + '</span></a></li>');
      $('#metricList').append(newLI);
      if (key == selectedMetricKey) {
        $('.metricUpdated').html(ago(metric.updated, 0).tag);
        $('#metricValue').val(metric.value + (metric.unit || ''));
        if (metric.graph) addGraphDataPoint([(new Date()).getTime() - serverTimeOffset, metric.value]);
      }
    }
    $('#metricList').listview().listview('refresh');

    //display events list
    $('#eventList').empty();
    for (var key in node.events) {
      var evt = eventsDef[key];
      var enabled = node.events[key];
      if (!evt) continue;
      var newLI = $('<li><a data-icon="delete" event-id="' + key + '" href="#" class="eventEnableDisable" style="padding-top:0;padding-bottom:0;padding-left:0"><span class="ui-btn-icon-notext ui-icon-' + (enabled ? (evt.icon ? evt.icon : 'action') : 'minus') + '" style="position:relative;float:left;padding:15px 10px;background-color:' + (enabled ? '#2d0' : '#d00') + '"></span><h2 style="padding-left:10px">' + evt.label + '</h2><p style="padding-left:10px">' + (evt.descr || '&nbsp;') + '</p>' + '</a><a event-id="' + key + '" href="#" class="eventDelete" data-transition="pop" data-icon="delete"></a></li>');
      var existingNode = $('#eventList li#evt_' + key);
      if (existingNode.length)
        existingNode.replaceWith(newLI);
      else $('#eventList').append(newLI);
    }
    $('#eventList').listview().listview('refresh');

    //handle node controls/buttons
    $('#nodeControls').hide();
    if (motesDef[node.type] && motesDef[node.type].controls) {
      var showControls = false;
      $('#nodeControls').empty();
      for (var cKey in motesDef[node.type].controls) {
        var control = motesDef[node.type].controls[cKey];
        if (control.showCondition) {
          var f = eval('(' + control.showCondition + ')'); //using eval is generally a bad idea but there is no way to pass functions in JSON via websockets so we pass them as strings instead
          if (!f(node)) continue;
        }

        for (var sKey in control.states) {
          var state = control.states[sKey];
          if (state.condition) {
            var f = eval('(' + state.condition + ')'); //using eval is generally a bad idea but there is no way to pass functions in JSON via websockets so we pass them as strings instead
            if (!f(node)) continue;
          }
          var newBtn = $('<a href="#" data-role="button" class="ui-btn ui-btn-inline ui-shadow ui-corner-all">' + state.label + '</a>');
          if (state.css) newBtn.attr('style', state.css);
          if (state.icon) {
            newBtn.addClass('ui-btn-icon-left');
            newBtn.addClass('ui-icon-' + state.icon);
          }

          newBtn.bind('click', { nodeId: node._id, action: state.action, nodeType: node.type, cKey: cKey, sKey: sKey }, function (event) {
            //alert(event.data.action + ' was clicked for node ' + event.data.nodeId);
            socket.emit("CONTROLCLICK", { nodeId: event.data.nodeId, action: event.data.action, nodeType: event.data.nodeType, controlKey: event.data.cKey, stateKey: event.data.sKey });
          });
          $('#nodeControls').append(newBtn); ////$('#nodeControls').controlgroup("container").append(newBtn);
          showControls = true;
          break;
        }

        if (control.breakAfter == true)
          $('#nodeControls').append('<br/>');
      }

      if (showControls) {
        //$('#nodeControls').controlgroup().controlgroup("refresh");
        //$('#nodeControls').controlgroup('refresh');
        $('#nodeControls').show();
        //$("#nodeControls").trigger('create');
      }
    }
  }

  function refreshMetricDetails(metric) {
    $('#metricDetailTitle').html(metric.label || 'Node details');
    $('.metricUpdated').html(ago(metric.updated, 0).tag);
    $('#metricValue').val(metric.value + (metric.unit || ''));
    $('#metricLabel').val(metric.label || '');

    if (metric.pin == '1')
      $("#btnPinMetric").addClass('pinned').css('background-color', '#38C');
    else $("#btnPinMetric").removeClass('pinned').css('background-color', '');

    graphData = [];
    metricGraphWrapper.hide();
    $("#btnGraphMetric").show();
    if (metric.graph == 1) {
      $("#btnGraphMetric").addClass('graphed').css('background-color', '#38C');
      $("div[ui-role='loadinggraph']").show();
      graphView.resetDomain();
      refreshGraph();
    }
    else if (metric.graph == 0) {
      $("#btnGraphMetric").removeClass('graphed').css('background-color', '');
      $("div[ui-role='loadinggraph']").hide();
    }
    else {
      $("#btnGraphMetric").hide();
      $("div[ui-role='loadinggraph']").hide();
    }
  }

  function refreshScheduleDetails(schedule) {
    $('#addComfortTypeDescr').html(' ');
    $('#addSchedule_OK').hide();
    // $("#addComfortType").empty();
    // $('#addComfortType').append('<option value="">Select type...</option>');
    // for (var key in comfortTypesDef)
    //   $('#addComfortType').append('<option value="' + key + '">' + (comfortTypesDef[key].label || key) + '</option>');

    if (schedule != null) {
      if (nodes[selectedNodeId].thermostatSchedule == null) {
        alert("missing schedule");
        return
      }
      if (schedule.schedulePeriod == null) {
        $("#scheduleHour").val('');
        $("#scheduleMinutes").val('');
        $("#addComfortType").val('');
        $("#addComfortType").selectmenu('refresh', true);
      }
      else {
        $("#addComfortType").val(nodes[selectedNodeId].thermostatSchedule[schedule.scheduleday][schedule.schedulePeriod].comfortType);
        var startTime = nodes[selectedNodeId].thermostatSchedule[schedule.scheduleday][schedule.schedulePeriod].startTime;
        var separatorPos = startTime.indexOf(":");
        $("#scheduleHour").val(startTime.substr(0, separatorPos));
        $("#scheduleMinutes").val(startTime.substr(separatorPos + 1, startTime.length))
        $('#addSchedule_OK').show();
        $("#addComfortType").selectmenu('refresh', true);
      }
    }
    //var comfortType = getComfortType(entry.thermostatSchedule[day][schedule].comfortType);
    $(document).on("pagebeforeshow", "#addSchedule", function (event) {
      $("#addComfortType").selectmenu('refresh');
      //$("#addComfortType").val('');
    });
  }

  $(document).on("click", ".nodedetails", function () {
    var nodeId = $(this).attr('node-id');
    selectedNodeId = parseInt(nodeId);
    var node = nodes[selectedNodeId];
    refreshNodeDetails(node);
  });

  $(document).on("click", ".metricdetails", function () {
    var metricKey = $(this).attr('metric-id');
    selectedMetricKey = metricKey;
    var metric = nodes[selectedNodeId].metrics[metricKey];
    refreshMetricDetails(metric);
  });

  $(document).on("click", ".scheduledetails", function () {
    var schedulePeriod = $(this).attr('scheduled-period');
    selectedSchedulePeriod = parseInt(schedulePeriod);
    // var node = nodes[selectedNodeId];
    refreshScheduleDetails({ 'scheduleday': selectedScheduleDay, 'schedulePeriod': selectedSchedulePeriod });
  });
  $(document).on("click", ".newschedule", function () {
    var schedulePeriod = $(this).attr('scheduled-period');
    selectedSchedulePeriod = null;
    // var node = nodes[selectedNodeId];
    refreshScheduleDetails({ 'scheduleday': selectedScheduleDay, 'schedulePeriod': selectedSchedulePeriod });
  });

  $(document).on("click", ".scheduleday", function () {
    var scheduleday = $(this).attr('scheduled-day');
    selectedScheduleDay = parseInt(scheduleday);
    // var node = nodes[selectedNodeId];
    // refreshNodeDetails(node);
  });
  $(document).on("click", ".eventEnableDisable", function () {
    var eventKey = $(this).attr('event-id');
    socket.emit('EDITNODEEVENT', selectedNodeId, eventKey, !nodes[selectedNodeId].events[eventKey]);
  });

  $(document).on("click", ".eventDelete", function () {
    var eventKey = $(this).attr('event-id');
    socket.emit('EDITNODEEVENT', selectedNodeId, eventKey, null, true);
  });

  $('#nodeLabel').keyup(function () { $('#nodeDetailTitle').html(nodeResolveString($('#nodeLabel').val(), nodes[selectedNodeId].metrics) || 'Node details'); });
  $('#metricLabel').keyup(function () { $('#metricDetailTitle').html($('#metricLabel').val() || 'no label'); });

  $("#btnPinMetric").click("tap", function (event) {
    if ($("#btnPinMetric").hasClass('pinned'))
      $("#btnPinMetric").removeClass('pinned').css('background-color', '');
    else $("#btnPinMetric").addClass('pinned').css('background-color', '#38C');;
  });

  $("#btnGraphMetric").click("tap", function (event) {
    if ($("#btnGraphMetric").hasClass('graphed')) {
      $("#btnGraphMetric").removeClass('graphed').css('background-color', '');
      metricGraphWrapper.hide();
    }
    else {
      $("#btnGraphMetric").addClass('graphed').css('background-color', '#38C');;
      if (graphData.length == 0) {
        $("div[ui-role='loadinggraph']").show();
        graphView.resetDomain();
        refreshGraph();
      }
      else metricGraphWrapper.show();
    }
  });

  $('#nodeMoteType').change(function () {
    var node = nodes[selectedNodeId];
    notifyUpdateNode();
    refreshNodeDetails(node);
  });

  function notifyUpdateNode() {
    var node = nodes[selectedNodeId];
    node.label = $('#nodeLabel').val();
    node.type = $('#nodeMoteType').val();
    node.descr = $('#nodeDescr').val();
    node.hidden = $("#btnHideNodeToggle").hasClass('hidden'); //only persist when it's hidden
    if (node.label.trim() == '' || node.label == motesDef[node.type])
      node.label = node.type ? motesDef[node.type].label : node.label;
    socket.emit('UPDATENODESETTINGS', nodes[selectedNodeId]);
  }

  $('#addNodeEvent').click("tap", function (event) {
    $('#addEventDescr').html(' ');
    $('#addEvent_OK').hide();
    $("#addEventType").empty();
    $('#addEventType').append('<option value="">Select type...</option>');
    for (var key in eventsDef)
      if (!nodes[selectedNodeId].events || !nodes[selectedNodeId].events[key])
        $('#addEventType').append('<option value="' + key + '">' + (eventsDef[key].label || key) + '</option>');

    $(document).on("pagebeforeshow", "#addEvent", function (event) {
      $("#addEventType").selectmenu('refresh');
      $("#addEventType").val('');
    });
  });

  $('#exportCSVDateRange_export').click("tap", function (event) {
    var start = $("#exportCSVDateRange_start").datepicker("getDate").getTime();
    var end = $("#exportCSVDateRange_end").datepicker("getDate").getTime();
    var points = $('#exportCSVDateRange_points').val();
    socket.emit('EXPORTNODELOGSCSV', selectedNodeId, start, end, points); //[unix epoch, end of time], how many points to return
  });

  $("#node_update").click("tap", function (event) {
    notifyUpdateNode();
    //updateNode(nodes[selectedNodeId]); //this will happen when node is sent back by server
    refreshNodeListUI();
  });

  $("#addEvent_OK").click("tap", function (event) {
    socket.emit('EDITNODEEVENT', selectedNodeId, $('#addEventType').val(), true);
  });

  $("#addSchedule_OK").click("tap", function (event) {
    socket.emit('EDITNODESCHEDULE', selectedNodeId, selectedScheduleDay, selectedSchedulePeriod, { startTime: $("#scheduleHour").val() + ":" + $("#scheduleMinutes").val(), comfortType: $('#addComfortType').val() }, false);
  });

  $("#deleteSchedule_yes").click("tap", function (event) {
    socket.emit('EDITNODESCHEDULE', selectedNodeId, selectedScheduleDay, selectedSchedulePeriod, null, true);
  });

  $("#metric_return,#event_return").click("tap", function (event) {
    var metric = nodes[selectedNodeId].metrics[selectedMetricKey];
    if (metric != undefined) {
      metric.label = $('#metricLabel').val();
      metric.pin = $('#btnPinMetric').hasClass('pinned') ? 1 : 0;
      if (metric.graph != undefined) metric.graph = $('#btnGraphMetric').hasClass('graphed') ? 1 : 0;
      socket.emit('UPDATEMETRICSETTINGS', selectedNodeId, selectedMetricKey, metric);
    }
  });

  $("#deleteNode_yes").click("tap", function (event) {
    nodes[selectedNodeId] = undefined;
    $('#nodeList li#' + selectedNodeId).remove();
    socket.emit('DELETENODE', selectedNodeId);
  });

  $("#deleteMetric_yes").click("tap", function (event) {
    nodes[selectedNodeId].metrics[selectedMetricKey] = undefined;
    $('#metricList li#' + selectedMetricKey).remove();
    socket.emit('DELETENODEMETRIC', selectedNodeId, selectedMetricKey);
  });

  $("#processExit_yes").click("tap", function (event) {
    socket.emit('PROCESSEXIT');
  });

  $("#piReboot_yes").click("tap", function (event) {
    socket.emit('PIREBOOT');
    // $.mobile.navigate('#homepage', { transition : 'fade'});
  });


  $("#clearbtn").click("tap", function (event) {
    $('#log').val('');
  });

  $("#rawActionTextspan").keypress(function (event) {
    if (event.which == 13) //if ENTER pressed in the message box .. then "click" the SEND button
    {
      $("#rawActionSend").click();
      return false;
    }
  });

  $("#rawActionSend").click("tap", function (event) {
    //LOG(JSON.stringify({nodeId:$("#rawActionID").val(), action:$("#rawActionText").val()}));
    var id = $("#rawActionID").val();
    var value = $("#rawActionText").val();
    switch (value.toLowerCase()) {
      case 'new':
        socket.emit("INJECTNODE", { nodeId: id, label: value });
        break;
      case 'cleansourcenodes':
        socket.emit("CLEANSOURCENODES", { nodeId: id });
        break;
      default:
        socket.emit("NODEMESSAGE", { nodeId: id, action: value });
        break;
    }
  });

  //enforce positive numeric input
  $("#rawActionID").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57) || $(this).val().length > 3) {
      event.preventDefault();
    }
    //max node ID is 255 with packet header defaults in RFM69 library
    if ($(this).val() > 255) $(this).val(255);
  });

  //graph value tooltips container
  $("<div id='tooltip'></div>").css({
    position: "absolute",
    display: "none",
    fontSize: "11px",
    border: "1px solid #fdd",
    'border-radius': '3px',
    padding: "2px",
    "background-color": "#fee",
    opacity: 0.80
  }).appendTo("body");

  //graph query statistics
  var graphStat = $("<span id='graphStat'></span>").css({
    position: "relative",
    top: "5px",
    right: "-45px",
    fontSize: "10px",
    color: '#00ff11',
    'font-weight': 'bold',
    'text-shadow': '0 1px 0 black',
  });

  $("#nav-panel").on({
    popupbeforeposition: function () {
      var h = $(window).height();
      $("#nav-panel").css("height", h);
    }
  });

  $("#nav-panel-close").click("tap", function (event) {
    $("#nav-panel").popup("close");
  });
}

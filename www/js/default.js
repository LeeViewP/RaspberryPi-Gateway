function startApp() {
  var nodes = {};        //this holds the current nodes data
  var selectedNodeId;    //points to the selected node ID
  var selectedMetricKey; //points to the selected metric name of the selected node
  var motesDef;          //holds the definition of the motes (from server side metrics.js)
  var metricsDef;        //holds the definition of the metrics (from server side metrics.js)
  var eventsDef;
  var comfortTypesDef;
  var notificationTypeDef;
  var notificationActionDef;
  var settingsDef;
  var settingsDefBindMap;
  var boundSettings;
  var showHiddenNodes = false, showRawSend = false;
  var selectedSchedulePeriod;
  var selectedScheduleDay = (new Date()).getDay();
  var socket = io();
  $('#nodeList').hide();

  String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };

  function LOG(data) {
    $('#log').val(new Date().toLocaleTimeString() + ' : ' + data + '\n' + $('#log').val());
    if ($('#log').val().length > 5000) $('#log').val($('#log').val().slice(0, 5000));
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
    // updateNode(entry);

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
      var thTabUl = $('<ul/>', { 'data-role': "listview", 'data-inset': "true", 'id':"listview"+day }).appendTo(thTab);
      var thTabUlDivider = $('<li/>', { 'data-role': "divider", 'id': "listDivider" + day }).appendTo(thTabUl);
      var thDividerH = $('<h2/>', { 'text': days[day] + ' Schedule' }).appendTo(thTabUlDivider);
      //var thDividerAdd =  $('<a/>', {'href':"#thermostatScheduleDetatils", 'data-role':"button", 'data-inline':"true", 'data-icon':"plus", 'data-iconpos':"notext", 'data-mini':"true", 'title':"Add new schedule" }).appendTo(thTabUlDivider); 
      var thDividerAddContainer = $('<div/>').appendTo(thTabUlDivider);
      thDividerAddContainer.addClass("ui-li-count ui-body-inherit");
      var thDividerAdd = $('<a/>', { 'href': "#thermostatScheduleDetatils", 'data-role': "button", 'data-inline': "true", 'data-icon': "plus", 'data-iconpos': "notext", 'data-mini': "true", 'title': "Add new schedule" }).appendTo(thDividerAddContainer);
      thDividerAdd.addClass("newschedule");
      for (var schedule in entry.thermostatSchedule[day]) {
        var comfortType = getComfortType(entry.thermostatSchedule[day][schedule].comfortType);

        var thTabLi = $('<li/>').appendTo(thTabUl);
        var thASchedule = $('<a/>', { 'href': "#thermostatScheduleDetatils", 'scheduled-period': schedule }).appendTo(thTabLi);
        thASchedule.addClass('scheduledetails');
        var thComfortTypeImage = $('<img/>', { 'src': "images/" + comfortType.icon, }).appendTo(thASchedule);
        var thStartHour = $('<div/>', { 'id': "thStartHour"+day+schedule, 'style': "float:right;" }).appendTo(thASchedule);
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
       $('#listview'+day).listview('refresh');
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
    $('#nodeList').append('<li id="uldivider" data-role="divider"><h2>Nodes</h2><span class="ui-li-count">Count: 0</span></li>');
    $('#nodeList').show();
    entries.sort(function (a, b) { if (a.label && b.label) return a.label < b.label ? -1 : 1; if (a.label) return -1; if (b.label) return 1; return a._id > b._id; });
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

  socket.on('NOTIFICATIONTYPEDEF', function (notificationTypeDefinition) {
    notificationTypeDef = notificationTypeDefinition;
    $('#addNotificationType').change(function () {
      if ($(this).val()) {
        var typeN = notificationTypeDef[$(this).val()];
        var actionFields = $('#addNotificationActionsFields')
        $('.removabletype').remove();
        Object.getOwnPropertyNames(typeN).forEach(function (val, idx, array) {
          if (val != 'label' && val != 'nextScheduleSTR') {
            $('<label/>', {
              'for': 'notification' + val + 'Label',
              'class': 'labelbold removabletype',
              'text': val.toProperCase() + ':',
            })
              .appendTo(actionFields);
            var containerDiv = $('<div/>', { 'class': 'ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset removabletype' }).appendTo(actionFields);
            $('<input/>', {
              'id': 'notification' + val + 'Label',
              'name': 'notification' + val + 'Label',
              'type': 'text',
              'placeholder': val + ' label',
              'value': typeN[val],
              'class': 'removabletype',
            })
              .appendTo(containerDiv);
          }
        });
        //$('#addEventDescr').html('<span style="color:#000">Action: </span>' + (eventsDef[$(this).val()].icon ? '<span class="ui-btn-icon-notext ui-icon-'+eventsDef[$(this).val()].icon+'" style="position:relative;float:left"></span>' : '') + (eventsDef[$(this).val()].descr || key));
        $('#addNotification_OK').show();
      }
      else {
        //$('#addEventDescr').html(' ');
        $('#addNotification_OK').hide();
      }
    });
  });

  socket.on('NOTIFICATIONACTIONSDEF', function (notificationActionsDefinition) {
    notificationActionDef = notificationActionsDefinition;
    $('#addNotificationAction').change(function () {
      if ($(this).val()) {
        var actionN = notificationActionDef[$(this).val()];
        $('#addNotificationActionIcon').html((actionN.icon ? '<span class="ui-btn-icon-notext ui-icon-' + actionN.icon + '" style="position:relative;float:left"></span>' : ''));
        var actionFields = $('#addNotificationActionsFields')
        $('.removableaction').remove();

        Object.getOwnPropertyNames(actionN).forEach(function (val, idx, array) {
          $('<label/>', {
            'for': 'notification' + val + 'Label',
            'class': 'labelbold removableaction',
            'text': val.toProperCase() + ':',
          })
            .appendTo(actionFields);
          var containerDiv = $('<div/>', { 'class': 'ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset removableaction' }).appendTo(actionFields);
          $('<input/>', {
            'id': 'notification' + val + 'Label',
            'name': 'notification' + val + 'Label',
            'type': 'text',
            'placeholder': val + ' label',
            'value': actionN[val],
            'class': 'removableaction',
          })
            .appendTo(containerDiv);

        });
        $('#addNotification_OK').show();
      }
      else {
        //$('#addEventDescr').html(' ');
        $('#addNotification_OK').hide();
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
        var settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">' + settingName + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');
        settingsDefBindMap[sectionName + '.' + settingName + '.value'] = '#' + sectionName + '-' + settingName;
        $('#settingsList').append(settingLI);
      }
    }

    $('#settingsList').listview().listview('refresh');
    boundSettings = Bind(settingsDef, settingsDefBindMap);
    $("#settingsSave").click(function () {
      socket.emit('UPDATESETTINGSDEF', boundSettings);
      //$('#settingsList').empty();
      $.mobile.navigate('#homepage', { transition: 'fade' });
    });
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
  $(document).on("pagecreate", "#notificationAdd", function () { if ($('addNotificationType').val()) $('#addNotification_OK').show(); else $('#addNotification_OK').hide(); });
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

    $(document).off("pageshow", "#metricdetails", renderPlot);
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
    $('#graphStat').html(rawData.graphData.data.length + 'pts, ' + rawData.graphData.queryTime + 'ms');
    //need to defer plotting until after pageshow is finished rendering, otherwise the wrapper will return an incorrect width of "100"
    if (metricGraphWrapper.width() == 100)
      $(document).on("pageshow", "#metricdetails", renderPlot);
    else renderPlot();
  });

  $(window).resize(function () {
    if ($.mobile.activePage.attr('id') == 'metricdetails' && nodes[selectedNodeId].metrics[selectedMetricKey].graph && metricGraph.is(':visible')) {
      metricGraph.width(metricGraphWrapper.width());
      graphOptions.xaxis.min = graphView.start;
      graphOptions.xaxis.max = graphView.end;
      $.plot(metricGraph, [{ label: graphOptions.legendLbl, data: graphData }], graphOptions);
    }
  });

  $(window).on("navigate", function (event, data) { $("#tooltip").hide(); }); //hide graph tooltip on any navigation

  $("#graphZoomIn").click(function () { graphView.zoomin(); refreshGraph(true); });
  $("#graphZoomOut").click(function () { graphView.zoomout(); refreshGraph(true); });
  $('#graphPanRight').click(function () { graphView.panright(); refreshGraph(true); });
  $('#graphPanLeft').click(function () { graphView.panleft(); refreshGraph(true); });
  //$('#graphReset').click(function () {graphView.resetDomain(); refreshGraph();});
  $('.graphControl').click(function () { graphView.setDomain($(this).attr("hours")); refreshGraph(); });
  metricGraph.bind("plotselected", function (event, ranges) {
    graphView.start = ranges.xaxis.from;
    graphView.end = ranges.xaxis.to;
    refreshGraph(true);
  });

  function addGraphDataPoint(point) {
    if (graphFrozen) return;
    graphData.push(point);
    if (graphData.length > 10)
      graphData.shift(); //remove first point in graph
    graphOptions.xaxis.min = graphView.start = graphData[0][0];
    graphOptions.xaxis.max = graphView.end = graphData[graphData.length - 1][0];
    //plot = $.plot(metricGraph, [graphData], graphOptions);
    $.plot(metricGraph, [{ label: graphOptions.legendLbl, data: graphData }], graphOptions);
    //redraw alternative:
    //plot.setData([graphData]);
    //plot.setupGrid(); //only necessary if your new data will change the axes or grid
    //plot.draw();
  }

  function metricsValues(metrics) {
    var label = '';
    var metric;
    for (var key in metrics) {
      metric = metrics[key];
      if (metric.pin == '1' || metrics.length == 1) {
        var agoText = ago(metric.updated).text;
        //metric.value + (metric.unit || '') var metricValue = (metric.unit) ? ((metric.descr || metric.name || metric.label || '') + ': ' + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
        var metricValue = (metric.unit) ?
          ((metric.descr || metric.name || metric.label || '') + ': <span data-time="' + metric.updated + '" title = ' + agoText + ' class="nodeMetricAgo" style="float:right;font-weight:bold;">' + metric.value + (metric.unit || '') + '<span>') :
          ((metric.descr || metric.name || metric.label || '') + ' <span data-time="' + metric.updated + '"' + agoText + ' class="nodeMetricAgo" style="float:right;font-weight:bold;">' + metric.value + '<span>');
        label += '<p data-time="' + metric.updated + '" class="nodeMetricAgo" style="color:' + ago(metric.updated).color + '" title="' + agoText + '">' + metricValue + '</p> ';
      }
    }
    label = label.trim();
    return label;
  }
  function metricsValuesShort(metrics) {
    var label = '';
    var metric;
    for (var key in metrics) {
      metric = metrics[key];
      if (metric.pin == '1' || metrics.length == 1) {
        var agoText = ago(metric.updated).text;
        var metricValue = (metric.unit) ?
          ((metric.descr || metric.name || '') + '<span data-time="' + metric.updated + '" title = ' + agoText + ' class="nodeMetricAgo" style="float:left;font-weight:bold;">' + metric.value + (metric.unit || '') + '<span>') :
          ((metric.descr || metric.name || '') + '<span data-time="' + metric.updated + '"' + agoText + ' class="nodeMetricAgo" style="float:left;font-weight:bold;">' + metric.value + '<span>');
        label += '<p data-time="' + metric.updated + '" class="nodeMetricAgo" style="color:' + ago(metric.updated).color + '" title="' + agoText + '">' + metricValue + '</p> ';
      }
    }
    label = label.trim();
    return label;
  }

  function getNodeIcon(nodeType) {
    if (motesDef != undefined && nodeType != undefined && motesDef[nodeType] != undefined)
      return motesDef[nodeType].icon || 'icon_default.png';
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

    if (Math.abs(rssi) > 95) img = 'appbar.connection.quality.veryhigh.svg.png';
    else if (Math.abs(rssi) > 90) img = 'appbar.connection.quality.high.svg';
    else if (Math.abs(rssi) > 85) img = 'appbar.connection.quality.medium.svg';
    else if (Math.abs(rssi) > 80) img = 'appbar.connection.quality.low.svg';
    else if (Math.abs(rssi) > 75) img = 'appbar.connection.quality.verylow.svg';
    else if (Math.abs(rssi) > 70) img = 'appbar.connection.quality.extremelylow.svg';
    else img = 'appbar.connection.quality.extremelylow.svg';
    return '<img class="listIcon20px svg" src="images/' + img + '" title="RSSI:-' + Math.abs(rssi) + '" style="display:block;float:right;"/> ';
    //return '<span class="ui-li-aside" style="display:block" ><img class="listIcon20px" src="images/'+img+'" title="RSSI:-'+Math.abs(rssi)+'" />  </span>'
  }

  function resolveBatteryImage(voltage) {

    var img;
    var minVoltage = 3.35;
    if (voltage < 3.55) img = "appbar.battery.0.svg";
    else if (voltage < 3.85) img = "appbar.battery.1.svg";
    else if (voltage < 4.15) img = "appbar.battery.2.svg";
    else img = "appbar.battery.3.svg";
    var lobat = voltage < minVoltage ? ' blink' : '';
    return '<img class="listIcon20px svg' + lobat + '" src="images/' + img + '" title="Battery:' + Math.abs(voltage) + '" style="display:block;float:right;"/> ';

  }
  function updateNode(node) {
    LOG(JSON.stringify(node));
    if (node._id) {
      nodes[node._id] = node;
      var nodeValue = metricsValues(node.metrics);
      var lowBat = node.metrics != null ? node.metrics.V != null : false; // && node.metrics.V.value < 3.55;
      var newLI =
        $('<li id="' + node._id + '"><a node-id="' + node._id + '" href="#nodedetails" class="nodedetails"><img class="productimg svg" src="images/' + getNodeIcon(node.type) + '"><h2>' +
          (lowBat ? resolveBatteryImage(node.metrics.V.value) : '') +
          resolveRSSIImage(node.rssi) + ' ' + (node.label || node._id) + ' ' +
          //(lowBat ? '<img src="images/lowbattery.png" style="max-width:12px"/> ' : '') + 

          ago(node.updated, 0).tag + (node.hidden ? ' <img class="listIcon20px svg" src="images/appbar.eye.hide.svg" />' : '') + '</h2><p>' + (node.descr || '&nbsp;') + '</p>' + (nodeValue ? '<span class="">' + nodeValue + '</span>' : '') + '</a>' +
          '<a href="#node-option-popup" data-role="button" data-icon="action" data-iconpos="notext" data-rel="popup" data-position-to="window" data-transition="pop" class="nodedetails" node-id="' + node._id + '">Node Options</a>' +
          +'</li>'); //'<span class="ui-li-count">' + nodeValue + '</span>'
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
    $('#nodeList').listview('refresh'); //re-render the listview
  }

  function ago(time, agoPrefix) {
    agoPrefix = (typeof agoPrefix !== 'undefined') ? agoPrefix : true;
    var now = new Date().getTime();
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
    return { text: updated, color: theColor, tag: '<p data-time="' + time + '" class="nodeAgo ui-li-aside" style="color:' + theColor + ';">' + updated + '</p>' };
  }

  function updateAgos() {
    $("span.nodeAgo").each(function () {
      var timestamp = parseInt($(this).attr('data-time'));
      var agoResult = ago(timestamp, false);
      $(this).css('color', agoResult.color);
      $(this).html(agoResult.text);
    });
    $("p.nodeAgo").each(function () {
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
    $("p.nodeMetricAgo").each(function () {
      var timestamp = parseInt($(this).attr('data-time'));
      var agoResult = ago(timestamp);
      $(this).css('color', agoResult.color);
      $(this).prop('title', agoResult.text);
    });
  }

  //refresh "updated X ago" indicators
  var updateAgosTimer = setInterval(updateAgos, 3000);

  // function updateDate() {
  //   $(".datetime").each(function () {
  //     var d = new Date();
  //     //d+'';                  // "Sun Dec 08 2013 18:55:38 GMT+0100"
  //     //d.toDateString();      // "Sun Dec 08 2013"
  //     //d.toISOString();       // "2013-12-08T17:55:38.130Z"
  //     //d.toLocaleDateString() // "8/12/2013" on my system
  //     //d.toLocaleString()     // "8/12/2013 18.55.38" on my system
  //     //d.toUTCString()  
  //     var options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  //     $(this).html(d.toLocaleString('ro-RO', options));
  //   });
  // }
  // var updateDateTimer = setInterval(updateDate, 1000);

  $("#btnSearch").click("tap", function (event) {
    if ($("#searchBox").is(":visible")) {
      $("#searchBox").slideUp('fast');
      $("#btnSearch").removeClass('ui-btn-b');
    }
    else {
      $("#searchBox").slideDown('fast');
      $("#btnSearch").addClass('ui-btn-b');
    }
  });

  $("#btnHiddenNodesToggle").click("tap", function (event) {
    if (showHiddenNodes) {
      $(".hiddenNodeShow").removeClass('hiddenNodeShow').addClass('hiddenNode');
      $('#btnHiddenNodesToggle').css('background-color', '');
      showHiddenNodes = false;
    }
    else {
      $(".hiddenNode").removeClass('hiddenNode').addClass('hiddenNodeShow');
      $('#btnHiddenNodesToggle').css('background-color', '#D00');
      showHiddenNodes = true;
    }
  });

  $(".btnHideNodeToggle").click("tap", function (event) {
    if ($(".btnHideNodeToggle").hasClass('hidden'))
      $(".btnHideNodeToggle").removeClass('hidden').css('background-color', '');
    else $(".btnHideNodeToggle").addClass('hidden').css('background-color', '#D00');;
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
    $('#nodeDetailTitle').html(node.label || 'Node details');
    $('#nodeMoteType').val(node.type || '');
    $("#nodeMoteType").selectmenu('refresh', true);
    $('#nodeDescr').val(node.descr || '');

    if (node.hidden) $(".btnHideNodeToggle").addClass('hidden').css('background-color', '#D00');
    else $(".btnHideNodeToggle").removeClass('hidden').css('background-color', '');;

    $('.nodeID').html(node._id);
    if (node.rssi) { $('#rssiinfo').show(); $('.nodeRSSI').html(node.rssi); $('.nodeRSSIImage').html(resolveRSSIImage(node.rssi)); }
    else $('#rssiinfo').hide();
    $('.nodeUpdated').html(ago(node.updated, false).tag);

    $('#metricList').empty();
    for (var key in node.metrics) {
      var metric = node.metrics[key];
      var metricValue = metricsValuesShort([metric]);
      var newLI = $('<li id="' + key + '" data-icon="false" ><a metric-id="' + key + '" href="#metricdetails" class="metricdetails" >' + //class="ui-nodisc-icon ui-icon"
        '<h2>' + metric.label + ' ' + ago(metric.updated, 0).tag +

        (metric.pin == 1 ? '<span class="ui-btn ui-btn-icon-notext ui-icon-location" title="Show on dashboard" style="display:block;float:right;border-style: hidden;background-color: transparent;width:20px;height:20px;"></span>' : '') +
        (metric.graph == 1 ? '<span data-icon="fa-bar-chart" class="ui-btn ui-btn-icon-notext ui-icon-fa-bar-chart" title="Data log this metric" style="display:block;float:right;border-style: hidden;background-color: transparent;width:20px;height:20px;"></span>' : '') +  // ui-icon-fa-bar-chart
        '</h2>' +
        metricValue +
        '</a>' +
        '<a href="#metric-option-popup" data-role="button" data-icon="action" data-iconpos="notext" data-rel="popup" data-position-to="window" data-transition="pop" class="metricdetails" metric-id="' + key + '">Metric Options</a>' +

        '</li>');
      $('#metricList').append(newLI); //
      if (key == selectedMetricKey) {
        $('.metricUpdated').html(ago(metric.updated, 0).tag);
        $('#metricValue').val(metric.value + (metric.unit || ''));
        //         if (metric.graph) 
        //			addGraphDataPoint([(new Date()).getTime(), metric.value]); //TODO: assumes same timezone as server, update this according to timezone
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
      //var newLI = $('<li style="background-color:' + (enabled ? '#2d0' : '#d00') + '"><span class="ui-btn-icon-notext ui-icon-'+ (enabled ? (evt.icon ? evt.icon : 'action') : 'minus') + '" style="position:relative;float:left;padding:15px 10px;"></span><a event-id="' + key + '" href="#" class="eventEnableDisable" style="padding-top:0;padding-bottom:0;"><h2>' + evt.label + '</h2><p>' + (evt.descr || '&nbsp;') + '</p>' + '</a><a event-id="' + key + '" href="#" class="eventDelete" data-transition="pop" data-icon="delete"></a></li>');
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

    if (metric.pin == '1') {
      $("#btnPinMetric").addClass('pinned').css('background-color', '#38C');
      $("#btnPinMetricN").addClass('pinned').css('background-color', '#38C');
    }
    else {
      $("#btnPinMetric").removeClass('pinned').css('background-color', '');
      $("#btnPinMetricN").removeClass('pinned').css('background-color', '');
    }

    graphData = [];
    metricGraphWrapper.hide();
    $("#btnGraphMetric").show();
    $("#btnGraphMetricN").show();
    if (metric.graph == 1) {
      $("#btnGraphMetric").addClass('graphed').css('background-color', '#38C');
      $("#btnGraphMetricN").addClass('graphed').css('background-color', '#38C');
      $("div[ui-role='loadinggraph']").show();
      graphView.resetDomain();
      refreshGraph();
    }
    else if (metric.graph == 0) {
      $("#btnGraphMetric").removeClass('graphed').css('background-color', '');
      $("#btnGraphMetricN").removeClass('graphed').css('background-color', '');
      $("div[ui-role='loadinggraph']").hide();
    }
    else {
      $("#btnGraphMetric").hide();
      $("#btnGraphMetricN").hide();
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

  $('#nodeLabel').keyup(function () { $('#nodeDetailTitle').html($('#nodeLabel').val() || 'no label'); });
  $('#metricLabel').keyup(function () { $('#metricDetailTitle').html($('#metricLabel').val() || 'no label'); });

  $("#btnPinMetric, #btnPinMetricN").click("tap", function (event) {
    if ($("#btnPinMetric").hasClass('pinned')) {
      $("#btnPinMetric").removeClass('pinned').css('background-color', '');
      $("#btnPinMetricN").removeClass('pinned').css('background-color', '');
    }
    else {
      $("#btnPinMetric").addClass('pinned').css('background-color', '#38C');
      $("#btnPinMetricN").addClass('pinned').css('background-color', '#38C');
    }
  });

  $("#btnGraphMetric,#btnGraphMetricN").click("tap", function (event) {
    if ($("#btnGraphMetric").hasClass('graphed')) {
      $("#btnGraphMetric").removeClass('graphed').css('background-color', '');
      $("#btnGraphMetricN").removeClass('graphed').css('background-color', '');
      metricGraphWrapper.hide();
    }
    else {
      $("#btnGraphMetric").addClass('graphed').css('background-color', '#38C');
      $("#btnGraphMetricN").addClass('graphed').css('background-color', '#38C');
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
    if (typeof selectedNodeId == 'undefined')
      return;
    var node = nodes[selectedNodeId];
    node.label = $('#nodeLabel').val();
    node.type = $('#nodeMoteType').val();
    node.descr = $('#nodeDescr').val();
    node.hidden = $(".btnHideNodeToggle").hasClass('hidden'); //only persist when it's hidden
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

  // $('#addScheduleEvent').click("tap", function (event) {
  //   $('#addEventDescr').html(' ');
  //   $('#addEvent_OK').hide();
  //   $("#addEventType").empty();
  //   $('#addEventType').append('<option value="">Select type...</option>');
  //   for (var key in eventsDef)
  //     if (!nodes[selectedNodeId].events || !nodes[selectedNodeId].events[key])
  //       $('#addEventType').append('<option value="' + key + '">' + (eventsDef[key].label || key) + '</option>');

  //   $(document).on("pagebeforeshow", "#addEvent", function (event) {
  //     $("#addEventType").selectmenu('refresh');
  //     $("#addEventType").val('');
  //   });
  // });


  $('#addNodeNotification').click("tap", function (event) {
    //$('#addEventDescr').html(' ');
    $('#addNotification_OK').hide();

    $("#addNotificationType").empty();
    $('#addNotificationType').append('<option value="">Select type...</option>');
    for (var key in notificationTypeDef)
      $('#addNotificationType').append('<option value="' + key + '">' + (notificationTypeDef[key].label || key) + '</option>');

    $("#addNotificationAction").empty();
    $('#addNotificationAction').append('<option value="">Select action...</option>');
    for (var key in notificationActionDef)
      $('#addNotificationAction').append('<option value="' + key + '">' + (notificationActionDef[key].label || key) + '</option>');

    $(document).on("pagebeforeshow", "#addNotification", function (event) {
      $("#addNotificationType").selectmenu('refresh');
      $("#addNotificationType").val('');
      $("#addNotificationAction").selectmenu('refresh');
      $("#addNotificationAction").val('');
    });
  });

  $("#node_update, .node_update").click("tap", function (event) {
    notifyUpdateNode();
    //updateNode(nodes[selectedNodeId]); //this will happen when node is sent back by server
    $('#nodeList').listview('refresh');
  });

  $("#addEvent_OK").click("tap", function (event) {
    socket.emit('EDITNODEEVENT', selectedNodeId, $('#addEventType').val(), true);
  });
  $("#addSchedule_OK").click("tap", function (event) {
    socket.emit('EDITNODESCHEDULE', selectedNodeId, selectedScheduleDay, selectedSchedulePeriod, { startTime: $("#scheduleHour").val() + ":" + $("#scheduleMinutes").val(), comfortType: $('#addComfortType').val() }, false);
  });

  $("#deleteSchedule_yes").click("tap", function (event) {
    socket.emit('EDITNODESCHEDULE', selectedNodeId, selectedScheduleDay, selectedSchedulePeriod,null, true);
  });

  $("#addNotification_OK").click("tap", function (event) {

    var notification = Object.create(notificationActionDef[$('#addNotificationAction').val()]);  //new  Object();
    notification._id = 'xdserr'; //Math.random().toString(36).substr(2, 16);
    notification.label = $('#notificationLabel').val();
    notification.description = $('#notificationDescr').val();
    var notificationProto = Object.getPrototypeOf(notification)
    Object.getOwnPropertyNames(notificationProto).forEach(function (val, idx, array) {
      if ($('#notification' + val + 'Label') != undefined)
        notification[val] = $('#notification' + val + 'Label').val();
    });
    var type = notificationTypeDef[$('#addNotificationType').val()];

    Object.getOwnPropertyNames(type).forEach(function (val, idx, array) {
      if (val != 'label' && val != 'nextScheduleSTR') {
        if ($('#notification' + val + 'Label') != undefined)
          notification[val] = $('#notification' + val + 'Label').val();
      }
      if (val == 'nextScheduleSTR')
        notification[val] = type[val];
    });

    notification.action = $('#addNotificationAction').val();
    notification.type = $('#addNotificationType').val();

    var rec =
      {
        nextSchedule: function () { return this.miliseconds; },
      };
    Object.setPrototypeOf(notification, rec);
    alert(notification.nextSchedule());

    //		var x = new Object();
    //        x.a='bbbxxx';
    //        x.fun = new Function("alert(this.a);");
    //        x.fun();
    //Object.setPrototypeOf(notification, notificationTypeDef[$('#addNotificationType').val()]);
    //notification.prototype = notificationTypeDef[$('#addNotificationType').val()];
    //notification.type = notificationTypeDef[$('#addNotificationType').val()];
    //		var notificationType=notificationTypeDef[$('#addNotificationType').val()];
    //		for (property in notificationType) {
    //			notification[property] = notificationType[property];
    //		}
    //		Object.getOwnPropertyNames(notificationType).forEach(function(val, idx, array) {
    //			notification[val] = notificationType[val]
    //console.log(val + ' -> ' + obj[val]);
    //		});
    //alert(Object.getOwnPropertyNames(notificationType).filter(function (p) {
    //	return typeof notificationType[p] === 'function';})));

    socket.emit('EDITNODENOTIFICATION', selectedNodeId, notification, true);
  });

  $("#metric_return,#event_return,.metric_pin,.metric_graph").click("tap", function (event) {
    var metric = nodes[selectedNodeId].metrics[selectedMetricKey];
    if (metric != undefined) {
      metric.label = $('#metricLabel').val();
      metric.pin = $('#btnPinMetric').hasClass('pinned') ? 1 : 0;
      if (metric.graph != undefined) metric.graph = $('#btnGraphMetric').hasClass('graphed') ? 1 : 0;
      socket.emit('UPDATEMETRICSETTINGS', selectedNodeId, selectedMetricKey, metric);
    }
  });
  //	$(".metric_pin").click("tap", function(event) {
  //      var metric = nodes[selectedNodeId].metrics[selectedMetricKey];
  //      if (metric != undefined)
  //      {
  //        metric.pin = $('#btnPinMetric').hasClass('pinned') ? 1 : 0;
  //        socket.emit('UPDATEMETRICSETTINGS', selectedNodeId, selectedMetricKey, metric);
  //      }
  //    });
  //	$(".metric_graph").click("tap", function(event) {
  //      var metric = nodes[selectedNodeId].metrics[selectedMetricKey];
  //      if (metric != undefined)
  //      {
  //        if (metric.graph!=undefined) metric.graph = $('#btnGraphMetric').hasClass('graphed') ? 1 : 0;
  //        socket.emit('UPDATEMETRICSETTINGS', selectedNodeId, selectedMetricKey, metric);
  //        //$('#nodeList').listview('refresh');
  //      }
  //    });
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
    // $.mobile.navigate('#homepage', { transition : 'fade'});
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
    // if (value.toLowerCase() == 'new')
    //   socket.emit("INJECTNODE", { nodeId: id, label: value });
    // else
    //   socket.emit("NODEMESSAGE", { nodeId: id, action: value });
  });

  //enforce positive numeric input
  $("#rawActionID").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57) || $(this).val().length > 3) {
      event.preventDefault();
    }
    //max node ID is 255 with packet header defaults in RFM69 library
    // if ($(this).val() > 255) $(this).val(255);
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
  $("<span id='graphStat'></span>").css({
    position: "relative",
    bottom: "85px",
    right: "-35px",
    fontSize: "10px",
    color: '#00ff11',
    'font-weight': 'bold',
    'text-shadow': '0 1px 0 black',
  }).appendTo("#metricGraphWrapper");
}

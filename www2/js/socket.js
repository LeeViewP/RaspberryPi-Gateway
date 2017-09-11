
function SocketExtender(interfaceNotifier) {
    'use strict';
    this.socket_ = io();
    this.initializeSocket(interfaceNotifier);
    return this.socket_;
}
SocketExtender.prototype.initializeSocket = function (interfaceNotifier) {
    'use strict';

    this.socket_.on('connect', function () {
        interfaceNotifier.connected();
        // LOG('Connected!');
        // $('#loadingSocket').html('<span style="color:#2d0">Connected!</span><br/><br/>Waiting for data..');
    });

    this.socket_.on('disconnect', function () {
        interfaceNotifier.disconnected();
        // $('#log').val(new Date().toLocaleTimeString() + ' : Disconnected!\n' + $('#log').val());
        // $("#loader").show();
        // $('#loadingSocket').html('Socket was <span style="color:red">disconnected.</span><br/><br/>Waiting for socket connection..');
        // if ($.mobile.activePage.attr('id') != 'homepage')
        //     $.mobile.navigate('#homepage', { transition: 'slide' });
        // $('#nodeList').hide();
    });

    this.socket_.on('UPDATENODE', function (entry) {
        // console.log('UPDATENODE')
        interfaceNotifier.updateNode(entry);
        // updateNode(entry);
        // refreshNodeListUI();
    });

    this.socket_.on('UPDATESMARTTERMOSTATSCHEDULE', function (entry) {
        interfaceNotifier.updateThermostatSchedule(entry);
        // updateNode(entry);
        // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // var tabsParent = $('#thermostatTabs').parent();
        // $('#thermostatTabs').remove();
        // var tabs = $('<div/>', { 'data-role': "tabs", 'id': "thermostatTabs" }).appendTo(tabsParent);
        // var thNavBar = $('<div/>', { 'data-role': "navbar", 'id': "thermostatNavbar" }).appendTo(tabs);

        // var thUl = $('<ul/>', { 'id': "thermostatScheduleWeekDays" }).appendTo(thNavBar);

        // for (var day in entry.thermostatSchedule) {
        //     var thLi = $('<li/>', { class: "tab" }).appendTo(thUl);
        //     var thLiA = $('<a/>', { 'href': "#day" + day, text: days[day], 'scheduled-day': day }).appendTo(thLi);
        //     thLiA.addClass('scheduleday');
        //     var thTab = $('<div/>', { 'id': "day" + day }).appendTo(tabs);
        //     var thTabUl = $('<ul/>', { 'data-role': "listview", 'data-inset': "true", 'id': "listview" + day }).appendTo(thTab);
        //     var thTabUlDivider = $('<li/>', { 'data-role': "divider", 'id': "listDivider" + day }).appendTo(thTabUl);
        //     var thDividerH = $('<h2/>', { 'text': days[day] + ' Schedule' }).appendTo(thTabUlDivider);
        //     //var thDividerAdd =  $('<a/>', {'href':"#thermostatScheduleDetatils", 'data-role':"button", 'data-inline':"true", 'data-icon':"plus", 'data-iconpos':"notext", 'data-mini':"true", 'title':"Add new schedule" }).appendTo(thTabUlDivider); 
        //     var thDividerAddContainer = $('<div/>').appendTo(thTabUlDivider);
        //     thDividerAddContainer.addClass("ui-li-count ui-body-inherit");
        //     var thDividerAdd = $('<a/>', { 'href': "#thermostatScheduleDetails", 'data-role': "button", 'data-inline': "true", 'data-icon': "plus", 'data-iconpos': "notext", 'data-mini': "true", 'title': "Add new schedule" }).appendTo(thDividerAddContainer);
        //     thDividerAdd.addClass("newschedule");
        //     for (var schedule in entry.thermostatSchedule[day]) {
        //         var comfortType = getComfortType(entry.thermostatSchedule[day][schedule].comfortType);

        //         var thTabLi = $('<li/>').appendTo(thTabUl);
        //         var thASchedule = $('<a/>', { 'href': "#thermostatScheduleDetails", 'scheduled-period': schedule }).appendTo(thTabLi);
        //         thASchedule.addClass('scheduledetails');
        //         var thComfortTypeImage = $('<img/>', { 'src': "images/" + comfortType.icon, }).appendTo(thASchedule);
        //         var thStartHour = $('<div/>', { 'id': "thStartHour" + day + schedule, 'style': "float:right;" }).appendTo(thASchedule);
        //         thStartHour.text(entry.thermostatSchedule[day][schedule].startTime);
        //         var thConfortType = $('<div/>', { 'text': comfortType.label }).appendTo(thASchedule);
        //         var thConfortTypeTemperatures = $('<div/>').appendTo(thASchedule); //newBtn.addClass('ui-icon-' + state.icon);
        //         var thSpanHeat = $('<span/>', { 'data-icon': comfortType.heat.icon, 'style': "color:#ff1100; border-style: hidden;background-color: transparent" }).appendTo(thConfortTypeTemperatures);
        //         thSpanHeat.addClass('ui-btn ui-btn-inline ui-btn-icon-left ui-icon-' + comfortType.heat.icon);
        //         thSpanHeat.text(comfortType.heat.temperature + "°");

        //         var thSpanCool = $('<span/>', { 'data-icon': comfortType.cool.icon, 'text': comfortType.cool.temperature + "°", 'style': "color:#0077ff; border-style: hidden;background-color: transparent;" }).appendTo(thConfortTypeTemperatures);
        //         thSpanCool.addClass('ui-btn ui-btn-inline ui-btn-icon-left ui-icon-' + comfortType.cool.icon);
        //         var thAOption = $('<a/>', {
        //             'href': "#schedule-option-popup",
        //             'title': "Schedule Options",
        //             'scheduled-period': schedule,
        //             'data-role': "button", 'data-icon': "action",
        //             'data-iconpos': "notext", 'data-rel': "popup",
        //             'data-position-to': "window",
        //             'data-transition': "pop"
        //         }).appendTo(thTabLi);
        //         thAOption.addClass('scheduledetails');
        //     }
        //     thTabUl.listview().listview('refresh');
        //     $('#listview' + day).listview('refresh');
        // }
        // // thUl.listview().listview('refresh');
        // //  $('#thermostatScheduleWeekDays').listview('refresh');

        // tabsParent.enhanceWithin();
        // tabs.tabs({ active: selectedScheduleDay });

        // //$('#thermostatSchedulePage').trigger('pagecreate');
        // //$('#thermostatScheduleWeekDays').trigger('create');
        // $.mobile.changePage('#thermostatSchedulePage', { transition: 'slide' });
        // //alert(JSON.stringify(entry));
    });

    this.socket_.on('UPDATENODES', function (entries) {
        interfaceNotifier.updateNodes(entries);
        // $("#loader").hide();
        // $("#nodeList").empty();
        // $('#nodeList').append('<li id="uldivider" data-role="divider"><h2>Nodes</h2><span class="ui-li-count ui-li-count16">Count: 0</span></li>');
        // $('#nodeList').show();
        // for (var i = 0; i < entries.length; ++i)
        //     updateNode(entries[i]);
        // refreshNodeListUI();
        // if ($.mobile.activePage.attr('id') != 'homepage')
        //     $.mobile.navigate('#homepage', { transition: 'slide' });
    });

    this.socket_.on('MOTESDEF', function (motesDefinition) {
        interfaceNotifier.updateMotesDefinition(motesDefinition);
        // motesDef = motesDefinition;
        // $("#nodeMoteType").empty();
        // $('#nodeMoteType').append('<option value="">Select type...</option>');
        // for (var mote in motesDef)
        //     $('#nodeMoteType').append('<option value="' + mote + '">' + motesDef[mote].label || mote + '</option>');
        // $("#nodeMoteType").selectmenu();
    });

    this.socket_.on('COMFORTTYPESDEF', function (comfortTypesDefinition) {
        interfaceNotifier.updateComfortTypesDefinition(comfortTypesDefinition);
        // $("#addComfortType").empty();
        // $('#addComfortType').append('<option value="">Select type...</option>');
        // for (var key in comfortTypesDef)
        //     $('#addComfortType').append('<option value="' + key + '">' + (comfortTypesDef[key].label || key) + '</option>');
        // $("#addComfortType").selectmenu();

        // $('#addComfortType').change(function () {
        //     if ($(this).val()) {
        //         $('#addComfortTypeDescr').html('<span style="color:#fff">Action: </span> ' + (comfortTypesDef[$(this).val()].label || ''));
        //         $('#addSchedule_OK').show();
        //     }
        //     else {
        //         $('#addComfortTypeDescr').html(' ');
        //         $('#addSchedule_OK').hide();
        //     }
        // });
    });

    this.socket_.on('METRICSDEF', function (metricsDefinition) {
        // metricsDef = metricsDefinition;
        interfaceNotifier.updateMetricsDefinition(metricsDefinition);
    });

    this.socket_.on('EVENTSDEF', function (eventsDefinition) {
        interfaceNotifier.updateEventsDefinition(eventsDefinition);
        // eventsDef = eventsDefinition;
        // $('#addEventType').change(function () {
        //     if ($(this).val()) {
        //         $('#addEventDescr').html('<span style="color:#000">Action: </span>' + (eventsDef[$(this).val()].icon ? '<span class="ui-btn-icon-notext ui-icon-' + eventsDef[$(this).val()].icon + '" style="position:relative;float:left"></span>' : '') + (eventsDef[$(this).val()].descr || key));
        //         $('#addEvent_OK').show();
        //     }
        //     else {
        //         $('#addEventDescr').html(' ');
        //         $('#addEvent_OK').hide();
        //     }
        // });
    });

    this.socket_.on('SETTINGSDEF', function (newSettingsDef) {
        interfaceNotifier.updateSettingsDefinition(newSettingsDef);
        // settingsDef = newSettingsDef;
        // $('#settingsList').empty();
        // settingsDefBindMap = {};
        // for (var sectionName in settingsDef) {
        //     var sectionSettings = settingsDef[sectionName];
        //     if (!sectionSettings.exposed) continue;
        //     var sectionLI = $('<li data-role="list-divider">' + sectionName + '</li>');
        //     $('#settingsList').append(sectionLI);

        //     for (var settingName in sectionSettings) {
        //         var setting = sectionSettings[settingName];
        //         if (setting.exposed === false) continue;
        //         if (setting.value == undefined) continue;

        //         var settingLI; //ORIGINAL WITHOUT DESCR TOOLTIPS - var settingLI = $('<li class="ui-field-contain"><label for="'+sectionName+'-'+settingName+'">'+settingName+':</label><input '+(setting.password?'type="password"':'type="text"')+' name="'+sectionName+'-'+settingName+'" id="'+sectionName+'-'+settingName+'" value="'+setting.value+'" data-clear-btn="true"'+(setting.editable===false?' disabled="disabled"':'')+'></li>');
        //         if (setting.description) {
        //             settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">'
        //                 + '<a href="#popupInfo-' + sectionName + '-' + settingName + '" data-rel="popup" data-transition="pop">' + settingName + '</a>'
        //                 + '<div id="popupInfo-' + sectionName + '-' + settingName + '" data-role="popup" data-overlay-theme="b" class="popupInfo"><b>'
        //                 + settingName + '</b>: ' + setting.description
        //                 + '</div>'
        //                 + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');
        //         }
        //         else
        //             settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">' + settingName + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');

        //         settingsDefBindMap[sectionName + '.' + settingName + '.value'] = '#' + sectionName + '-' + settingName;
        //         $('#settingsList').append(settingLI);
        //     }
        // }

        // $('#settingsList').listview().listview('refresh').trigger("create");
        // boundSettings = Bind(settingsDef, settingsDefBindMap);
    });
};




// function SocketExtender(socket, interfaceNotifier) {
//     "use strict"
//     if (!(this instanceof SocketExtender)) {
//         throw new Error("Fubar needs to be called with the new keyword");
//     }
//     socket.on('connect', function () {
//         interfaceNotifier.connected();
//         // LOG('Connected!');
//         // $('#loadingSocket').html('<span style="color:#2d0">Connected!</span><br/><br/>Waiting for data..');
//     });

//     socket.on('disconnect', function () {
//         interfaceNotifier.disconnected();
//         // $('#log').val(new Date().toLocaleTimeString() + ' : Disconnected!\n' + $('#log').val());
//         // $("#loader").show();
//         // $('#loadingSocket').html('Socket was <span style="color:red">disconnected.</span><br/><br/>Waiting for socket connection..');
//         // if ($.mobile.activePage.attr('id') != 'homepage')
//         //     $.mobile.navigate('#homepage', { transition: 'slide' });
//         // $('#nodeList').hide();
//     });

//     socket.on('UPDATENODE', function (entry) {
//         // console.log('UPDATENODE')
//         interfaceNotifier.updateNode(entry);
//         // updateNode(entry);
//         // refreshNodeListUI();
//     });

//     socket.on('UPDATESMARTTERMOSTATSCHEDULE', function (entry) {
//         interfaceNotifier.updateThermostatSchedule(entry);
//         // updateNode(entry);
//         // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//         // var tabsParent = $('#thermostatTabs').parent();
//         // $('#thermostatTabs').remove();
//         // var tabs = $('<div/>', { 'data-role': "tabs", 'id': "thermostatTabs" }).appendTo(tabsParent);
//         // var thNavBar = $('<div/>', { 'data-role': "navbar", 'id': "thermostatNavbar" }).appendTo(tabs);

//         // var thUl = $('<ul/>', { 'id': "thermostatScheduleWeekDays" }).appendTo(thNavBar);

//         // for (var day in entry.thermostatSchedule) {
//         //     var thLi = $('<li/>', { class: "tab" }).appendTo(thUl);
//         //     var thLiA = $('<a/>', { 'href': "#day" + day, text: days[day], 'scheduled-day': day }).appendTo(thLi);
//         //     thLiA.addClass('scheduleday');
//         //     var thTab = $('<div/>', { 'id': "day" + day }).appendTo(tabs);
//         //     var thTabUl = $('<ul/>', { 'data-role': "listview", 'data-inset': "true", 'id': "listview" + day }).appendTo(thTab);
//         //     var thTabUlDivider = $('<li/>', { 'data-role': "divider", 'id': "listDivider" + day }).appendTo(thTabUl);
//         //     var thDividerH = $('<h2/>', { 'text': days[day] + ' Schedule' }).appendTo(thTabUlDivider);
//         //     //var thDividerAdd =  $('<a/>', {'href':"#thermostatScheduleDetatils", 'data-role':"button", 'data-inline':"true", 'data-icon':"plus", 'data-iconpos':"notext", 'data-mini':"true", 'title':"Add new schedule" }).appendTo(thTabUlDivider); 
//         //     var thDividerAddContainer = $('<div/>').appendTo(thTabUlDivider);
//         //     thDividerAddContainer.addClass("ui-li-count ui-body-inherit");
//         //     var thDividerAdd = $('<a/>', { 'href': "#thermostatScheduleDetails", 'data-role': "button", 'data-inline': "true", 'data-icon': "plus", 'data-iconpos': "notext", 'data-mini': "true", 'title': "Add new schedule" }).appendTo(thDividerAddContainer);
//         //     thDividerAdd.addClass("newschedule");
//         //     for (var schedule in entry.thermostatSchedule[day]) {
//         //         var comfortType = getComfortType(entry.thermostatSchedule[day][schedule].comfortType);

//         //         var thTabLi = $('<li/>').appendTo(thTabUl);
//         //         var thASchedule = $('<a/>', { 'href': "#thermostatScheduleDetails", 'scheduled-period': schedule }).appendTo(thTabLi);
//         //         thASchedule.addClass('scheduledetails');
//         //         var thComfortTypeImage = $('<img/>', { 'src': "images/" + comfortType.icon, }).appendTo(thASchedule);
//         //         var thStartHour = $('<div/>', { 'id': "thStartHour" + day + schedule, 'style': "float:right;" }).appendTo(thASchedule);
//         //         thStartHour.text(entry.thermostatSchedule[day][schedule].startTime);
//         //         var thConfortType = $('<div/>', { 'text': comfortType.label }).appendTo(thASchedule);
//         //         var thConfortTypeTemperatures = $('<div/>').appendTo(thASchedule); //newBtn.addClass('ui-icon-' + state.icon);
//         //         var thSpanHeat = $('<span/>', { 'data-icon': comfortType.heat.icon, 'style': "color:#ff1100; border-style: hidden;background-color: transparent" }).appendTo(thConfortTypeTemperatures);
//         //         thSpanHeat.addClass('ui-btn ui-btn-inline ui-btn-icon-left ui-icon-' + comfortType.heat.icon);
//         //         thSpanHeat.text(comfortType.heat.temperature + "°");

//         //         var thSpanCool = $('<span/>', { 'data-icon': comfortType.cool.icon, 'text': comfortType.cool.temperature + "°", 'style': "color:#0077ff; border-style: hidden;background-color: transparent;" }).appendTo(thConfortTypeTemperatures);
//         //         thSpanCool.addClass('ui-btn ui-btn-inline ui-btn-icon-left ui-icon-' + comfortType.cool.icon);
//         //         var thAOption = $('<a/>', {
//         //             'href': "#schedule-option-popup",
//         //             'title': "Schedule Options",
//         //             'scheduled-period': schedule,
//         //             'data-role': "button", 'data-icon': "action",
//         //             'data-iconpos': "notext", 'data-rel': "popup",
//         //             'data-position-to': "window",
//         //             'data-transition': "pop"
//         //         }).appendTo(thTabLi);
//         //         thAOption.addClass('scheduledetails');
//         //     }
//         //     thTabUl.listview().listview('refresh');
//         //     $('#listview' + day).listview('refresh');
//         // }
//         // // thUl.listview().listview('refresh');
//         // //  $('#thermostatScheduleWeekDays').listview('refresh');

//         // tabsParent.enhanceWithin();
//         // tabs.tabs({ active: selectedScheduleDay });

//         // //$('#thermostatSchedulePage').trigger('pagecreate');
//         // //$('#thermostatScheduleWeekDays').trigger('create');
//         // $.mobile.changePage('#thermostatSchedulePage', { transition: 'slide' });
//         // //alert(JSON.stringify(entry));
//     });

//     socket.on('UPDATENODES', function (entries) {
//         interfaceNotifier.updateNodes(entries);
//         // $("#loader").hide();
//         // $("#nodeList").empty();
//         // $('#nodeList').append('<li id="uldivider" data-role="divider"><h2>Nodes</h2><span class="ui-li-count ui-li-count16">Count: 0</span></li>');
//         // $('#nodeList').show();
//         // for (var i = 0; i < entries.length; ++i)
//         //     updateNode(entries[i]);
//         // refreshNodeListUI();
//         // if ($.mobile.activePage.attr('id') != 'homepage')
//         //     $.mobile.navigate('#homepage', { transition: 'slide' });
//     });

//     socket.on('MOTESDEF', function (motesDefinition) {
//         interfaceNotifier.updateMotesDefinition(motesDefinition);
//         // motesDef = motesDefinition;
//         // $("#nodeMoteType").empty();
//         // $('#nodeMoteType').append('<option value="">Select type...</option>');
//         // for (var mote in motesDef)
//         //     $('#nodeMoteType').append('<option value="' + mote + '">' + motesDef[mote].label || mote + '</option>');
//         // $("#nodeMoteType").selectmenu();
//     });

//     socket.on('COMFORTTYPESDEF', function (comfortTypesDefinition) {
//         interfaceNotifier.updateComfortTypesDefinition(comfortTypesDefinition);
//         // $("#addComfortType").empty();
//         // $('#addComfortType').append('<option value="">Select type...</option>');
//         // for (var key in comfortTypesDef)
//         //     $('#addComfortType').append('<option value="' + key + '">' + (comfortTypesDef[key].label || key) + '</option>');
//         // $("#addComfortType").selectmenu();

//         // $('#addComfortType').change(function () {
//         //     if ($(this).val()) {
//         //         $('#addComfortTypeDescr').html('<span style="color:#fff">Action: </span> ' + (comfortTypesDef[$(this).val()].label || ''));
//         //         $('#addSchedule_OK').show();
//         //     }
//         //     else {
//         //         $('#addComfortTypeDescr').html(' ');
//         //         $('#addSchedule_OK').hide();
//         //     }
//         // });
//     });

//     socket.on('METRICSDEF', function (metricsDefinition) {
//         // metricsDef = metricsDefinition;
//         interfaceNotifier.updateMetricsDefinition(metricsDefinition);
//     });

//     socket.on('EVENTSDEF', function (eventsDefinition) {
//         interfaceNotifier.updateEventsDefinition(eventsDefinition);
//         // eventsDef = eventsDefinition;
//         // $('#addEventType').change(function () {
//         //     if ($(this).val()) {
//         //         $('#addEventDescr').html('<span style="color:#000">Action: </span>' + (eventsDef[$(this).val()].icon ? '<span class="ui-btn-icon-notext ui-icon-' + eventsDef[$(this).val()].icon + '" style="position:relative;float:left"></span>' : '') + (eventsDef[$(this).val()].descr || key));
//         //         $('#addEvent_OK').show();
//         //     }
//         //     else {
//         //         $('#addEventDescr').html(' ');
//         //         $('#addEvent_OK').hide();
//         //     }
//         // });
//     });

//     socket.on('SETTINGSDEF', function (newSettingsDef) {
//         interfaceNotifier.updateSettingsDefinition(newSettingsDef);
//         // settingsDef = newSettingsDef;
//         // $('#settingsList').empty();
//         // settingsDefBindMap = {};
//         // for (var sectionName in settingsDef) {
//         //     var sectionSettings = settingsDef[sectionName];
//         //     if (!sectionSettings.exposed) continue;
//         //     var sectionLI = $('<li data-role="list-divider">' + sectionName + '</li>');
//         //     $('#settingsList').append(sectionLI);

//         //     for (var settingName in sectionSettings) {
//         //         var setting = sectionSettings[settingName];
//         //         if (setting.exposed === false) continue;
//         //         if (setting.value == undefined) continue;

//         //         var settingLI; //ORIGINAL WITHOUT DESCR TOOLTIPS - var settingLI = $('<li class="ui-field-contain"><label for="'+sectionName+'-'+settingName+'">'+settingName+':</label><input '+(setting.password?'type="password"':'type="text"')+' name="'+sectionName+'-'+settingName+'" id="'+sectionName+'-'+settingName+'" value="'+setting.value+'" data-clear-btn="true"'+(setting.editable===false?' disabled="disabled"':'')+'></li>');
//         //         if (setting.description) {
//         //             settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">'
//         //                 + '<a href="#popupInfo-' + sectionName + '-' + settingName + '" data-rel="popup" data-transition="pop">' + settingName + '</a>'
//         //                 + '<div id="popupInfo-' + sectionName + '-' + settingName + '" data-role="popup" data-overlay-theme="b" class="popupInfo"><b>'
//         //                 + settingName + '</b>: ' + setting.description
//         //                 + '</div>'
//         //                 + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');
//         //         }
//         //         else
//         //             settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">' + settingName + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');

//         //         settingsDefBindMap[sectionName + '.' + settingName + '.value'] = '#' + sectionName + '-' + settingName;
//         //         $('#settingsList').append(settingLI);
//         //     }
//         // }

//         // $('#settingsList').listview().listview('refresh').trigger("create");
//         // boundSettings = Bind(settingsDef, settingsDefBindMap);
//     });

//     return socket;
// };

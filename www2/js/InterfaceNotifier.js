function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n); //http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844
}


function InterfaceNotifier() {
    'use strict';
    // var clickEvent = ((document.ontouchstart !== null) ? 'click' : 'touchend');
    var clickEvent = 'click';
    //create action for all dialogs
    document.querySelectorAll('dialog').forEach(function (dialog) {
        if (dialog.querySelector('.action') != null)
            dialog.querySelector('.action').addEventListener(clickEvent, function () {
                aiController.DialogAction(dialog.id.toUpperCase());
                dialog.close();
            });
    });

}
InterfaceNotifier.prototype.clickEvent = 'click';//((document.ontouchstart !== null) ? 'click' : 'touchend');
InterfaceNotifier.prototype.socketExtender = null;

InterfaceNotifier.prototype.Definitions_ = {
    /**
     * Name should be descriptive so no comment needed.
     */
    motesDef: null,          //holds the definition of the motes (from server side metrics.js)
    metricsDef: null,        //holds the definition of the metrics (from server side metrics.js)
    eventsDef: null,
    comfortTypesDef: null,
    settingsDef: null,
    settingsDefBindMap: null,
    boundSettings: null,
    minVoltage: 3.35,
};

InterfaceNotifier.prototype.Toggles_ = {
    nodes: {},              //this holds the current nodes data
    //Toggles
    selectedNodeId: null,    //points to the selected node ID
    selectedMetricKey: null, //points to the selected metric name of the selected node
    selectedSchedulePeriod: null,
    selectedScheduleDay: (new Date()).getDay(),
    showHiddenNodes: false,
    showRawSend: false,
    serverTimeOffset: 0,
};

InterfaceNotifier.prototype.connected = function (node) {
    'use strict';
    var notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar(
        {
            message: 'Socket conected!'
        }
    );
    console.log('Socket Connected!');
    navigationPage.locknavigation(true);
    // this.socketExtender = node;
    // LOG('Connected!');
    // $('#loadingSocket').html('<span style="color:#2d0">Connected!</span><br/><br/>Waiting for data..');
};

InterfaceNotifier.prototype.disconnected = function (node) {
    'use strict';
    var notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar(
        {
            message: 'Socket disconected'
        }
    );
    console.log('Socket disconnected!');
    navigationPage.navigate('#loading');
    navigationPage.locknavigation(true);
    // $('#log').val(new Date().toLocaleTimeString() + ' : Disconnected!\n' + $('#log').val());
    // $("#loader").show();
    // $('#loadingSocket').html('Socket was <span style="color:red">disconnected.</span><br/><br/>Waiting for socket connection..');
    // if ($.mobile.activePage.attr('id') != 'homepage')
    //     $.mobile.navigate('#homepage', { transition: 'slide' });
    // $('#nodeList').hide();
};

InterfaceNotifier.prototype.error = function (node) {
    var notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar(
        {
            message: node
        }
    );
    console.log('Error!');
    navigationPage.navigate('#loading');
    navigationPage.locknavigation(true);
};

InterfaceNotifier.prototype.updateNode = function (node) {
    'use strict';
    // console.log('refresh node' + JSON.stringify(node));
    // // updateNode(entry);
    // // refreshNodeListUI();
    if (isNumeric(node._id)) {
        this.Toggles_.nodes[node._id] = node;
        var existingCard = document.querySelector('#sensorspage div#sensor' + node._id);
        var newCard = this.createSensorCard_(node);

        if (node.hidden)
            if (this.Toggles_.showHiddenNodes)
                newCard.classList.add('hiddenNodeShow');
            else
                newCard.classList.add('hiddenNode');
        if (existingCard != null)
            document.querySelector('#sensorspage').replaceChild(newCard, existingCard);
        else
            document.querySelector('#sensorspage').appendChild(newCard);
        if (this.Toggles_.selectedNodeId == node._id && navigationPage.activepage_.id == "sensordetails")
            this.createSensorEditCard_(node);
    }

    //   if (node._id == selectedNodeId) refreshNodeDetails(node);
};

InterfaceNotifier.prototype.updateNodes = function (nodes) {
    'use strict';
    for (var i = 0; i < nodes.length; ++i) {
        this.updateNode(nodes[i]);
    }
    navigationPage.locknavigation(false);
    navigationPage.navigate('#sensorspage');
    // window.location.hash='#dashboard';
    // self.makePageVisible('#dashboard');
    // $("#loader").hide();
    // $("#nodeList").empty();
    // $('#nodeList').append('<li id="uldivider" data-role="divider"><h2>Nodes</h2><span class="ui-li-count ui-li-count16">Count: 0</span></li>');
    // $('#nodeList').show();
    // for (var i = 0; i < entries.length; ++i)
    //     updateNode(entries[i]);
    // refreshNodeListUI();
    // if ($.mobile.activePage.attr('id') != 'homepage')
    //     $.mobile.navigate('#homepage', { transition: 'slide' });
};

InterfaceNotifier.prototype.updateThermostatSchedule = function (node) {
    'use strict';
    console.log('updateThermostatSchedule:' + JSON.stringify(node));
    navigationPage.navigate('#thermostatschedule');
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
};

InterfaceNotifier.prototype.updateMotesDefinition = function (motesDefinition) {
    'use strict';
    this.Definitions_.motesDef = motesDefinition;
    console.log('MotesDefinition Connected!');
    var oldnodeMoteType = document.querySelector('#nodeMoteType');

    //clean the select
    var selectParentNode = oldnodeMoteType.parentNode;
    var nodeMoteType = oldnodeMoteType.cloneNode(false); // Make a shallow copy
    selectParentNode.replaceChild(nodeMoteType, oldnodeMoteType);

    var optEmpty = document.createElement('option');
    optEmpty.value = '';
    optEmpty.innerHTML = 'Select type...';
    nodeMoteType.appendChild(optEmpty);
    for (var mote in this.Definitions_.motesDef) {
        var opt = document.createElement('option');
        opt.value = mote;
        opt.innerHTML = this.Definitions_.motesDef[mote].label || mote;
        nodeMoteType.appendChild(opt);
    }
};

InterfaceNotifier.prototype.updateComfortTypesDefinition = function (comfortTypesDefinition) {
    'use strict';
    this.Definitions_.comfortTypesDef = comfortTypesDefinition
    console.log('ComfortTypesDefinition Connected!');
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
};

InterfaceNotifier.prototype.updateMetricsDefinition = function (metricsDefinition) {
    'use strict';
    this.Definitions_.metricsDef = metricsDefinition;
    console.log('MetricsDefinition Connected!');
    // metricsDef = metricsDefinition;
};

InterfaceNotifier.prototype.updateEventsDefinition = function (eventsDefinition) {
    'use strict';
    this.Definitions_.eventsDef = eventsDefinition;

    var eventlist = document.querySelector('dialog #eventsList');
    var eventTemplate = document.querySelector('section#templates #eventDefTemplate');
    for (var key in this.Definitions_.eventsDef) {
        var evt = this.Definitions_.eventsDef[key];
        var eventLi = eventTemplate.cloneNode(true);
        var evtTitle = eventLi.querySelector('#eventDefLabel');
        evtTitle.textContent = evt.label;
        var evtSubTitle = eventLi.querySelector('#eventDefDescription');
        evtSubTitle.textContent = evt.descr || '&nbsp;';

        var enableEvent = eventLi.querySelector('#eventDefEnable');
        enableEvent.id += key;
        enableEvent.parentNode.setAttribute('for', enableEvent.id);
        
        //add event on click
        var objEvent = {
            handleEvent: function (e) {
                var event = { nodeId: this.iNotifier.Toggles_.selectedNodeId, key: this.data.key, enabled: e.target.checked?true:null, remove:e.target.checked?null:true};
                aiController.EnableEvent(event);
                //add 
                // socket.emit('EDITNODEEVENT', selectedNodeId, $('#addEventType').val(), true);
                //delete 
                // socket.emit('EDITNODEEVENT', selectedNodeId, eventKey, null, true);
            },
            iNotifier:this,
            data: { key: key },
        };
        enableEvent.addEventListener(this.clickEvent, objEvent);

        this.reinitialixeTextFieldMDL(enableEvent.parentNode);
        componentHandler.upgradeElement(enableEvent);

        componentHandler.upgradeElement(eventLi);
        eventlist.appendChild(eventLi);
    }
    console.log('EventsDefinition Connected!');

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
};

InterfaceNotifier.prototype.updateSettingsDefinition = function (newSettingsDef) {
    'use strict';
    this.Definitions_.settingsDef = newSettingsDef
    this.Definitions_.settingsDefBindMap = {};
    var settingsPage = document.querySelector('#settingspage');

    for (var sectionName in this.Definitions_.settingsDef) {
        var sectionSettings = this.Definitions_.settingsDef[sectionName];
        if (!sectionSettings.exposed) continue;

        var existingSectionCard = document.querySelector('#settingspage div#' + sectionName);

        var sectionCard = this.createSettingsSectionCard_(sectionName);
        var supportingText = sectionCard.querySelector('.mdl-card__supporting-text')
        for (var settingName in sectionSettings) {
            var setting = sectionSettings[settingName];
            if (setting.exposed === false) continue;
            if (setting.value == undefined) continue;
            var settingContent = this.createSettingContent_(sectionName, settingName, setting);
            supportingText.appendChild(settingContent);

            // var settingLI; //ORIGINAL WITHOUT DESCR TOOLTIPS - var settingLI = $('<li class="ui-field-contain"><label for="'+sectionName+'-'+settingName+'">'+settingName+':</label><input '+(setting.password?'type="password"':'type="text"')+' name="'+sectionName+'-'+settingName+'" id="'+sectionName+'-'+settingName+'" value="'+setting.value+'" data-clear-btn="true"'+(setting.editable===false?' disabled="disabled"':'')+'></li>');
            // if (setting.description) {
            // settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">'
            //     + '<a href="#popupInfo-' + sectionName + '-' + settingName + '" data-rel="popup" data-transition="pop">' + settingName + '</a>'
            //     + '<div id="popupInfo-' + sectionName + '-' + settingName + '" data-role="popup" data-overlay-theme="b" class="popupInfo"><b>'
            //     + settingName + '</b>: ' + setting.description
            //     + '</div>'
            //     + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');
            // }
            // else
            // settingLI = $('<li class="ui-field-contain"><label for="' + sectionName + '-' + settingName + '">' + settingName + ':</label><input ' + (setting.password ? 'type="password"' : 'type="text"') + ' name="' + sectionName + '-' + settingName + '" id="' + sectionName + '-' + settingName + '" value="' + setting.value + '" data-clear-btn="true"' + (setting.editable === false ? ' disabled="disabled"' : '') + '></li>');

            this.Definitions_.settingsDefBindMap[sectionName + '.' + settingName + '.value'] = '#' + sectionName + '-' + settingName;
        }
        componentHandler.upgradeElement(sectionCard);
        if (existingSectionCard != null)
            settingsPage.replaceChild(sectionCard, existingSectionCard);
        else
            settingsPage.appendChild(sectionCard);
    }
    this.Definitions_.boundSettings = Bind(this.Definitions_.settingsDef, this.Definitions_.settingsDefBindMap);

    //add Save button
    var saveButton = document.createElement('a');
    saveButton.classList.add('mdl-button', 'mdl-js-button', 'mdl-button--raised', 'mdl-button--accent', 'mdl-js-ripple-effect', 'float-button');
    saveButton.setAttribute('href', '#');
    saveButton.id = 'settingsSave';
    saveButton.textContent = 'save settings';
    componentHandler.upgradeElement(saveButton);
    settingsPage.appendChild(saveButton);

    //Action for save event
    var objEvent = {
        handleEvent: function () {
            aiController.UpdateSettings(this.data);
            //navigate home
            navigationPage.navigate('#dashboard');
        },
        data: this.Definitions_.boundSettings,
    };
    saveButton.addEventListener(this.clickEvent, objEvent);

    console.log('SettingsDefinition Connected!');


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
};


//PRIVATE FUNCTIONS
InterfaceNotifier.prototype.resolveBatteryImage_ = function (voltage) {
    var img;
    var minVoltage = 3.35;
    if (voltage < 3.55) img = "appbar.battery.0.svg";
    else if (voltage < 3.85) img = "appbar.battery.1.svg";
    else if (voltage < 4.15) img = "appbar.battery.2.svg";
    else if (voltage < 4.9) img = "appbar.battery.3.svg";
    else img = "appbar.battery.chargging.svg";
    // var lobat = voltage < minVoltage ? ' blink' : '';
    // var image = $('<img/>',
    //   {
    //      'class': "listIcon20px"
    //     , 'src': "images/" + img
    //     , 'title': "Battery:" + Math.abs(voltage)
    //     // , 'style': "display:block;float:right;"
    //   });
    // return image.prop('outerHTML');
    return img;

}

InterfaceNotifier.prototype.resolveRssiImage_ = function (rssi) {
    if (Math.abs(rssi) > 95) img = 'appbar.connection.quality.veryhigh.svg';
    else if (Math.abs(rssi) > 90) img = 'appbar.connection.quality.high.svg';
    else if (Math.abs(rssi) > 85) img = 'appbar.connection.quality.medium.svg';
    else if (Math.abs(rssi) > 80) img = 'appbar.connection.quality.low.svg';
    else if (Math.abs(rssi) > 75) img = 'appbar.connection.quality.verylow.svg';
    else if (Math.abs(rssi) > 70) img = 'appbar.connection.quality.extremelylow.svg';
    else img = 'appbar.connection.quality.extremelylow.svg';
    return img;
}

InterfaceNotifier.prototype.reinitialixeTextFieldMDL = function (component) {
    component.classList.remove('is-upgraded');
    component.removeAttribute('data-upgraded');
    componentHandler.upgradeElement(component);
    component.classList.add('is-dirty');
};

InterfaceNotifier.prototype.createSensorCard_ = function (node) {
    'use strict';
    // Your code here...


    var divCard = document.createElement('div');
    divCard.classList.add('mdl-card', 'mdl-shadow--2dp', 'mdl-cell', 'mdl-cell--4-col', 'mdl-cell--4-col-tablet');//'demo-updates', 
    divCard.id = 'sensor' + node._id;



    var divCardTitle = this.createCardTitle_(node);
    componentHandler.upgradeElement(divCardTitle);
    divCard.appendChild(divCardTitle);

    var divCardSupportingText = this.createCardSupportingText_(node);
    componentHandler.upgradeElement(divCardSupportingText);
    divCard.appendChild(divCardSupportingText);

    var divCardMedia = this.createCardMedia_(node);
    componentHandler.upgradeElement(divCardMedia);
    divCard.appendChild(divCardMedia);

    var divCardActions = this.createCardActions_(node);
    componentHandler.upgradeElement(divCardActions);
    divCard.appendChild(divCardActions);

    // var divCardMenu = this.createCardMenu_(node);
    // // componentHandler.upgradeElement(divCardMenu);
    // divCard.appendChild(divCardMenu);
    // componentHandler.upgradeElement(divCardMenu);

    componentHandler.upgradeElement(divCard);

    // var divCardMenuButton = this.createCardMenuButton_(node);
    // componentHandler.upgradeElement(divCardMenuButton);
    // divCard.appendChild(divCardMenuButton);


    return divCard;


};

InterfaceNotifier.prototype.createCardTitle_ = function (node) {

    //Card Title
    var divCardTitle = document.createElement('div');
    divCardTitle.classList.add('mdl-card__title'); //, 'mdl-card--expand' , 'mdl-color--accent', 'mdl-color-text--white'




    var h2CardTitle = document.createElement('h3');
    // h2CardTitle.classList.add('mdl-card__title-text');
    // h2CardTitle.textContent = node.label;

    // var svgCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');// document.createElement('svg');
    // svgCardTitle.setAttribute('fill', 'currentColor');
    // svgCardTitle.setAttribute('viewBox', '0 0 76 76');
    // svgCardTitle.setAttribute('width', '76');
    // svgCardTitle.setAttribute('height', '76');
    // // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

    // var svgUseCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
    // svgUseCardTitle.setAttributeNS(
    //     'http://www.w3.org/1999/xlink', // xlink NS URI
    //     'href',                         // attribute (no 'xlink:')
    //     '#' + this.Definitions_.motesDef[node.type].icon);

    // componentHandler.upgradeElement(svgCardTitle);
    // componentHandler.upgradeElement(svgUseCardTitle);
    // svgCardTitle.appendChild(svgUseCardTitle);
    // h2CardTitle.appendChild(svgCardTitle);

    var divCardTitleText = document.createElement('div');
    divCardTitleText.classList.add('mdl-card__title-text', 'mdl-color-text--primary-contrast');
    divCardTitleText.textContent = node.label;
    componentHandler.upgradeElement(divCardTitleText);
    h2CardTitle.appendChild(divCardTitleText);

    var divCardSubtitleText = document.createElement('div');
    divCardSubtitleText.classList.add('mdl-card__subtitle-text', 'mdl-color-text--primary-contrast');
    divCardSubtitleText.textContent = node.descr || ' ';
    componentHandler.upgradeElement(divCardSubtitleText);
    h2CardTitle.appendChild(divCardSubtitleText);

    componentHandler.upgradeElement(h2CardTitle);
    divCardTitle.appendChild(h2CardTitle)

    divCardTitle.appendChild(this.createSpacer_());

    var svgCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');// document.createElement('svg');
    svgCardTitle.setAttribute('fill', 'currentColor');
    svgCardTitle.setAttribute('viewBox', '0 0 76 76');
    svgCardTitle.setAttribute('width', '76');
    svgCardTitle.setAttribute('height', '76');
    svgCardTitle.classList.add('mdl-color-text--primary'); //mdl-color--primary
    // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

    var icon = node.type != undefined ? this.Definitions_.motesDef[node.type].icon || '' : ''
    var svgUseCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
    svgUseCardTitle.setAttributeNS(
        'http://www.w3.org/1999/xlink', // xlink NS URI
        'href',                         // attribute (no 'xlink:')
        '#' + icon);

    componentHandler.upgradeElement(svgCardTitle);
    componentHandler.upgradeElement(svgUseCardTitle);
    svgCardTitle.appendChild(svgUseCardTitle);
    divCardTitle.appendChild(svgCardTitle);

    // var svgCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');// document.createElement('svg');
    // svgCardTitle.setAttribute('fill', 'currentColor');
    // svgCardTitle.setAttribute('viewBox', '0 0 76 76');
    // svgCardTitle.setAttribute('width', '100');
    // svgCardTitle.setAttribute('height', '100');
    // // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

    // var svgUseCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
    // svgUseCardTitle.setAttributeNS(
    //     'http://www.w3.org/1999/xlink', // xlink NS URI
    //     'href',                         // attribute (no 'xlink:')
    //     '#' + this.Definitions_.motesDef[node.type].icon);

    // componentHandler.upgradeElement(svgCardTitle);
    // componentHandler.upgradeElement(svgUseCardTitle);
    // svgCardTitle.appendChild(svgUseCardTitle);
    // divCardTitle.appendChild(svgCardTitle);




    return divCardTitle;
}

InterfaceNotifier.prototype.createCardMedia_ = function (node) {
    var divCardMedia = document.createElement('div')
    divCardMedia.classList.add('mdl-card__media', 'mdl-card--expand', 'mdl-color--white', 'mdl-color-text--primary-contrast', 'mdl-typography--text-center');//, 'mdl-color-text--white'


    for (var key in node.metrics) {
        var metric = node.metrics[key];
        var svgMetric = this.createMetricSVG_(metric);
        if (svgMetric != undefined)
            divCardMedia.appendChild(svgMetric);
        //     var metric = node.metrics[key];
        //     if (metric.pin == '1' || node.metrics.length == 1) {
        //         // var metricValue = (metric.unit) ? (metric.value + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
        //         var metricValue = (metric.unit) ? (metric.value ) : ((metric.descr || metric.name || '') + metric.value);
        //         var metricUnit = metric.unit || ''
        //         var svgMetric = document.createElementNS('http://www.w3.org/2000/svg', 'svg');// document.createElement('svg');
        //         svgMetric.setAttribute('fill', 'currentColor');
        //         svgMetric.setAttribute('viewBox', '0 0 1 1');
        //         svgMetric.setAttribute('width', '100');
        //         svgMetric.setAttribute('height', '100');
        //         // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

        //         var svgUseMetric = document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
        //         svgUseMetric.setAttributeNS(
        //             'http://www.w3.org/1999/xlink', // xlink NS URI
        //             'href',                         // attribute (no 'xlink:')
        //             '#circle');
        //         svgUseMetric.style.mask = "url(#piemask)"

        //         svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        //         svgText.setAttribute(
        //             'x',                         // attribute (no 'xlink:')
        //             '0.5');
        //         svgText.setAttribute(
        //             'y',                         // attribute (no 'xlink:')
        //             '0.5');
        //         svgText.setAttribute(
        //             'font-size',                         // attribute (no 'xlink:')
        //             '0.2');
        //         svgText.setAttribute(
        //             'text-anchor',                         // attribute (no 'xlink:')
        //             'middle');
        //         svgText.setAttribute('dy', '0.1');
        //         svgText.textContent = metricValue;

        //         svgTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        //         svgTspan.setAttribute('dy','-0.07');
        //         svgTspan.setAttribute('font-size',metricUnit.length<2?'-0.2':'-0.9');
        //         svgTspan.textContent = metricUnit.length<2?metricUnit:'';
        //         componentHandler.upgradeElement(svgTspan);
        //         svgText.appendChild(svgTspan);

        //         //     <text x="0.5" y="0.5" font-family="Roboto" font-size="0.3" fill="#888" text-anchor="middle" dy="0.1">82
        //         //     <tspan dy="-0.07" font-size="0.2">%</tspan>
        //         //   </text>

        //         componentHandler.upgradeElement(svgMetric);
        //         componentHandler.upgradeElement(svgUseMetric);
        //         componentHandler.upgradeElement(svgText);
        //         svgMetric.appendChild(svgUseMetric);
        //         svgMetric.appendChild(svgText);
        //         divCardMedia.appendChild(svgMetric);

        //         // //var agoText = ago(metric.updated).text;
        //         // //metric.value + (metric.unit || '')
        //         // var metricContainer = document.createElement('div');
        //         // metricContainer.classList.add('mdl-card__supporting_text_metrics');

        //         // var metricCardSupportingText = document.createElement('span');
        //         // metricCardSupportingText.textContent = metric.descr || metric.label || ' ';
        //         // componentHandler.upgradeElement(metricCardSupportingText);
        //         // metricContainer.appendChild(metricCardSupportingText);

        //         // var separatorMetricSupportingText = document.createElement('div');
        //         // separatorMetricSupportingText.classList.add('mdl-layout-spacer');
        //         // componentHandler.upgradeElement(separatorMetricSupportingText);
        //         // metricContainer.appendChild(separatorMetricSupportingText);

        //         // // var metricValue = (metric.unit) ? (metric.value + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
        //         // var metricValueCardSupportingText = document.createElement('span');
        //         // metricValueCardSupportingText.textContent = metricValue;
        //         // componentHandler.upgradeElement(metricValueCardSupportingText);
        //         // metricContainer.appendChild(metricValueCardSupportingText);

        //         // componentHandler.upgradeElement(metricContainer);
        //         // divCardMedia.appendChild(metricContainer);

        //         // // var separatorMetricEndSupportingText = document.createElement('div');
        //         // // separatorMetricEndSupportingText.classList.add('mdl-layout-spacer');
        //         // // componentHandler.upgradeElement(separatorMetricEndSupportingText);
        //         // // divCardSupportingText.appendChild(separatorMetricEndSupportingText);
        //         // // label += '<span data-time="' + metric.updated + '" class="nodeMetricAgo" style="color:' + ago(metric.updated).color + '" title="' + agoText + '">' + metricValue + '</span> ';
        //     }
    }
    componentHandler.upgradeElement(divCardMedia);
    return divCardMedia;
}

InterfaceNotifier.prototype.createCardSupportingText_ = function (node) {
    //Card supporting text
    var divCardSupportingText = document.createElement('div');
    divCardSupportingText.classList.add('mdl-card__supporting-text', 'mdl-color-text--primary-contrast');

    var descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('mdl-card__supporting_text_metrics');

    var spanCardSupportingText = document.createElement('span');
    spanCardSupportingText.textContent = 'updated: '; // node.descr || ' ';
    componentHandler.upgradeElement(spanCardSupportingText);
    descriptionContainer.appendChild(spanCardSupportingText);


    var spanAgoSupportingText = document.createElement('span');
    //agos
    var agoObject = ago(node.updated);
    spanAgoSupportingText.classList.add('updateAgo');
    spanAgoSupportingText.textContent = agoObject.text;
    spanAgoSupportingText.style.color = agoObject.color;
    spanAgoSupportingText.setAttribute('data-time', node.updated);

    componentHandler.upgradeElement(spanAgoSupportingText);
    descriptionContainer.appendChild(spanAgoSupportingText);


    descriptionContainer.appendChild(this.createSpacer_());

    //Add RSSI
    if (node.rssi != undefined) {
        console.log("RSSI=" + node.rssi);
        //Has battery metric
        var svgCardRssi = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgCardRssi.setAttribute('fill', 'currentColor');
        svgCardRssi.setAttribute('viewBox', '0 0 76 76');
        svgCardRssi.setAttribute('width', '18');
        svgCardRssi.setAttribute('height', '18');
        svgCardRssi.setAttribute('title', "RSSI:" + Math.abs(node.rssi));
        // svgCardRssi.classList.add('mdl-color-text--accent');

        var svgUseCardRssi = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        svgUseCardRssi.setAttributeNS(
            'http://www.w3.org/1999/xlink', // xlink NS URI
            'href',                         // attribute (no 'xlink:')
            '#' + this.resolveRssiImage_(node.rssi));
        // mask="url(#piemask)"
        componentHandler.upgradeElement(svgCardRssi);
        componentHandler.upgradeElement(svgUseCardRssi);

        svgCardRssi.appendChild(svgUseCardRssi);
        descriptionContainer.appendChild(svgCardRssi);
    }

    //Add Battery
    if (node.metrics != null ? node.metrics.V != null : false) {
        console.log("Battery=" + node.metrics.V.value);
        //Has battery metric
        var svgCardBattery = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgCardBattery.setAttribute('fill', 'currentColor');
        svgCardBattery.setAttribute('viewBox', '0 0 76 76');
        svgCardBattery.setAttribute('width', '18');
        svgCardBattery.setAttribute('height', '18');
        svgCardBattery.setAttribute('title', "Battery:" + Math.abs(node.metrics.V.value));
        // svgCardBattery.classList.add('mdl-color-text--accent');

        var svgUseCardBattery = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        svgUseCardBattery.setAttributeNS(
            'http://www.w3.org/1999/xlink', // xlink NS URI
            'href',                         // attribute (no 'xlink:')
            '#' + this.resolveBatteryImage_(node.metrics.V.value));

        componentHandler.upgradeElement(svgCardBattery);
        componentHandler.upgradeElement(svgUseCardBattery);
        if (node.metrics.V.value < this.Definitions_.minVoltage)
            svgCardBattery.classList.add('blink');

        svgCardBattery.appendChild(svgUseCardBattery);
        descriptionContainer.appendChild(svgCardBattery);
    }

    componentHandler.upgradeElement(descriptionContainer);
    divCardSupportingText.appendChild(descriptionContainer);

    return divCardSupportingText;
}

InterfaceNotifier.prototype.createCardActions_ = function (node) {
    //Card Actions
    var divCardActions = document.createElement('div');
    divCardActions.classList.add('mdl-card__actions', 'mdl-card--border', 'mdl-cel--3-col');

    var linkCardActions = document.createElement('a');
    linkCardActions.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-color-text--primary');
    linkCardActions.textContent = 'EDIT SENSOR';
    linkCardActions.setAttribute('href', "#sensordetails");

    var objEvent = {
        handleEvent: function () {
            this.iNotifier.Toggles_.selectedNodeId = this.data._id;
            this.iNotifier.createSensorEditCard_(this.data);
        },
        data: this.Toggles_.nodes[node._id],
        iNotifier: this,
    };
    linkCardActions.addEventListener(this.clickEvent, objEvent);

    componentHandler.upgradeElement(linkCardActions);
    divCardActions.appendChild(linkCardActions);

    divCardActions.appendChild(this.createSpacer_());

    if (this.Definitions_.motesDef[node.type] && this.Definitions_.motesDef[node.type].controls) {
        // var linkContainer = undefined;
        for (var cKey in this.Definitions_.motesDef[node.type].controls) {
            var control = this.Definitions_.motesDef[node.type].controls[cKey];
            // i++;
            if (control.showCondition) {
                var f = eval('(' + control.showCondition + ')'); //using eval is generally a bad idea but there is no way to pass functions in JSON via websockets so we pass them as strings instead
                if (!f(node)) continue;
            }

            var linkControl = this.createActionControl(node, control, cKey);
            divCardActions.appendChild(linkControl);
        }
    }
    return divCardActions;
}

InterfaceNotifier.prototype.createCardMenuButton_ = function (node) {
    // ADD button
    var divMenu = document.createElement('div');
    divMenu.classList.add('mdl-card__menu');

    var buttonMenu = document.createElement('button');
    buttonMenu.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-button--icon');
    buttonMenu.id = 'morebtn' + node._id;

    var iMenu = document.createElement('i');
    iMenu.classList.add('material-icons');
    iMenu.textContent = 'more_vert';
    componentHandler.upgradeElement(iMenu);
    buttonMenu.appendChild(iMenu);

    componentHandler.upgradeElement(buttonMenu);
    divMenu.appendChild(buttonMenu);

    // var ulMenu = document.createElement('ul');
    // ulMenu.classList.add('mdl-menu', 'mdl-js-menu', 'mdl-js-ripple-effect', 'mdl-menu--bottom-right');
    // ulMenu.setAttribute('for', 'morebtn' + node._id);

    // var editLiMenu = document.createElement('li');
    // editLiMenu.classList.add('mdl-menu__item');
    // editLiMenu.textContent = 'Edit sensor';
    // componentHandler.upgradeElement(editLiMenu);

    // ulMenu.appendChild(editLiMenu);
    // // componentHandler.upgradeElement(ulMenu);

    // divMenu.appendChild(ulMenu);

    return divMenu;
}

InterfaceNotifier.prototype.createCardMenu_ = function (node) {
    // ADD button
    var ulMenu = document.createElement('ul');
    ulMenu.classList.add('mdl-menu', 'mdl-js-menu', 'mdl-js-ripple-effect', 'mdl-menu--bottom-right');
    ulMenu.setAttribute('for', 'morebtn' + node._id);

    var editLiMenu = document.createElement('li');
    editLiMenu.classList.add('mdl-menu__item');
    editLiMenu.textContent = 'Edit sensor';
    componentHandler.upgradeElement(editLiMenu);

    ulMenu.appendChild(editLiMenu);
    // componentHandler.upgradeElement(ulMenu);

    // divMenu.appendChild(ulMenu);

    return ulMenu;
}

InterfaceNotifier.prototype.createMetricSVG_ = function (metric) {
    if (metric.pin == '1') {
        // var metricValue = (metric.unit) ? (metric.value + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
        var metricValue = (metric.unit) ? (metric.value) : ((metric.descr || metric.name || '') + metric.value);
        var metricUnit = metric.unit || '';

        var metricValueString = metricValue.toString();
        var metricValueBig = '';
        var metricValueSmall = '';
        var index = metricValueString.indexOf('.');
        if (isNumeric(metricValueString) && index != -1) {
            metricValueBig = metricValueString.substr(0, index);
            metricValueSmall = metricValueString.substr(index, metricValueString.length);
        }
        else {
            metricValueBig = metricValueString;
            metricValueSmall = '';
        }

        var svgMetric = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgMetric.setAttribute('fill', 'currentColor');
        svgMetric.setAttribute('viewBox', '0 0 1 1');
        svgMetric.setAttribute('width', '100');
        svgMetric.setAttribute('height', '100');
        //agos
        var agoObject = ago(metric.updated);
        svgMetric.classList.add('updateAgo');
        svgMetric.setAttribute('data-time', metric.updated);
        svgMetric.style.color = agoObject.color;

        var svgUseMetric = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        svgUseMetric.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#circle');
        svgUseMetric.style.mask = "url(#circlemask)"

        svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        svgText.setAttribute('x', '0.5');
        svgText.setAttribute('y', '0.5');
        svgText.setAttribute('font-size', metricValueBig.length > 3 ? '0.2' : '0.3');
        svgText.setAttribute('text-anchor', 'middle');
        svgText.setAttribute('dy', '0.05');
        svgText.textContent = metricValueBig;

        svgTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        // svgTspan.setAttribute('dy', '-0.07');
        svgTspan.setAttribute('font-size', metricUnit.length < 2 ? '0.1' : '0.08');
        svgTspan.textContent = metricValueSmall + (metricUnit.length < 2 ? metricUnit : '');
        componentHandler.upgradeElement(svgTspan);
        svgText.appendChild(svgTspan);

        svgTextName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        svgTextName.setAttribute('x', '0.5');
        svgTextName.setAttribute('y', '0.5');
        svgTextName.setAttribute('font-size', '0.1');
        svgTextName.setAttribute('text-anchor', 'middle');
        svgTextName.setAttribute('dy', '0.25');
        svgTextName.textContent = metric.label || metric.name || '';
        componentHandler.upgradeElement(svgTextName);

        componentHandler.upgradeElement(svgMetric);
        componentHandler.upgradeElement(svgUseMetric);
        componentHandler.upgradeElement(svgText);
        svgMetric.appendChild(svgUseMetric);
        svgMetric.appendChild(svgText);
        svgMetric.appendChild(svgTextName);
        return svgMetric;

        // //var agoText = ago(metric.updated).text;
        // //metric.value + (metric.unit || '')
        // var metricContainer = document.createElement('div');
        // metricContainer.classList.add('mdl-card__supporting_text_metrics');

        // var metricCardSupportingText = document.createElement('span');
        // metricCardSupportingText.textContent = metric.descr || metric.label || ' ';
        // componentHandler.upgradeElement(metricCardSupportingText);
        // metricContainer.appendChild(metricCardSupportingText);

        // var separatorMetricSupportingText = document.createElement('div');
        // separatorMetricSupportingText.classList.add('mdl-layout-spacer');
        // componentHandler.upgradeElement(separatorMetricSupportingText);
        // metricContainer.appendChild(separatorMetricSupportingText);

        // // var metricValue = (metric.unit) ? (metric.value + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
        // var metricValueCardSupportingText = document.createElement('span');
        // metricValueCardSupportingText.textContent = metricValue;
        // componentHandler.upgradeElement(metricValueCardSupportingText);
        // metricContainer.appendChild(metricValueCardSupportingText);

        // componentHandler.upgradeElement(metricContainer);
        // divCardMedia.appendChild(metricContainer);

        // // var separatorMetricEndSupportingText = document.createElement('div');
        // // separatorMetricEndSupportingText.classList.add('mdl-layout-spacer');
        // // componentHandler.upgradeElement(separatorMetricEndSupportingText);
        // // divCardSupportingText.appendChild(separatorMetricEndSupportingText);
        // // label += '<span data-time="' + metric.updated + '" class="nodeMetricAgo" style="color:' + ago(metric.updated).color + '" title="' + agoText + '">' + metricValue + '</span> ';
    }

}

InterfaceNotifier.prototype.createActionControl = function (node, control, cKey) {

    for (var sKey in control.states) {
        var state = control.states[sKey];
        if (state.condition) {
            var f = eval('(' + state.condition + ')'); //using eval is generally a bad idea but there is no way to pass functions in JSON via websockets so we pass them as strings instead
            if (!f(node)) continue;
        }
        var linkControl = document.createElement('a');
        linkControl.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-color-text--primary');
        linkControl.setAttribute('href', "#");
        linkControl.textContent = state.label;
        if (state.css) {
            //hack for class if it has css overite it vith mdl-color-text--primary
            linkControl.classList.remove('mdl-color-text--primary');
            linkControl.classList.add('mdl-color-text--accent');
            //linkControl.style = state.css;
        }
        // if (state.icon)
        //     link.classList.add(state.icon);
        var objEvent = {
            handleEvent: function () {
                aiController.ControlClick(this.data);
            },
            data: { nodeId: node._id, action: state.action, nodeType: node.type, cKey: cKey, sKey: sKey },
        };
        linkControl.addEventListener(this.clickEvent, objEvent);
        // linkControl.addEventListener('click', function () {
        //     event.data = { nodeId: node._id, action: state.action, nodeType: node.type, cKey: cKey, sKey: sKey };

        //     //  alert(event.data.action + ' was clicked for node ' + event.data.nodeId);
        //     socket.emit("CONTROLCLICK", { nodeId: event.data.nodeId, action: event.data.action, nodeType: event.data.nodeType, controlKey: event.data.cKey, stateKey: event.data.sKey });
        // }, false);
        // linkControl.bind('click', { nodeId: node._id, action: state.action, nodeType: node.type, cKey: cKey, sKey: sKey }, function (event) {
        //     //alert(event.data.action + ' was clicked for node ' + event.data.nodeId);
        //     socket.emit("CONTROLCLICK", { nodeId: event.data.nodeId, action: event.data.action, nodeType: event.data.nodeType, controlKey: event.data.cKey, stateKey: event.data.sKey });
        // });
        componentHandler.upgradeElement(linkControl);


    }
    return linkControl;
}

InterfaceNotifier.prototype.createSpacer_ = function () {
    var separator = document.createElement('div');
    separator.classList.add('mdl-layout-spacer');
    componentHandler.upgradeElement(separator);
    return separator;
}

InterfaceNotifier.prototype.createSettingsSectionCard_ = function (sectionName) {
    var divCard = document.createElement('div');
    divCard.classList.add('mdl-card', 'mdl-shadow--2dp', 'mdl-cell', 'mdl-cell--4-col'); //, 'mdl-cell--8-col-tablet', 'mdl-cell--12-col-desktop'
    divCard.id = sectionName;
    //Card Title
    var divCardTitle = document.createElement('div');
    divCardTitle.classList.add('mdl-card__title', 'mdl-color--primary', 'mdl-color-text--primary-contrast'); //, 'mdl-card--expand' , 'mdl-color--accent', 'mdl-color-text--white'
    var h2CardTitle = document.createElement('h3');
    h2CardTitle.textContent = sectionName;

    componentHandler.upgradeElement(h2CardTitle);
    divCardTitle.appendChild(h2CardTitle)

    var divCardSupportingText = document.createElement('div');
    divCardSupportingText.classList.add('mdl-card__supporting-text', 'mdl-color-text--primary-contrast');

    divCard.appendChild(divCardTitle)

    componentHandler.upgradeElement(divCardSupportingText);
    divCard.appendChild(divCardSupportingText)

    return divCard;
};

InterfaceNotifier.prototype.createSettingContent_ = function (sectionName, settingName, setting) {
    var divContent = document.createElement('div');
    divContent.classList.add('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label');

    var input = document.createElement('input');
    input.classList.add('mdl-textfield__input');
    input.setAttribute('type', setting.password ? 'password' : 'text');
    input.setAttribute('name', sectionName + '-' + settingName);
    input.id = sectionName + '-' + settingName;
    input.setAttribute('value', setting.value);
    if (setting.editable === false)
        input.setAttribute('disabled', 'disabled');

    componentHandler.upgradeElement(input);
    divContent.appendChild(input);

    var label = document.createElement('label');
    label.classList.add('mdl-textfield__label');
    label.setAttribute('for', input.id);
    label.textContent = settingName;
    label.id = 'label-' + sectionName + '-' + settingName;
    componentHandler.upgradeElement(label);
    divContent.appendChild(label);
    //add an i with ?
    if (setting.description) {
        var tooltip = document.createElement('span');
        tooltip.classList.add('mdl-tooltip');
        tooltip.setAttribute('data-mdl-for', 'label-' + sectionName + '-' + settingName);
        tooltip.textContent = setting.description;
        componentHandler.upgradeElement(tooltip);
        divContent.appendChild(tooltip);
    }

    componentHandler.upgradeElement(divContent);
    return divContent;

};

InterfaceNotifier.prototype.createSensorEditCard_ = function (node) {
    var oldcontainer = document.querySelector('#sensordetails div#sensordetailscontainer');
    var containerparent = oldcontainer.parentNode;
    var container = oldcontainer.cloneNode(false);
    componentHandler.upgradeElement(container);
    containerparent.replaceChild(container, oldcontainer);

    var detailCardTemplate = document.querySelector('section#templates #sensordetailstemplate');
    detailCard = detailCardTemplate.cloneNode(true);
    detailCard.id = 'sensordetails' + node._id;

    var nodetitle = detailCard.querySelector('#sensordetailtitle');
    nodetitle.textContent = node.label || node.descr || '';
    var nodelabel = detailCard.querySelector('#nodelabel');
    nodelabel.value = node.label || '';
    componentHandler.upgradeElement(nodelabel);
    this.reinitialixeTextFieldMDL(nodelabel.parentNode);

    var agoObject = ago(node.updated);
    var nodeupdated = detailCard.querySelector('#sensordetailupdated');
    nodeupdated.textContent = agoObject.text;
    nodeupdated.style.color = agoObject.color;
    nodeupdated.setAttribute('data-time', node.updated)

    var nodedescr = detailCard.querySelector('#nodedescr');
    nodedescr.value = node.descr || '';
    componentHandler.upgradeElement(nodedescr);
    this.reinitialixeTextFieldMDL(nodedescr.parentNode);

    var nodeMoteType = detailCard.querySelector('#nodeMoteType');
    nodeMoteType.value = node.type || '';
    componentHandler.upgradeElement(nodeMoteType);
    this.reinitialixeTextFieldMDL(nodeMoteType.parentNode);

    //Node image
    var icon = node.type != undefined ? this.Definitions_.motesDef[node.type].icon || '' : '';

    var svgUseCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseCardTitle.setAttributeNS(
        'http://www.w3.org/1999/xlink', // xlink NS URI
        'href',                         // attribute (no 'xlink:')
        '#' + icon);
    componentHandler.upgradeElement(svgUseCardTitle);
    var nodeIcon = detailCard.querySelector('#sensordetailsvg');
    nodeIcon.appendChild(svgUseCardTitle);

    var nodeSave = detailCard.querySelector('#nodeSave');

    var objNode = {
        handleEvent: function (e) {
            var node = this.iNotifier.Toggles_.nodes[this.data.nodeId];
            node.label = nodelabel.value;
            node.descr = nodedescr.value;
            node.type = nodeMoteType.value;
            if (node.label.trim() == '' || node.label == this.iNotifier.Definitions_.motesDef[node.type])
                node.label = node.type ? this.iNotifier.Definitions_.motesDef[node.type].label : node.label;
            aiController.UpdateNode(node);
        },
        data: { nodeId: node._id },
        iNotifier: this,
    };
    nodeSave.addEventListener(this.clickEvent, objNode);

    //Node Actions
    var nodeHidden = detailCard.querySelector('#nodeHidden');
    if (node.hidden) {
        nodeHidden.classList.add('mdl-button--accent');
        nodeHidden.classList.remove('mdl-button--colored');
    }

    var objHidden = {
        handleEvent: function (e) {
            var node = this.iNotifier.Toggles_.nodes[this.data.nodeId];
            node.hidden = e.target.parentNode.classList.contains('mdl-button--colored') ? 1 : 0;
            aiController.UpdateNode(node);
        },
        data: { nodeId: node._id },
        iNotifier: this,
    };
    nodeHidden.addEventListener(this.clickEvent, objHidden);

    var nodeDelete = detailCard.querySelector('#nodeDelete');
    var objNDelete = {
        handleEvent: function (e) {
            this.iNotifier.Toggles_.nodes[this.data.nodeId] = undefined;
            var nodeCardDelete = document.querySelector('#sensor' + this.data.nodeId);
            nodeCardDelete.parentNode.removeChild(nodeCardDelete);
            aiController.DeleteNode(this.data);
        },
        data: { nodeId: node._id },
        iNotifier: this,
    };
    nodeDelete.addEventListener(this.clickEvent, objNDelete);

    if (this.Definitions_.motesDef[node.type] && this.Definitions_.motesDef[node.type].controls) {
        var nodeCommands = document.createElement('div');
        nodeCommands.classList.add('mdl-card__actions');
        for (var cKey in this.Definitions_.motesDef[node.type].controls) {
            var control = this.Definitions_.motesDef[node.type].controls[cKey];
            if (control.showCondition) {
                var f = eval('(' + control.showCondition + ')'); //using eval is generally a bad idea but there is no way to pass functions in JSON via websockets so we pass them as strings instead
                if (!f(node)) continue;
            }
            var linkControl = this.createActionControl(node, control, cKey);
            nodeCommands.appendChild(linkControl);
        }
        componentHandler.upgradeElement(nodeCommands);
        detailCard.appendChild(nodeCommands);
    }

    componentHandler.upgradeElement(detailCard);
    container.appendChild(detailCard)

    var metricTemplate = document.querySelector('section#templates #sensormetrictemplate');
    if (node.metrics != null) {
        var metricseparator = document.createElement('div');
        metricseparator.classList.add('mdl-cell--12-col');
        container.appendChild(metricseparator);


        for (var key in node.metrics) {
            var metric = node.metrics[key];
            var metricCard = metricTemplate.cloneNode(true);
            metricCard.id = 'sensormetric-' + key;
            // var title = metricCard.querySelector('#sensormetrictitle')
            // title.textContent = metric.label || 'Metric details';
            // title.id = 'sensormetrictitle-' + key;
            var agoMetricObject = ago(metric.updated);
            var metricupdated = metricCard.querySelector('#sensormetricupdated');
            metricupdated.id = 'sensormetricupdated-' + key;
            metricupdated.textContent = agoMetricObject.text;
            metricupdated.style.color = agoMetricObject.color;
            metricupdated.setAttribute('data-time', metric.updated)

            var label = metricCard.querySelector('#sensormetriclabel');
            label.value = metric.label || '';
            label.id = 'sensormetriclabel-' + key;
            componentHandler.upgradeElement(label);
            this.reinitialixeTextFieldMDL(label.parentNode);

            var value = metricCard.querySelector('#sensormetricvalue');
            value.value = metric.value + (metric.unit || '');
            value.id = 'sensormetricvalue-' + key
            componentHandler.upgradeElement(value);
            value.setAttribute('disabled', 'disabled');
            this.reinitialixeTextFieldMDL(value.parentNode);

            var metricSave = metricCard.querySelector('#metricSave');
            metricSave.id += key;
            var objLabel = {
                handleEvent: function (e) {
                    var metric = this.iNotifier.Toggles_.nodes[this.data.nodeId].metrics[this.data.key];
                    if (metric != undefined) {
                        var metricLabel = container.querySelector('#sensormetriclabel-' + this.data.key);
                        metric.label = metricLabel.value;
                        var obj = { nodeId: this.data.nodeId, key: this.data.key, metric: metric }
                        aiController.UpdateMetric(obj);
                    }
                },
                data: { nodeId: node._id, key: key },
                iNotifier: this,
            };
            metricSave.addEventListener(this.clickEvent, objLabel);

            var metricPin = metricCard.querySelector('#metricPin');
            if (metric.pin == null)
                metricPin.parentNode.removeChild(metricPin);
            else {
                metricPin.id += key;
                if (metric.pin == '1') {
                    metricPin.classList.add('mdl-button--accent');
                    metricPin.classList.remove('mdl-button--colored');
                }

                //Add Pin Event
                var objPin = {
                    handleEvent: function (e) {
                        var metric = this.iNotifier.Toggles_.nodes[this.data.nodeId].metrics[this.data.key];
                        if (metric != undefined) {
                            metric.pin = e.target.parentNode.classList.contains('mdl-button--colored') ? 1 : 0;
                            var obj = { nodeId: this.data.nodeId, key: this.data.key, metric: metric }
                            aiController.UpdateMetric(obj);
                        }
                    },
                    data: { nodeId: node._id, key: key },
                    iNotifier: this,
                };
                metricPin.addEventListener(this.clickEvent, objPin);
            }


            var metricGraph = metricCard.querySelector('#metricGraph');
            if (metric.graph == null)
                metricGraph.parentNode.removeChild(metricGraph);
            else {
                metricGraph.id += key;
                if (metric.graph == 1) {
                    metricGraph.classList.add('mdl-button--accent');
                    metricGraph.classList.remove('mdl-button--colored');
                }
                //Add graph Event
                var objGraph = {
                    handleEvent: function (e) {
                        var metric = this.iNotifier.Toggles_.nodes[this.data.nodeId].metrics[this.data.key];
                        if (metric != undefined) {
                            metric.graph = e.target.parentNode.classList.contains('mdl-button--colored') ? 1 : 0;
                            var obj = { nodeId: this.data.nodeId, key: this.data.key, metric: metric }
                            aiController.UpdateMetric(obj);
                        }
                    },
                    data: { nodeId: node._id, key: key },
                    iNotifier: this,
                };
                metricGraph.addEventListener(this.clickEvent, objGraph);
            }
            var metricDelete = metricCard.querySelector('#metricDelete');
            metricDelete.id += key;
            //Add graph Event
            var objMDelete = {
                handleEvent: function (e) {
                    this.iNotifier.Toggles_.nodes[this.data.nodeId].metrics[this.data.key] = undefined;
                    var metricCardDelete = container.querySelector('#sensormetric-' + this.data.key);
                    metricCardDelete.parentNode.removeChild(metricCardDelete);
                    aiController.DeleteMetric(this.data);
                },
                data: { nodeId: node._id, key: key },
                iNotifier: this,
            };
            metricDelete.addEventListener(this.clickEvent, objMDelete);

            componentHandler.upgradeElement(metricCard);

            container.appendChild(metricCard);
        }
    }

    if (node.events != null) {
        var eventCardTemplate = document.querySelector('section#templates #sensorevensttemplate');
        var eventCard = eventCardTemplate.cloneNode(true);
        container.appendChild(eventCard);

        var eventsContainer = eventCard.querySelector('ul');
        var eventTemplate = document.querySelector('section#templates #eventTemplate');
        var eventsList = document.querySelectorAll('#eventsList li input');
        eventsList.forEach(function (input) {
            input.checked = false;
            input.parentNode.classList.remove('is-checked');
        });
        for (var key in node.events) {
            var evt = this.Definitions_.eventsDef[key];
            var enabled = node.events[key];
            if (!evt) continue;
            var eventLi = eventTemplate.cloneNode(true);
            eventLi.id = 'sensorevent-' + key;
            var evtTitle = eventLi.querySelector('#eventLabel');
            evtTitle.textContent = evt.label;
            var evtSubTitle = eventLi.querySelector('#eventDescription');
            evtSubTitle.textContent = evt.descr || '&nbsp;';

            var enableEvent = eventLi.querySelector('#eventEnable');
            enableEvent.id += key;
            enableEvent.parentNode.setAttribute('for', enableEvent.id);
            // enableEvent.setAttribute('checked',enabled);
            enableEvent.checked = enabled;

            var enabledDefEvent = document.querySelector('#eventDefEnable'+key);
            enabledDefEvent.checked = true;
            enabledDefEvent.parentNode.classList.add('is-checked');

            //add event on click
            var objEvent = {
                handleEvent: function (e) {
                    var event = { nodeId: this.data.nodeId, key: this.data.key, enabled: e.target.checked }
                    aiController.EnableEvent(event);
                },
                data: { nodeId: node._id, key: key },
            };
            enableEvent.addEventListener(this.clickEvent, objEvent);

            this.reinitialixeTextFieldMDL(enableEvent.parentNode);
            componentHandler.upgradeElement(enableEvent);
            // deleteEvent = eventLi.querySelector('#eventDelete');
            // deleteEvent.id+=key;
            // componentHandler.upgradeElement(deleteEvent);


            componentHandler.upgradeElement(eventLi);

            eventsContainer.appendChild(eventLi);
        }
    }
};

// InterfaceNotifier.prototype.createEditCard_ = function (node) {
//     var divCard = document.createElement('div');
//     divCard.classList.add('mdl-card', 'mdl-shadow--2dp', 'mdl-cell', 'mdl-cell--12-col');//'demo-updates', 
//     // divCard.id = 'sensor' + node._id;

//     var divCardTitle = this.createEditCardTitle_(node);
//     componentHandler.upgradeElement(divCardTitle);
//     divCard.appendChild(divCardTitle);
//     return divCard;
// };
// InterfaceNotifier.prototype.createEditCardTitle_ = function (node) {

//     //Card Title
//     var divCardTitle = document.createElement('div');
//     divCardTitle.classList.add('mdl-card__title'); //, 'mdl-card--expand' , 'mdl-color--accent', 'mdl-color-text--white'

//     var h2CardTitle = document.createElement('h3');

//     var divCardTitleText = document.createElement('div');
//     divCardTitleText.classList.add('mdl-card__title-text', 'mdl-color-text--primary-contrast');
//     divCardTitleText.textContent = node.label;
//     componentHandler.upgradeElement(divCardTitleText);
//     h2CardTitle.appendChild(divCardTitleText);

//     // var divCardSubtitleText = document.createElement('div');
//     // divCardSubtitleText.classList.add('mdl-card__subtitle-text', 'mdl-color-text--primary-contrast');
//     // divCardSubtitleText.textContent = node.descr || ' ';
//     // componentHandler.upgradeElement(divCardSubtitleText);
//     // h2CardTitle.appendChild(divCardSubtitleText);

//     componentHandler.upgradeElement(h2CardTitle);
//     divCardTitle.appendChild(h2CardTitle)

//     // divCardTitle.appendChild(this.createSpacer_());

//     // var svgCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');// document.createElement('svg');
//     // svgCardTitle.setAttribute('fill', 'currentColor');
//     // svgCardTitle.setAttribute('viewBox', '0 0 76 76');
//     // svgCardTitle.setAttribute('width', '76');
//     // svgCardTitle.setAttribute('height', '76');
//     // svgCardTitle.classList.add('mdl-color-text--primary'); //mdl-color--primary
//     // // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

//     // var icon = node.type != undefined ? this.Definitions_.motesDef[node.type].icon || '' : ''
//     // var svgUseCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
//     // svgUseCardTitle.setAttributeNS(
//     //     'http://www.w3.org/1999/xlink', // xlink NS URI
//     //     'href',                         // attribute (no 'xlink:')
//     //     '#' + icon);

//     // componentHandler.upgradeElement(svgCardTitle);
//     // componentHandler.upgradeElement(svgUseCardTitle);
//     // svgCardTitle.appendChild(svgUseCardTitle);
//     // divCardTitle.appendChild(svgCardTitle);

//     return divCardTitle;
// };
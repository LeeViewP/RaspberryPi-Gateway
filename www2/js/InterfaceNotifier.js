function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n); //http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844
}


function InterfaceNotifier() {
    'use strict';
}

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
    console.log('Socket Connected!');
    navigationPage.locknavigation(true);
    // LOG('Connected!');
    // $('#loadingSocket').html('<span style="color:#2d0">Connected!</span><br/><br/>Waiting for data..');
};

InterfaceNotifier.prototype.disconnected = function (node) {
    'use strict';
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

InterfaceNotifier.prototype.updateNode = function (node) {
    'use strict';
    // console.log('refresh node' + JSON.stringify(node));
    // // updateNode(entry);
    // // refreshNodeListUI();
    var existingCard = document.querySelector('#sensorspage div#sensor' + node._id);
    var newCard = this.createSensorCard_(node);

    if (node.hidden)
        if (showHiddenNodes)
            newCard.addClass('hiddenNodeShow');
        else
            newCard.addClass('hiddenNode');
    if (existingCard!=null)
        document.querySelector('#sensorspage').replaceChild(newCard, existingCard);
    else
        document.querySelector('#sensorspage').appendChild(newCard)
    
    
    //   if (node._id == selectedNodeId) refreshNodeDetails(node);
};

InterfaceNotifier.prototype.updateNodes = function (nodes) {
    'use strict';
    for (var i = 0; i < nodes.length; ++i) {
        this.updateNode(nodes[i]);
    }
    navigationPage.locknavigation(false);
    navigationPage.navigate('#dashboard');
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
    // motesDef = motesDefinition;
    // $("#nodeMoteType").empty();
    // $('#nodeMoteType').append('<option value="">Select type...</option>');
    // for (var mote in motesDef)
    //     $('#nodeMoteType').append('<option value="' + mote + '">' + motesDef[mote].label || mote + '</option>');
    // $("#nodeMoteType").selectmenu();
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
    for (var sectionName in this.Definitions_.settingsDef) {
        var sectionSettings = this.Definitions_.settingsDef[sectionName];
        if (!sectionSettings.exposed) continue;
        // var sectionLI = $('<li data-role="list-divider">' + sectionName + '</li>');
        // $('#settingsList').append(sectionLI);

        for (var settingName in sectionSettings) {
            var setting = sectionSettings[settingName];
            if (setting.exposed === false) continue;
            if (setting.value == undefined) continue;

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
            // $('#settingsList').append(settingLI);
        }
    }

    // $('#settingsList').listview().listview('refresh').trigger("create");
    this.Definitions_.boundSettings = Bind(this.Definitions_.settingsDef, this.Definitions_.settingsDefBindMap);
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
InterfaceNotifier.prototype.createSensorCard_ = function (node) {
    'use strict';
    // Your code here...
    if (isNumeric(node._id)) {

        var divCard = document.createElement('div');
        divCard.classList.add('demo-updates', 'mdl-card', 'mdl-shadow--2dp', 'mdl-cell', 'mdl-cell--4-col', 'mdl-cell--4-col-tablet', 'AIHome-smartThermostat');
        divCard.id = 'sensor' + node._id;

        //Card Title
        var divCardTitle = document.createElement('div');
        divCardTitle.classList.add('mdl-card__title', 'mdl-card--expand', 'mdl-color--cyan-300');

        var h2CardTitle = document.createElement('h2');
        h2CardTitle.classList.add('mdl-card__title-text');
        h2CardTitle.textContent = node.label;

        // componentHandler.upgradeElement(h2CardTitle);
        divCardTitle.appendChild(h2CardTitle);

        var separatorTitle = document.createElement('div');
        separatorTitle.classList.add('mdl-layout-spacer');
        divCardTitle.appendChild(separatorTitle);

        //<div class="mdl-layout-spacer"></div>
        var svgCardTitle = document.createElementNS('http://www.w3.org/2000/svg','svg');// document.createElement('svg');
        svgCardTitle.setAttribute('fill','currentColor');
        svgCardTitle.setAttribute('viewBox','0 0 76 76');
        svgCardTitle.setAttribute('width','100');
        svgCardTitle.setAttribute('height','100');
        // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

        var svgUseCardTitle =document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
        svgUseCardTitle.setAttributeNS(
            'http://www.w3.org/1999/xlink', // xlink NS URI
            'href',                         // attribute (no 'xlink:')
            '#'+this.Definitions_.motesDef[node.type].icon); 
        // svgUseCardTitle.setAttribute('xlink:href','#chart');

        
        svgCardTitle.appendChild(svgUseCardTitle);
        divCardTitle.appendChild(svgCardTitle);

        // <svg fill="currentColor" viewBox="0 0 500 250" class="demo-graph">
        //     <use xlink:href="#chart" />
        // </svg>
        


        //Card supporting text
        var divCardSupportingText = document.createElement('div');
        divCardSupportingText.classList.add('mdl-card__supporting-text', 'mdl-color-text--grey-600');

        var h3CardSupportingText = document.createElement('span');
        h3CardSupportingText.textContent = node.descr;

        divCardSupportingText.appendChild(h3CardSupportingText);


        //Card Actions
        var divCardActions = document.createElement('div');
        divCardActions.classList.add('mdl-card__actions', 'mdl-card--border');

        var linkCardActions = document.createElement('a');
        linkCardActions.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect');
        linkCardActions.textContent = 'EDIT SENSOR';
        linkCardActions.setAttribute('href', "#");

        // componentHandler.upgradeElement(linkCardActions);
        divCardActions.appendChild(linkCardActions);

        //Adding created elements to card
        // componentHandler.upgradeElement(divCardTitle);
        divCard.appendChild(divCardTitle);

        // componentHandler.upgradeElement(divCardSupportingText);
        divCard.appendChild(divCardSupportingText);

        // componentHandler.upgradeElement(divCardActions);
        divCard.appendChild(divCardActions);

        componentHandler.upgradeElement(divCard);

        return divCard;

        // <div class="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet " id='sensor2'>
        //   <div class="mdl-card__title mdl-card--expand mdl-color--cyan-300">
        //     <h2 class="mdl-card__title-text">Updates Cloned</h2>
        //   </div>
        //   <div class="mdl-card__supporting-text mdl-color-text--grey-600">
        //     Non dolore elit adipisicing ea reprehenderit consectetur culpa.
        //   </div>
        //   <div class="mdl-card__actions mdl-card--border">
        //     <a href="#" class="mdl-button mdl-js-button mdl-js-ripple-effect">Read More</a>
        //   </div>
        // </div>
        //   nodes[node._id] = node;
        //   var nodeValue = metricsValues(node.metrics);
        //   var lowBat = node.metrics != null ? node.metrics.V != null : false //&& node.metrics.V.value < 3.55 : false;
        //   var newLI = $('<li id="' + node._id + '"><a node-id="' + node._id + '" href="#nodedetails" class="nodedetails"><img class="productimg" src="images/' + getNodeIcon(node) + '"><h2>' 
        //   + (nodeResolveString(node.label, node.metrics) || node._id) + ' ' +
        //     resolveRSSIImage(node.rssi) + ' ' +
        //     (lowBat ? resolveBatteryImage(node.metrics.V.value) : '') +
        //     ago(node.updated, 0).tag + (node.hidden ? ' <img class="listIcon20px" src="images/appbar.eye.hide.svg" />' : '') + 
        //     '</h2><p>' +
        //     (nodeResolveString(node.descr, node.metrics) || '&nbsp;') + '</p>' +
        //     (nodeValue ? '<span class="ui-li-count ui-li-count16">' + nodeValue + '</span>' : '') +

        //     '</a></li>');

    }
};


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
    if (existingCard != null)
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
        divCard.classList.add('mdl-card', 'mdl-shadow--2dp', 'mdl-cell', 'mdl-cell--4-col', 'mdl-cell--4-col-tablet');//'demo-updates', 
        divCard.id = 'sensor' + node._id;
        var divCardTitle = this.createCardTitle_(node);
        componentHandler.upgradeElement(divCardTitle);
        divCard.appendChild(divCardTitle);

        var divCardMedia = this.createCardMedia_(node);
        componentHandler.upgradeElement(divCardMedia);
        divCard.appendChild(divCardMedia);

        var divCardSupportingText = this.createCardSupportingText_(node);
        componentHandler.upgradeElement(divCardSupportingText);
        divCard.appendChild(divCardSupportingText);

        var divCardActions = this.createCardActions_(node);
        componentHandler.upgradeElement(divCardActions);
        divCard.appendChild(divCardActions);

        var divCardMenuButton = this.createCardMenuButton_(node);
        componentHandler.upgradeElement(divCardMenuButton);
        divCard.appendChild(divCardMenuButton);

        var divCardMenu = this.createCardMenu_(node);
        // componentHandler.upgradeElement(divCardMenu);
        divCard.appendChild(divCardMenu);
        componentHandler.upgradeElement(divCardMenu);

        componentHandler.upgradeElement(divCard);

        return divCard;
        // //Card Title Alarma
        // var divCardTitle = document.createElement('div');
        // divCardTitle.classList.add('mdl-card__title', 'mdl-card--expand', 'mdl-color--cyan-300');

        // var h2CardTitle = document.createElement('h2');
        // h2CardTitle.classList.add('mdl-card__title-text');
        // h2CardTitle.textContent = node.label;

        // componentHandler.upgradeElement(h2CardTitle);
        // divCardTitle.appendChild(h2CardTitle);

        // var separatorTitle = document.createElement('div');
        // separatorTitle.classList.add('mdl-layout-spacer');
        // componentHandler.upgradeElement(separatorTitle);

        // divCardTitle.appendChild(separatorTitle);

        //<div class="mdl-layout-spacer"></div>
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



        // // ADD button
        // var moreButtonCardTitle = document.createElement('button');
        // moreButtonCardTitle.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-button--icon');
        // moreButtonCardTitle.id = 'morebtn' + node._id;

        // var moreICardTitle = document.createElement('i');
        // moreICardTitle.classList.add('material-icons');
        // moreICardTitle.textContent = 'more_vert';
        // componentHandler.upgradeElement(moreICardTitle);
        // moreButtonCardTitle.appendChild(moreICardTitle);
        // componentHandler.upgradeElement(moreButtonCardTitle);
        // divCardTitle.appendChild(moreButtonCardTitle);

        // var moreULCardTitle = document.createElement('ul');
        // moreULCardTitle.classList.add('mdl-menu', 'mdl-js-menu', 'mdl-js-ripple-effect', 'mdl-menu--bottom-right');
        // moreULCardTitle.setAttribute('for', 'morebtn' + node._id);

        // var editLICardTitle = document.createElement('li');
        // editLICardTitle.classList.add('mdl-menu__item');
        // editLICardTitle.textContent = 'Edit sensor';

        // componentHandler.upgradeElement(editLICardTitle);
        // moreULCardTitle.appendChild(editLICardTitle);
        // divCardTitle.appendChild(moreULCardTitle);
        // componentHandler.upgradeElement(moreULCardTitle);


        // <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
        //     <i class="material-icons">more_vert</i>
        //   </button>
        // <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" for="hdrbtn">
        //   <li class="mdl-menu__item">About</li>
        //   <li class="mdl-menu__item">Contact</li>
        //   <li class="mdl-menu__item">Legal information</li>
        // </ul>

        // svgCardTitle.appendChild(svgUseCardTitle);
        // divCardTitle.appendChild(svgCardTitle);




        // //Card supporting text


        // var divCardSupportingText = document.createElement('div');
        // divCardSupportingText.classList.add('mdl-card__supporting-text', 'mdl-color-text--grey-600');

        // var descriptionContainer = document.createElement('div');
        // descriptionContainer.classList.add('mdl-card__supporting_text_metrics');

        // var spanCardSupportingText = document.createElement('span');
        // spanCardSupportingText.textContent = node.descr || ' ';
        // componentHandler.upgradeElement(spanCardSupportingText);
        // descriptionContainer.appendChild(spanCardSupportingText);

        // var separatorSupportingText = document.createElement('div');
        // separatorSupportingText.classList.add('mdl-layout-spacer');
        // componentHandler.upgradeElement(separatorSupportingText);
        // descriptionContainer.appendChild(separatorSupportingText);


        // //Add RSSI
        // if (node.rssi != undefined) {
        //     console.log("RSSI=" + node.metrics.V.value);
        //     //Has battery metric
        //     var svgCardRssi = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        //     svgCardRssi.setAttribute('fill', 'currentColor');
        //     svgCardRssi.setAttribute('viewBox', '0 0 76 76');
        //     svgCardRssi.setAttribute('width', '18');
        //     svgCardRssi.setAttribute('height', '18');
        //     svgCardRssi.setAttribute('title', "RSSI:" + Math.abs(node.rssi));
        //     // svgCardRssi.classList.add('mdl-color-text--accent');

        //     var svgUseCardRssi = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        //     svgUseCardRssi.setAttributeNS(
        //         'http://www.w3.org/1999/xlink', // xlink NS URI
        //         'href',                         // attribute (no 'xlink:')
        //         '#' + this.resolveRssiImage_(node.rssi));
        //     // mask="url(#piemask)"
        //     componentHandler.upgradeElement(svgCardRssi);
        //     componentHandler.upgradeElement(svgUseCardRssi);

        //     svgCardRssi.appendChild(svgUseCardRssi);
        //     descriptionContainer.appendChild(svgCardRssi);
        // }

        // //Add Battery
        // if (node.metrics != null ? node.metrics.V != null : false) {
        //     console.log("Battery=" + node.metrics.V.value);
        //     //Has battery metric
        //     var svgCardBattery = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        //     svgCardBattery.setAttribute('fill', 'currentColor');
        //     svgCardBattery.setAttribute('viewBox', '0 0 76 76');
        //     svgCardBattery.setAttribute('width', '18');
        //     svgCardBattery.setAttribute('height', '18');
        //     svgCardBattery.setAttribute('title', "Battery:" + Math.abs(node.metrics.V.value));
        //     // svgCardBattery.classList.add('mdl-color-text--accent');

        //     var svgUseCardBattery = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        //     svgUseCardBattery.setAttributeNS(
        //         'http://www.w3.org/1999/xlink', // xlink NS URI
        //         'href',                         // attribute (no 'xlink:')
        //         '#' + this.resolveBatteryImage_(node.metrics.V.value));

        //     componentHandler.upgradeElement(svgCardBattery);
        //     componentHandler.upgradeElement(svgUseCardBattery);
        //     if (node.metrics.V.value < this.Definitions_.minVoltage)
        //         svgCardBattery.classList.add('blink');

        //     svgCardBattery.appendChild(svgUseCardBattery);
        //     descriptionContainer.appendChild(svgCardBattery);
        // }

        // componentHandler.upgradeElement(descriptionContainer);
        // divCardSupportingText.appendChild(descriptionContainer);

        // for (var key in node.metrics) {

        //     var metric = node.metrics[key];
        //     if (metric.pin == '1' || node.metrics.length == 1) {
        //         //var agoText = ago(metric.updated).text;
        //         //metric.value + (metric.unit || '')
        //         var metricContainer = document.createElement('div');
        //         metricContainer.classList.add('mdl-card__supporting_text_metrics');

        //         var metricCardSupportingText = document.createElement('span');
        //         metricCardSupportingText.textContent = metric.descr || metric.label || ' ';
        //         componentHandler.upgradeElement(metricCardSupportingText);
        //         metricContainer.appendChild(metricCardSupportingText);

        //         var separatorMetricSupportingText = document.createElement('div');
        //         separatorMetricSupportingText.classList.add('mdl-layout-spacer');
        //         componentHandler.upgradeElement(separatorMetricSupportingText);
        //         metricContainer.appendChild(separatorMetricSupportingText);

        //         var metricValue = (metric.unit) ? (metric.value + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
        //         var metricValueCardSupportingText = document.createElement('span');
        //         metricValueCardSupportingText.textContent = metricValue;
        //         componentHandler.upgradeElement(metricValueCardSupportingText);
        //         metricContainer.appendChild(metricValueCardSupportingText);

        //         componentHandler.upgradeElement(metricContainer);
        //         divCardSupportingText.appendChild(metricContainer);

        //         // var separatorMetricEndSupportingText = document.createElement('div');
        //         // separatorMetricEndSupportingText.classList.add('mdl-layout-spacer');
        //         // componentHandler.upgradeElement(separatorMetricEndSupportingText);
        //         // divCardSupportingText.appendChild(separatorMetricEndSupportingText);
        //         // label += '<span data-time="' + metric.updated + '" class="nodeMetricAgo" style="color:' + ago(metric.updated).color + '" title="' + agoText + '">' + metricValue + '</span> ';
        //     }
        // }





        // //Card Actions


        // var divCardActions = document.createElement('div');
        // divCardActions.classList.add('mdl-card__actions', 'mdl-card--border');

        // var linkCardActions = document.createElement('a');
        // linkCardActions.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-color-text--accent');
        // linkCardActions.textContent = 'EDIT SENSOR';
        // linkCardActions.setAttribute('href', "#");


        // componentHandler.upgradeElement(linkCardActions);
        // divCardActions.appendChild(linkCardActions);

        // var separatorActions = document.createElement('div');
        // separatorActions.classList.add('mdl-layout-spacer');
        // componentHandler.upgradeElement(separatorActions);
        // divCardActions.appendChild(separatorActions);

        // // SOME IMAGES
        // // <i class="material-icons">location_on</i>
        // var iActions = document.createElement('i');
        // iActions.classList.add('material-icons');
        // iActions.textContent = 'location_on';
        // componentHandler.upgradeElement(iActions);

        // divCardActions.appendChild(iActions);


        // //Adding created elements to card
        // componentHandler.upgradeElement(divCardTitle);
        // divCard.appendChild(divCardTitle);

        // componentHandler.upgradeElement(divCardSupportingText);
        // divCard.appendChild(divCardSupportingText);

        // componentHandler.upgradeElement(divCardActions);
        // divCard.appendChild(divCardActions);

        // componentHandler.upgradeElement(divCard);

        // return divCard;

    }
};

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

InterfaceNotifier.prototype.createCardTitle_ = function (node) {

    //Card Title
    var divCardTitle = document.createElement('div');
    divCardTitle.classList.add('mdl-card__title', 'mdl-color--accent', 'mdl-color-text--white'); //, 'mdl-card--expand'

    var svgCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');// document.createElement('svg');
    svgCardTitle.setAttribute('fill', 'currentColor');
    svgCardTitle.setAttribute('viewBox', '0 0 76 76');
    svgCardTitle.setAttribute('width', '76');
    svgCardTitle.setAttribute('height', '76');
    // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

    var svgUseCardTitle = document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
    svgUseCardTitle.setAttributeNS(
        'http://www.w3.org/1999/xlink', // xlink NS URI
        'href',                         // attribute (no 'xlink:')
        '#' + this.Definitions_.motesDef[node.type].icon);

    componentHandler.upgradeElement(svgCardTitle);
    componentHandler.upgradeElement(svgUseCardTitle);
    svgCardTitle.appendChild(svgUseCardTitle);
    divCardTitle.appendChild(svgCardTitle);


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
    divCardTitleText.classList.add('mdl-card__title-text');
    divCardTitleText.textContent = node.label;
    componentHandler.upgradeElement(divCardTitleText);
    h2CardTitle.appendChild(divCardTitleText);

    var divCardSubtitleText = document.createElement('div');
    divCardSubtitleText.classList.add('mdl-card__subtitle-text');
    divCardSubtitleText.textContent = node.descr || ' ';
    componentHandler.upgradeElement(divCardSubtitleText);
    h2CardTitle.appendChild(divCardSubtitleText);

    componentHandler.upgradeElement(h2CardTitle);
    divCardTitle.appendChild(h2CardTitle)

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
    divCardMedia.classList.add('mdl-card__media', 'mdl-card--expand');


    for (var key in node.metrics) {

        var metric = node.metrics[key];
        if (metric.pin == '1' || node.metrics.length == 1) {
            var metricValue = (metric.unit) ? (metric.value + (metric.unit || '')) : ((metric.descr || metric.name || '') + metric.value);
            var svgMetric = document.createElementNS('http://www.w3.org/2000/svg', 'svg');// document.createElement('svg');
            svgMetric.setAttribute('fill', 'currentColor');
            svgMetric.setAttribute('viewBox', '0 0 76 76');
            svgMetric.setAttribute('width', '76');
            svgMetric.setAttribute('height', '76');
            // svgCardTitle.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

            var svgUseMetric = document.createElementNS('http://www.w3.org/2000/svg', 'use');// document.createElement('use');
            svgUseMetric.setAttributeNS(
                'http://www.w3.org/1999/xlink', // xlink NS URI
                'href',                         // attribute (no 'xlink:')
                '#piechart');
            svgUseMetric.setAttributeNS(
                'http://www.w3.org/1999/xlink', // xlink NS URI
                'mask',                         // attribute (no 'xlink:')
                'url(#piemask)');

            svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            svgText.setAttributeNS(
                'http://www.w3.org/1999/xlink', // xlink NS URI
                'x',                         // attribute (no 'xlink:')
                '0.5');
            svgText.setAttributeNS(
                'http://www.w3.org/1999/xlink', // xlink NS URI
                'y',                         // attribute (no 'xlink:')
                '0.5');
            svgText.setAttributeNS(
                'http://www.w3.org/1999/xlink', // xlink NS URI
                'font-size',                         // attribute (no 'xlink:')
                '0.3');
            svgText.setAttributeNS(
                'http://www.w3.org/1999/xlink', // xlink NS URI
                'text-anchor',                         // attribute (no 'xlink:')
                'middle');
            svgText.setAttributeNS(
                'http://www.w3.org/1999/xlink', // xlink NS URI
                'dy',                         // attribute (no 'xlink:')
                '0.1');
            svgText.textContent = metricValue;
            //     <text x="0.5" y="0.5" font-family="Roboto" font-size="0.3" fill="#888" text-anchor="middle" dy="0.1">82
            //     <tspan dy="-0.07" font-size="0.2">%</tspan>
            //   </text>

            componentHandler.upgradeElement(svgMetric);
            componentHandler.upgradeElement(svgUseMetric);
            componentHandler.upgradeElement(svgText);
            svgMetric.appendChild(svgUseMetric);
            svgMetric.appendChild(svgText);
            divCardMedia.appendChild(svgMetric);

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
    componentHandler.upgradeElement(divCardMedia);
    return divCardMedia;
}

InterfaceNotifier.prototype.createCardSupportingText_ = function (node) {
    //Card supporting text
    var divCardSupportingText = document.createElement('div');
    divCardSupportingText.classList.add('mdl-card__supporting-text', 'mdl-color-text--grey-600');

    var descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('mdl-card__supporting_text_metrics');

    // var spanCardSupportingText = document.createElement('span');
    // spanCardSupportingText.textContent = node.descr || ' ';
    // componentHandler.upgradeElement(spanCardSupportingText);
    // descriptionContainer.appendChild(spanCardSupportingText);

    var separatorSupportingText = document.createElement('div');
    separatorSupportingText.classList.add('mdl-layout-spacer');
    componentHandler.upgradeElement(separatorSupportingText);
    descriptionContainer.appendChild(separatorSupportingText);


    //Add RSSI
    if (node.rssi != undefined) {
        console.log("RSSI=" + node.metrics.V.value);
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
    divCardActions.classList.add('mdl-card__actions', 'mdl-card--border');

    var linkCardActions = document.createElement('a');
    linkCardActions.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-color-text--accent');
    linkCardActions.textContent = 'EDIT SENSOR';
    linkCardActions.setAttribute('href', "#");


    componentHandler.upgradeElement(linkCardActions);
    divCardActions.appendChild(linkCardActions);

    var separatorActions = document.createElement('div');
    separatorActions.classList.add('mdl-layout-spacer');
    componentHandler.upgradeElement(separatorActions);
    divCardActions.appendChild(separatorActions);

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
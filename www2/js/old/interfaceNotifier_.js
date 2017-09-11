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
    //Toggles
    selectedNodeId: null,    //points to the selected node ID
    selectedMetricKey: null, //points to the selected metric name of the selected node
    selectedSchedulePeriod: null,
    selectedScheduleDay: (new Date()).getDay(),
    showHiddenNodes: false,
    showRawSend: false,
};

InterfaceNotifier.prototype.connected = function (node) {
    'use strict';
    console.log('Socket Connected!');
};
InterfaceNotifier.prototype.disconnected = function (node) {
    'use strict';
    console.log('Socket disconnected!');
};

InterfaceNotifier.prototype.updateNode = function (node) {
    'use strict';
    // Your code here...
    // console.log(this.Constant_.SPECIAL_WORD + ' is cool!');
    console.log('refresh node' + JSON.stringify(node));
};
InterfaceNotifier.prototype.updateNodes = function (nodes) {
    'use strict';
    for (var i = 0; i < nodes.length; ++i) {
        this.updateNode(nodes[i]);
    }
};
InterfaceNotifier.prototype.updateThermostatSchedule = function (node) {
    'use strict';
    console.log('updateThermostatSchedule:' + JSON.stringify(node));
};

InterfaceNotifier.prototype.updateMotesDefinition = function (motesDefinition) {
    'use strict';
    this.Definitions_.motesDef = motesDefinition;
    console.log('MotesDefinition Connected!');
};
InterfaceNotifier.prototype.updateComfortTypesDefinition = function (comfortTypesDefinition) {
    'use strict';
    this.Definitions_.comfortTypesDef = comfortTypesDefinition
    console.log('ComfortTypesDefinition Connected!');
};
InterfaceNotifier.prototype.updateMetricsDefinition = function (metricsDefinition) {
    'use strict';
    this.Definitions_.metricsDef = metricsDefinition;
    console.log('MetricsDefinition Connected!');
};
InterfaceNotifier.prototype.updateEventsDefinition = function (eventsDefinition) {
    'use strict';
    this.Definitions_.eventsDef = eventsDefinition;
    console.log('EventsDefinition Connected!');
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
};



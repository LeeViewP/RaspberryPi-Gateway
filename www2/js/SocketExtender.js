
function SocketExtender(socket, interfaceNotifier) {
    'use strict';
    this.initializeSocket(socket, interfaceNotifier);
    return this;
}

SocketExtender.prototype.initializeSocket = function (socket, interfaceNotifier) {
    'use strict';

    socket.on('connect', function () {
        interfaceNotifier.connected();
    });

    socket.on('disconnect', function () {
        interfaceNotifier.disconnected();
    });

    socket.on('UPDATENODE', function (entry) {
        interfaceNotifier.updateNode(entry);
    });

    socket.on('UPDATESMARTTERMOSTATSCHEDULE', function (entry) {
        interfaceNotifier.updateThermostatSchedule(entry);
    });

    socket.on('UPDATENODES', function (entries) {
        interfaceNotifier.updateNodes(entries);
    });

    socket.on('MOTESDEF', function (motesDefinition) {
        interfaceNotifier.updateMotesDefinition(motesDefinition);
    });

    socket.on('COMFORTTYPESDEF', function (comfortTypesDefinition) {
        interfaceNotifier.updateComfortTypesDefinition(comfortTypesDefinition);
    });

    socket.on('METRICSDEF', function (metricsDefinition) {
        interfaceNotifier.updateMetricsDefinition(metricsDefinition);
    });

    socket.on('EVENTSDEF', function (eventsDefinition) {
        interfaceNotifier.updateEventsDefinition(eventsDefinition);
    });

    socket.on('SETTINGSDEF', function (newSettingsDef) {
        interfaceNotifier.updateSettingsDefinition(newSettingsDef);
    });
};


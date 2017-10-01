
function SocketExtender(socket, interfaceNotifier) {
    'use strict';
    this.Socket = socket;
    this.initializeSocket(socket, interfaceNotifier);
    return this;
}

SocketExtender.prototype.Socket = null;

SocketExtender.prototype.initializeSocket = function (socket, interfaceNotifier) {
    'use strict';


    socket.on('connect', function () {
        interfaceNotifier.connected();
    });

    socket.on('disconnect', function () {
        interfaceNotifier.disconnected();
    });

    socket.on('connect_error', function (error) {
        interfaceNotifier.error(error);
    });
    socket.on('reconnect_error', function (error) {
        interfaceNotifier.error(error);
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
    socket.on('SERVERTIME', function (serverMillisSinceEpoch) {
        aiController.serverTimeOffset = Date.now() - serverMillisSinceEpoch;
        // LOG('SERVERTIME OFFSET: ' + serverTimeOffset + 'ms');
    });
    socket.on('SERVERSTARTTIME', function (serverMillisSinceProcessStart) {
        interfaceNotifier.setServerUpTime(serverMillisSinceProcessStart + aiController.serverTimeOffset);
      });
    socket.on('GRAPHDATAREADY', function (rawData) {
         interfaceNotifier.graphDataReady(rawData);
    });
    
};

SocketExtender.prototype.ControlClick = function (data) {
    this.Socket.emit("CONTROLCLICK", { nodeId: data.nodeId, action: data.action, nodeType: data.nodeType, controlKey: data.cKey, stateKey: data.sKey });
};

SocketExtender.prototype.DialogAction = function (action) {
    this.Socket.emit(action);
};

SocketExtender.prototype.UpdateSettings = function (boundSettings) {
    this.Socket.emit('UPDATESETTINGSDEF', boundSettings);
};

SocketExtender.prototype.EnableEvent = function (event) {
    this.Socket.emit('EDITNODEEVENT', event.nodeId, event.key, event.enabled, event.remove);
};

SocketExtender.prototype.UpdateMetric = function (metricObject) {
    this.Socket.emit('UPDATEMETRICSETTINGS', metricObject.nodeId, metricObject.key, metricObject.metric);
};

SocketExtender.prototype.DeleteMetric = function (nodeObject) {
    this.Socket.emit('DELETENODEMETRIC', nodeObject.nodeId, nodeObject.key);
};

SocketExtender.prototype.UpdateNode = function (nodeObject) {
    this.Socket.emit('UPDATENODESETTINGS', nodeObject);
};

SocketExtender.prototype.DeleteNode = function (nodeObject) {
    this.Socket.emit('DELETENODE', nodeObject.nodeId);
};
SocketExtender.prototype.EditNodeSchedule = function (schedule) {
    this.Socket.emit('EDITNODESCHEDULE', schedule.selectedNodeId, schedule.selectedScheduleDay, schedule.selectedSchedulePeriod,
        schedule.scheduleObject, schedule.remove);
};

SocketExtender.prototype.GetGraphData = function (graphObject) {
    this.Socket.emit('GETGRAPHDATA', graphObject.NodeId, graphObject.MetricKey, graphObject.starTime, graphObject.endTime);
};



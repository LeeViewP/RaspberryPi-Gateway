/// calculated a style for an "ago" label based on a given timestamp in the past
function ago(time, agoPrefix) {
    agoPrefix = (typeof agoPrefix !== 'undefined') ? agoPrefix : true;
    var now = new Date().getTime() - aiController.serverTimeOffset;
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

    return { text: updated, color: theColor };// tag: '<span data-time="' + time + '" class="nodeAgo" style="color:' + theColor + ';">' + updated + '</span>'
}

/// updates the "ago" labels text and color according the to elapsed time since the last update timestamp associated with those labels
function updateAgos() {
    document.querySelectorAll('span.updateAgo').forEach(function (element) {
        var timestamp = parseInt(element.getAttribute('data-time'));
        var agoObject = ago(timestamp);
        element.style.color = agoObject.color;
        element.textContent = agoObject.text;
    });
    document.querySelectorAll('span.upAgo').forEach(function (element) {
        var timestamp = parseInt(element.getAttribute('data-time'));
        var agoObject = ago(timestamp, false);
        element.style.color = agoObject.color;
        element.textContent = agoObject.text;
    });
}

function AiController() {
    'use strict';
    this.initialize();
    return this;
}
AiController.prototype.socket = null;

AiController.prototype.serverTimeOffset = null;

AiController.prototype.initialize = function () {
    'use strict';
    this.socket = new SocketExtender(io(), new InterfaceNotifier());
};
AiController.prototype.ControlClick = function (data) {
    this.socket.ControlClick(data);
};

AiController.prototype.DialogAction = function (action) {
    this.socket.DialogAction(action);
}

AiController.prototype.UpdateSettings = function (boundSettings) {
    this.socket.UpdateSettings(boundSettings);
};

AiController.prototype.EnableEvent = function (event) {
    this.socket.EnableEvent(event);
};

AiController.prototype.UpdateMetric = function (metricObject) {
    this.socket.UpdateMetric(metricObject);
};

AiController.prototype.DeleteMetric = function (node) {
    this.socket.DeleteMetric(node);
};

AiController.prototype.UpdateNode = function (nodeObject) {
    this.socket.UpdateNode(nodeObject);
};

AiController.prototype.DeleteNode = function (nodeObject) {
    this.socket.DeleteNode(nodeObject);
};

AiController.prototype.EditNodeSchedule = function (schedule) {
    this.socket.EditNodeSchedule(schedule);
};

AiController.prototype.GetGraphData = function (graphObject) {
    this.socket.GetGraphData(graphObject);
};

var aiController
window.addEventListener('load', function () {
    try {
        aiController = new AiController();

    }
    catch (err) {
        console.error(err.message);
        var notification = document.querySelector('.mdl-js-snackbar');
        notification.MaterialSnackbar.showSnackbar(
            {
                message: 'err.message'
            }
        );
    }

    //refresh "updated X ago" indicators
    var updateAgosTimer = setInterval(updateAgos, 3000);
});







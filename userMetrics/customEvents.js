//exports.getMINMetricInSourceNodes = require(path.resolve(__dirname, 'customFunctions.js')).getMINMetricInSourceNodes;

exports.events = {
    getMinTemperatureFromSourceNodes: {
        label: "Source Nodes: Get Min Temperature",
        icon: "action",
        descr: "Calculate Min Temperature from received Nodes ONLY CALCULATED NODES",
        serverExecute: function (node) {
            if (node.metrics == undefined)
                setTimeout(getMINMetricInSourceNodes, 500, { nodeId: node._id, metric: { name: 'C' } });

            if (node.metrics['MINC']) {
                if ((Date.now() - new Date(node.metrics['MINC'].updated).getTime() > 2000)) {
                    setTimeout(getMINMetricInSourceNodes, 500, { nodeId: node._id, metric: { name: 'C' } });
                    console.log('Node [' + node._id + '] metric executed');
                }
            }
            else {
                setTimeout(getMINMetricInSourceNodes, 500, { nodeId: node._id, metric: { name: 'C' } });
            }
        }
    },
    getAvgTemperatureFromSourceNodes: {
        label: "Source Nodes: Get Avg Temperature",
        icon: "action",
        descr: "Calculate Avg Temperature from received Nodes ONLY CALCULATED NODES",
        serverExecute: function (node) {
            if (node.metrics == undefined)
                setTimeout(getAVGMetricInSourceNodes, 900, { nodeId: node._id, metric: { name: 'C' } });
            if (node.metrics['AVGC']) {
                if ((Date.now() - new Date(node.metrics['AVGC'].updated).getTime() > 2000)) {
                    setTimeout(getAVGMetricInSourceNodes, 900, { nodeId: node._id, metric: { name: 'C' } });
                    console.log('Node [' + node._id + '] C metric executed');
                }
            }
            else {
                setTimeout(getAVGMetricInSourceNodes, 900, { nodeId: node._id, metric: { name: 'C' } });
            }
        }
    },
    getAvgHumidityFromSourceNodes: {
        label: "Source Nodes: Get Avg Humidity",
        icon: "action",
        descr: "Calculate Avg Humidity from received Nodes ONLY CALCULATED NODES",
        serverExecute: function (node) {
            if (node.metrics == undefined)
                setTimeout(getAVGMetricInSourceNodes, 800, { nodeId: node._id, metric: { name: 'H' } });

            if (node.metrics['AVGH']) {
                if ((Date.now() - new Date(node.metrics['AVGH'].updated).getTime() > 2000)) {
                    setTimeout(getAVGMetricInSourceNodes, 800, { nodeId: node._id, metric: { name: 'H' } });
                    console.log('Node [' + node._id + '] H metric executed');
                }
            }
            else {
                setTimeout(getAVGMetricInSourceNodes, 800, { nodeId: node._id, metric: { name: 'H' } });
            }
        }
    },
    getAvgPressureFromSourceNodes: {
        label: "Source Nodes: Get Avg Atmosferic Pressure",
        icon: "action",
        descr: "Calculate Avg Atmosferic Pressure from received Nodes ONLY CALCULATED NODES",
        serverExecute: function (node) {
            if (node.metrics == undefined)
                setTimeout(getAVGMetricInSourceNodes, 700, { nodeId: node._id, metric: { name: 'P' } });
            if (node.metrics['AVGP']) {
                if ((Date.now() - new Date(node.metrics['AVGP'].updated).getTime() > 2000)) {
                    setTimeout(getAVGMetricInSourceNodes, 800, { nodeId: node._id, metric: { name: 'P' } });
                    console.log('Node [' + node._id + '] P metric executed');
                }
            }
            else {
                setTimeout(getAVGMetricInSourceNodes, 700, { nodeId: node._id, metric: { name: 'P' } });
            }
        }
    },
    lowBatteryEmail: {
        label: 'Low Battery : Email',
        icon: 'mail',
        descr: 'Send email when Low Battery is detected',
        serverExecute:
        function (node) {
            if (
                node.metrics['V'] &&
                node.metrics['V'].value < 3.35 &&
                (Date.now() - new Date(node.metrics['V'].updated).getTime() < 2000)
            ) {
                var approveSendMessage = false;
                if (node.metrics['V'].lastMessage) /*check if lastMessage value is not NULL ... */ {
                    if (Date.now() - node.metrics['V'].lastMessage > settings.general.limitLowBatteryMessages.value) /*check if lastMessage timestamp is more than 1hr ago*/ {
                        approveSendMessage = true;
                    }
                }
                else {
                    approveSendMessage = true;
                }
                if (approveSendMessage) {
                    node.metrics['V'].lastMessage = Date.now();
                    sendEmail('LOW BATTERY DETECTED', 'LOW BATTERY [' + node.metrics['V'].value + 'v]  WAS DETECTED ON NODE: [' + node._id + ':' + node.label + '] @ ' + (new Date().toLocaleTimeString() + (new Date().getHours() > 12 ? 'PM' : 'AM')));
                    db.update({ _id: node._id }, { $set: node }, {}, function (err, numReplaced) { console.log('   [' + node._id + '] DB-Updates:' + numReplaced); }); /*save lastMessage timestamp to DB*/
                }
                else console.log('   [' + node._id + '] LOW BATTERY Message skipped.');
            }
        }
    },
    nodeOfflineEmail:
    {
        label: 'Node Offlline : Email',
        icon: 'mail',
        descr: 'Send email when node offline is detected (10 minutes)',
        //Scheduled at 6 minutes
        nextSchedule: function (node) { return 360000; },
        scheduledExecute:
        function (node) {
            if ((Date.now() - new Date(node.updated).getTime() > 3600000)) {
                var ms = Date.now() - new Date(node.updated).getTime();
                var d, h, m, s;
                s = Math.floor(ms / 1000);
                m = Math.floor(s / 60);
                s = s % 60;
                h = Math.floor(m / 60);
                m = m % 60;
                d = Math.floor(h / 24);
                h = h % 24;
                var time = d + " days " + h + " hours " + m + " minutes " + s + " seconds" + "[ DateTimeNow:" + Date.now() + " NodeUpdatedTime:" + new Date(node.updated).getTime() + " DIFF:" + ms + "]";
                sendEmail('NODE OFFLINE DETECTED', 'OFFLINE NODE WAS DETECTED : [' + node._id + ':' + node.label + '] @ ' + (new Date().toLocaleTimeString() + (new Date().getHours() > 12 ? 'PM' : 'AM')) + "Node last updated:" + new Date(node.updated).toLocaleTimeString() + "  TIMEOUT NODE: [" + time + "]");
            };
        }
    },

};
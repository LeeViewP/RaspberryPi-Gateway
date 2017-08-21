
global.exec = require('child_process').exec;
global.path = require('path');
global.dbDir = 'data/db';
global.dbLog = require(path.resolve(__dirname + '/../', 'logUtil.js'));

//Set an server timer for datetime
global.serverDataTime = function (currentTime) {
    currentTime = Date.now();
    //console.log('Currrent Time : ' + currentTime);
    io.sockets.emit('UPDATETIME', currentTime);
    setTimeout(serverDataTime, settings.general.clockUpdateDelay.value, Date.now())
}


global.execute = function (command, callback) {
    exec(command, function (error, stdout, stderr) { callback(stdout); });
}

global.startAdb = function () {
    var sshcommand = 'sudo adb kill-server';
    execute(sshcommand, function (callback) {
        console.log('Kill ADB server[' + callback + ']');
    });
    sshcommand = 'sudo adb start-server';
    execute(sshcommand, function (callback) {
        console.log('Start ADB server [' + callback + ']');
    });
}

global.sendAdbSMS = function (BODY) {
    // startAdb();

    // //SMS
    // adb shell am start -a android.intent.action.SENDTO -d sms:0745545150 --es sms_body 'INTRUDER ALERT' --ez exit_on_sent true
    // adb shell input keyevent 22
    // adb shell input keyevent 66
    var sshcommand = "adb shell am start -a android.intent.action.SENDTO -d sms:" + settings.credentials.adbSmsAlertsTo.value + " --es sms_body '" + BODY + "' --ez exit_on_sent true";
    console.log(sshcommand);
    execute(sshcommand, function (callback) {
        console.log('SMS TO: ' + settings.credentials.adbSmsAlertsTo.value + ' Initiated [' + callback + ']');
        var sshcommand22 = 'adb shell input keyevent 22';
        console.log(sshcommand22);
        execute(sshcommand22, function (callback) {
            console.log('SMS TO: ' + settings.credentials.adbSmsAlertsTo.value + ' Initiated Key press 22 [' + callback + ']');
            var sshcommand66 = 'adb shell input keyevent 66';
            console.log(sshcommand66);
            execute(sshcommand66, function (callback) {
                console.log('SMS TO: ' + settings.credentials.adbSmsAlertsTo.value + ' Initiated Key press 66 [' + callback + ']');
            });
        });
    });



}

global.startAdbCall = function () {
    //startAdb();

    //adb shell am start -a android.intent.action.CALL -d tel:0745545150
    var sshcommand = 'adb shell am start -a android.intent.action.CALL -d tel:' + settings.credentials.adbCallsAlertsTo.value;
    execute(sshcommand, function (callback) {
        console.log('CALL TO: ' + settings.credentials.adbCallsAlertsTo.value + ' Initiated [' + callback + ']');
    });
}



global.updateNodeMetric = function (node) {
    var dbNode = new Object();
    db.find({ _id: node.nodeId }, function (err, entries) {
        if (entries.length == 1) {
            dbNode = entries[0];
        }
        console.log('Received Node [' + node.nodeId + '] with metric[ ' + node.metric.name + '] = ' + node.metric.value);
        dbNode._id = node.nodeId;
        dbNode.updated = new Date().getTime(); //update timestamp we last heard from this node, regardless of any matches
        dbNode.rssi = undefined;
        var matchingMetric = undefined;

        for (var k in metricsDef.metrics) {
            if (metricsDef.metrics[k].name == node.metric.name) {
                matchingMetric = metricsDef.metrics[k];
                break;
            }
        }
        if (matchingMetric == undefined) {
            console.log('Unable to find matching metric for metric: ' + node.metric.name)
            return;
        }

        //matchingMetric = metricsDef.metrics[node.metric];

        if (dbNode.metrics == undefined) dbNode.metrics = new Object();
        if (dbNode.metrics[matchingMetric.name] == null) dbNode.metrics[matchingMetric.name] = new Object();

        dbNode.metrics[matchingMetric.name].label = dbNode.metrics[matchingMetric.name].label || matchingMetric.name;
        dbNode.metrics[matchingMetric.name].descr = dbNode.metrics[matchingMetric.name].descr || matchingMetric.descr || undefined;
        dbNode.metrics[matchingMetric.name].value = node.metric.value;
        dbNode.metrics[matchingMetric.name].unit = dbNode.metrics[matchingMetric.name].unit || matchingMetric.unit || undefined;//dbNode.metrics[matchingMetric.name].unit != undefined ? dbNode.metrics[matchingMetric.name].unit : undefined;
        dbNode.metrics[matchingMetric.name].updated = dbNode.updated;
        dbNode.metrics[matchingMetric.name].pin = dbNode.metrics[matchingMetric.name].pin != undefined ? dbNode.metrics[matchingMetric.name].pin : matchingMetric.pin;
        dbNode.metrics[matchingMetric.name].graph = dbNode.metrics[matchingMetric.name].graph != undefined ? dbNode.metrics[matchingMetric.name].graph : matchingMetric.graph;



        //log data for graphing purposes, keep labels as short as possible since this log will grow indefinitely and is not compacted like the node database
        if (dbNode.metrics[matchingMetric.name].graph == 1) {
            var graphValue = metricsDef.isNumeric(matchingMetric.logValue) ? matchingMetric.logValue : node.metric.value; //existingNode.metrics[matchingMetric.name].value;
            console.log('graphvalue : [' + graphValue + ']');
            if (metricsDef.isNumeric(graphValue)) {
                var ts = Math.floor(Date.now() / 1000); //get timestamp in whole seconds
                var logfile = path.join(__dirname + '/../', dbDir, dbLog.getLogName(dbNode._id, matchingMetric.name));
                try {
                    console.log('post: ' + logfile + '[' + ts + ',' + graphValue + ']');
                    dbLog.postData(logfile, ts, graphValue);
                } catch (err) { console.error('   POST ERROR: ' + err.message); /*console.log('   POST ERROR STACK TRACE: ' + err.stack); */ } //because this is a callback concurrent calls to the same log, milliseconds apart, can cause a file handle concurrency exception
            }
            else console.log('   METRIC NOT NUMERIC, logging skipped... (extracted value:' + graphValue + ')');
        }


        db.findOne({ _id: dbNode._id }, function (err, doc) {
            if (doc == null) {
                db.insert(dbNode);
                console.log('   [' + dbNode._id + '] DB-Insert new _id:' + dbNode._id + ' for ' + node.metric.name);
            }
            else

                db.update({ _id: dbNode._id }, { $set: dbNode }, {}, function (err, numReplaced) { console.log('   [' + dbNode._id + '] DB-Updates:' + numReplaced + ' for ' + node.metric.name); });

            io.sockets.emit('UPDATENODE', dbNode); //post it back to all clients to confirm UI changes
            //handle any server side events (email, sms, custom actions)
            handleNodeEvents(dbNode);
        });

    });

}

global.getMINMetricInSourceNodes = function (node) {
    //var node = {nodeId:1, metric:{}}
    var dbNode = new Object();
    var returnMetric = new Object();
    db.find({ _id: node.nodeId }, function (err, entries) {
        if (entries.length == 1) {
            dbNode = entries[0];
        }

        if (dbNode.sourceNodes != undefined) {
            var minValue = 100;
            var sourceNode;
            for (sourceNode in dbNode.sourceNodes) {
                if (sourceNode != undefined) {
                    // Also check for last 10 minutes nodes
                    if ((Date.now() - new Date(dbNode.sourceNodes[sourceNode].updated)) < 600000) {
                        // console.log('Node [' + dbNode._id + '] [' + sourceNode + '] early than 10 mins');
                        if (dbNode.sourceNodes[sourceNode].metrics != undefined) {
                            // console.log('Node [' + dbNode._id + '] [' + sourceNode + '] metrics defined');
                            if (dbNode.sourceNodes[sourceNode].metrics[node.metric.name] != undefined) {
                                // console.log('Node [' + dbNode._id + '] [' + sourceNode + '] metrics [' + node.metric.name + '] defined');
                                // console.log('Node [' + dbNode._id + '] [' + sourceNode + '] metrics [' + node.metric.name + '] value: ' + dbNode.sourceNodes[sourceNode].metrics[node.metric.name].value + '');
                                if (minValue > dbNode.sourceNodes[sourceNode].metrics[node.metric.name].value) {
                                    console.log('Node [' + dbNode._id + '] [' + sourceNode + '] metrics [' + node.metric.name + '] value: ' + dbNode.sourceNodes[sourceNode].metrics[node.metric.name].value + ' found < ' + minValue);
                                    minValue = dbNode.sourceNodes[sourceNode].metrics[node.metric.name].value;
                                    returnMetric = dbNode.sourceNodes[sourceNode].metrics[node.metric.name]
                                }
                            }
                        }
                    }
                }
            }
        }
        returnMetric.name = 'MIN' + returnMetric.name
        console.log('getMINMetricInSourceNodes: [' + node.nodeId + '] the Node:' + JSON.stringify(dbNode));
        //console.log('getMINMetricInSourceNodes: [' + node.nodeId + ']' + JSON.stringify(returnMetric));
        updateNodeMetric({ nodeId: dbNode._id, metric: returnMetric });
        //return returnMetric;
    });
}

global.getAVGMetricInSourceNodes = function (node) {
    //var node = {nodeId:1, sourceNodeId:1, metric:{}}
    var dbNode = new Object();
    var returnMetric = new Object();
    db.find({ _id: node.nodeId }, function (err, entries) {
        if (entries.length == 1) {
            dbNode = entries[0];
        }
        if (dbNode.sourceNodes != undefined) {
            var avgValue = 0; var avgItems = 0;
            var sourceNode;
            for (sourceNode in dbNode.sourceNodes) {
                if (sourceNode != undefined) {
                    // Also check for last 10 minutes nodes
                    if ((Date.now() - new Date(dbNode.sourceNodes[sourceNode].updated).getTime() < 600000)) {
                        if (dbNode.sourceNodes[sourceNode].metrics != undefined) {
                            if (dbNode.sourceNodes[sourceNode].metrics[node.metric.name] != undefined) {

                                avgValue += dbNode.sourceNodes[sourceNode].metrics[node.metric.name].value;
                                avgItems++;
                                returnMetric = dbNode.sourceNodes[sourceNode].metrics[node.metric.name]

                            }
                        }
                    }
                }
            }
        }
        returnMetric.value = (avgValue / avgItems).toFixed(2);
        returnMetric.name = 'AVG' + returnMetric.name
        //console.log(JSON.stringify(returnMetric));
        updateNodeMetric({ nodeId: dbNode._id, metric: returnMetric });
    });
}

exports.updateSourceNodesInNode = function (node) {
    //var node = {nodeId:1, sourceNodeId:1, metric:{}}
    // finding the node 
    var dbNode = new Object();
    db.find({ _id: node.nodeId }, function (err, entries) {
        if (entries.length == 1) {
            dbNode = entries[0];
        }

        dbNode._id = node.nodeId;
        dbNode.updated = new Date().getTime(); //update timestamp we last heard from this node, regardless of any matches
        dbNode.rssi = undefined;
        dbNode.value = undefined;
        dbNode.unit = undefined;

        if (dbNode.sourceNodes == undefined) dbNode.sourceNodes = new Object();
        if (dbNode.sourceNodes[node.sourceNodeId] == null) dbNode.sourceNodes[node.sourceNodeId] = new Object();
        if (dbNode.sourceNodes[node.sourceNodeId].metrics == undefined) dbNode.sourceNodes[node.sourceNodeId].metrics = new Object();

        //We need this to filter out unupdated nodes in a while
        dbNode.sourceNodes[node.sourceNodeId].updated = dbNode.updated;
        dbNode.sourceNodes[node.sourceNodeId].value = undefined;
        dbNode.sourceNodes[node.sourceNodeId].unit = undefined;

        dbNode.sourceNodes[node.sourceNodeId].metrics[node.metric.name] = new Object();
        if (dbNode.sourceNodes[node.sourceNodeId].metrics[node.metric.name] == null) dbNode.sourceNodes[node.sourceNodeId].metrics[node.metric.name] = new Object();
        dbNode.sourceNodes[node.sourceNodeId].metrics[node.metric.name] = node.metric;
        // console.log('Updating Node [' + dbNode._id + '] Surce Node [' + node.sourceNodeId + '] with metric :' + JSON.stringify(node.metric));

        db.findOne({ _id: dbNode._id }, function (err, doc) {
            if (doc == null) {
                db.insert(dbNode);
                console.log('   [' + dbNode._id + '] DB-Insert new _id:' + dbNode._id + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId);
                // console.log('INSERTED SOURCE NODES Node [' + dbNode._id + '] Surce Node [' + node.sourceNodeId + '] metric :' + JSON.stringify(dbNode));
            }
            else

                db.update({ _id: dbNode._id }, { $set: dbNode }, {}, function (err, numReplaced) {
                    console.log('   [' + dbNode._id + '] DB-Updates:' + numReplaced + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId);
                    // console.log('Updated SOURCE NODES Node [' + dbNode._id + '] Surce Node [' + node.sourceNodeId + '] metric :' + JSON.stringify(dbNode));
                });

            io.sockets.emit('UPDATENODE', dbNode); //post it back to all clients to confirm UI changes
            //handle any server side events (email, sms, custom actions)
            handleNodeEvents(dbNode);
        });

    });
};
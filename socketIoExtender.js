
module.exports = function (io) {
    io.on('connection', function (socket) {
        
        socket.on('PIREBOOT', function () {
            console.log('PI REBOOT REQUESTED from ' + address);
            var sshcommand = 'sudo reboot'; //'shutdown -r now';
            execute(sshcommand, function (callback) {
                console.log('PI REBOOT: ' + callback);
            });
        });

        socket.on('CLEANSOURCENODES', function (node) {
            var dbNode = new Object();
            db.find({ _id: node.nodeId }, function (err, entries) {
                if (entries.length == 1) {
                    dbNode = entries[0];
                }
                dbNode.sourceNodes = new Object();

            });
            db.findOne({ _id: dbNode._id }, function (err, doc) {
                if (doc == null) {
                    db.insert(dbNode);
                    // console.log('   [' + dbNode._id + '] DB-Insert new _id:' + dbNode._id + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId);
                }
                else

                    db.update({ _id: dbNode._id }, { $set: dbNode }, {}, function (err, numReplaced) { console.log('   [' + dbNode._id + '] DB-Updates:' + numReplaced + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId); });

                io.sockets.emit('UPDATENODE', dbNode); //post it back to all clients to confirm UI changes
                //handle any server side events (email, sms, custom actions)
                //handleNodeEvents(dbNode);
                console.log('cleanSourceNodes: [' + node.nodeId + '] the Node:' + JSON.stringify(dbNode));
            });
        });

        socket.on('EDITNODESCHEDULE', function (selectedNodeId, selectedScheduleDay, selectedSchedulePeriod, scheduleObject, remove) {
            console.log('EDITNODESCHEDULE: ' + 'selectedNodeId:' + selectedNodeId + ' selectedScheduleDay:' + selectedScheduleDay + ' selectedSchedulePeriod:' + selectedSchedulePeriod + ' scheduleObject:' + JSON.stringify(scheduleObject));

            var dbNode = new Object();
            db.find({ _id: selectedNodeId }, function (err, entries) {
                if (entries.length == 1) {
                    dbNode = entries[0];
                }
                dbNode._id = selectedNodeId;
                if (!remove) {
                    if (selectedSchedulePeriod == null) {
                        console.log('EDITNODESCHEDULE: INSERT NEW');
                        var periods = dbNode.thermostatSchedule[selectedScheduleDay];
                        periods.push(scheduleObject);
                        periods.sort(function (a, b) {
                            return new Date('1970/01/01 ' + a.startTime) - new Date('1970/01/01 ' + b.startTime);
                        });
                        dbNode.thermostatSchedule[selectedScheduleDay] = periods;
                        //console.log('EDITNODESCHEDULE: ' + JSON.stringify(periods));
                    }
                    else {

                        //console.log('EDITNODESCHEDULE: EDIT ');
                        dbNode.thermostatSchedule[selectedScheduleDay][selectedSchedulePeriod] = scheduleObject;
                    }
                }
                else {

                    dbNode.thermostatSchedule[selectedScheduleDay].splice(selectedSchedulePeriod, 1);
                    //console.log('EDITNODESCHEDULE: ' + JSON.stringify(dbNode.thermostatSchedule[selectedScheduleDay]));
                    //var periods = dbNode.thermostatSchedule[selectedScheduleDay];
                    //items.splice(_.indexOf(items, _.findWhere(items, { id: "abc" })), 1);
                }

                db.update({ _id: dbNode._id }, { $set: dbNode }, {}, function (err, numReplaced) {
                    //console.log('   [' + dbNode._id + '] DB-Updates:' + numReplaced + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId);
                    //console.log('EDITNODESCHEDULE: [' + dbNode._id + '] the Node:' + JSON.stringify(dbNode));
                });
                //io.sockets.emit('UPDATENODE', dbNode); //post it back to all clients to confirm UI changes
                io.sockets.emit('UPDATESMARTTERMOSTATSCHEDULE', dbNode); //post it back to all clients to confirm UI changes

            });



        });
        socket.on('TEST', function(x){console.log('TEST TEST TEST'+x);});
        socket.on('GETSERVERTIME', function(){serverDataTime(Date.now());});
  // socket.on('EDITSMARTTERMOSTATSCHEDULE', function (node) {
  //   var dbNode = new Object();
  //   db.find({ _id: node.nodeId }, function (err, entries) {
  //     if (entries.length == 1) {
  //       dbNode = entries[0];
  //     }
  //     if (dbNode.thermmostatSchedule == undefined) dbNode.thermmostatSchedule = new Object();
  //     for (var i = 0; i <= 6; i++) {
  //       var weekday = i.toString();
  //       thermmostatSchedule[weekday] = [{ startTime: "08:30", confortType: "home" }, { startTime: "23:30", confortType: "sleep" }];
  //     }

  //   });
  //   db.findOne({ _id: dbNode._id }, function (err, doc) {
  //     if (doc == null) {
  //       db.insert(dbNode);
  //       // console.log('   [' + dbNode._id + '] DB-Insert new _id:' + dbNode._id + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId);
  //     }
  //     else

  //       db.update({ _id: dbNode._id }, { $set: dbNode }, {}, function (err, numReplaced) { console.log('   [' + dbNode._id + '] DB-Updates:' + numReplaced + ' for ' + node.metric.name + ' in source node:' + node.sourceNodeId); });

  //     io.sockets.emit('UPDATESMARTTERMOSTATSCHEDULE', dbNode); //post it back to all clients to confirm UI changes
  //     //handleNodeEvents(dbNode);
  //     console.log('EDITSMARTTERMOSTATSCHEDULE: [' + node.nodeId + '] the Node:' + JSON.stringify(dbNode));
  //   });
  // });
    });
};
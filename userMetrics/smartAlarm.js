exports.sendAdbSMS = require(path.resolve(__dirname, 'customFunctions.js')).sendAdbSMS;
exports.startAdbCall = require(path.resolve(__dirname, 'customFunctions.js')).startAdbCall;


exports.motes = {
    SmartAlarm: {
        label: 'Smart Security',
        icon: 'appbar.shield.alert.svg',
        controls: {
            armedstatus: {
                states: [
                    {
                        label: 'Armed',
                        icon: 'fa-lock',
                        css: 'background-color:#ff1100;color:#fff',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['ALARM']) return node.metrics['ALARM'].value == 'ON'; else return false; else return true; }
                    },
                    {
                        label: 'Armed',
                        icon: 'fa-lock',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['ALARM']) return node.metrics['ALARM'].value != 'ON'; else return false; else return true; },
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'ALARM:' + 'ON';
                            processSerialData(fakeSerialMsg);
                            exports.sendAdbSMS('Alarm%s*Armed');
                            // updateNodeMetric({ nodeId: node._id, metric: { name: 'ALARMMODE', value: 'ARMED' } });
                            return;
                        },
                    },
                ]
            },
            disarmedstatus: {
                states: [
                    {
                        label: 'Disarmed',
                        icon: 'fa-unlock',
                        css: 'background-color:#9BFFBE',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['ALARM']) return node.metrics['ALARM'].value == 'OFF'; else return false; else return true; }
                    },
                    {
                        label: 'Disarmed',
                        icon: 'fa-unlock',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['ALARM']) return node.metrics['ALARM'].value != 'OFF'; else return false; else return true; },
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'ALARM:' + 'OFF';
                            processSerialData(fakeSerialMsg);
                            // updateNodeMetric({ nodeId: node._id, metric: { name: 'ALARMMODE', value: 'DISARMED' } });
                            exports.sendAdbSMS('Alarm%s*Disarmed');
                            return;
                        },
                    },
                ]
            },
            autostatus: {
                states: [
                    {
                        label: 'Auto',
                        icon: 'fa-unlock',
                        css: 'background-color:#9BFFBE',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['ALARM']) return node.metrics['ALARM'].value == 'AUTO'; else return false; else return true; }
                    },
                    {
                        label: 'Auto',
                        icon: 'fa-unlock',
                        condition: '' + function (node) { if (node.metrics != null) if (node.metrics['ALARM']) return node.metrics['ALARM'].value != 'AUTO'; else return true; else return true; },
                        serverExecute: function (node) {
                            var fakeSerialMsg = '[' + node._id + '] ' + 'ALARM:' + 'AUTO';
                            processSerialData(fakeSerialMsg);
                            // updateNodeMetric({ nodeId: node._id, metric: { name: 'ALARMMODE', value: 'DISARMED' } });
                            return;
                        },
                    },
                ]
            }
            // status: {
            //     states: [
            //         {
            //             label: 'Enabled',
            //             serverExecute: function (node) {
            //                 //setAlarmMode({ nodeId: node._id, alarmmode: 'OFF' })
            //                 updateNodeMetric({ nodeId: node._id, metric: { name: 'ALARMMODE', value: 'OFF' } });
            //                 var modeNow = '';
            //                 if (node.metrics['ALARMMODE']) modeNow = node.metrics['ALARMMODE'].value;
            //                 else {
            //                     if (node.metrics['ALARMMODE'] == null)
            //                         node.metrics['ALARMMODE'] = new Object();
            //                     modeNow = 'OFF';
            //                     node.metrics['ALARMMODE'].value = modeNow;
            //                 }
            //                 if (modeNow == 'OFF') return;
            //             },
            //             css: 'background-color:#9BFFBE;color:#000000',
            //             icon: 'fa-bell',
            //             condition: '' + function (node) { return node.metrics['ALARMMODE'] == null || node.metrics['ALARMMODE'].value == 'ON'; }
            //         },
            //         {
            //             label: 'Auto',
            //             serverExecute: function (node) {
            //                 // setAlarmMode({ nodeId: node._id, alarmmode: 'ON' })
            //                 updateNodeMetric({ nodeId: node._id, metric: { name: 'ALARMMODE', value: 'ON' } });
            //                 var modeNow = '';
            //                 if (node.metrics['ALARMMODE']) modeNow = node.metrics['ALARMMODE'].value;
            //                 else {
            //                     if (node.metrics['ALARMMODE'] == null)
            //                         node.metrics['ALARMMODE'] = new Object();
            //                     modeNow = 'ON';
            //                     node.metrics['ALARMMODE'].value = modeNow;
            //                 }
            //                 if (modeNow == 'ON') return;
            //             },
            //             css: 'background-color:#FF9B9B;',
            //             icon: 'fa-bell-slash',
            //             condition: '' + function (node) { return node.metrics['ALARMMODE'] != null && node.metrics['ALARMMODE'].value == 'OFF'; }
            //         },
            //         {
            //             label: 'Undefined',
            //             serverExecute: function (node) {
            //                 // setAlarmMode({ nodeId: node._id, alarmmode: 'ON' })
            //                 updateNodeMetric({ nodeId: node._id, metric: { name: 'ALARM', value: 'AUTO' } });

            //             },
            //             icon: 'fa-bell-slash',
            //             condition: '' + function (node) { return node.metrics['ALARM'] == null || node.metrics['ALARM'] != 'OFF' || node.metrics['ALARM'] != 'ON'; }
            //         }
            //     ]
            // }

        }

    }
};

exports.metrics = {
    // ThC: { name: 'ThC', value: '', unit: '°', pin: 1, graph: 1, graphValSuffix: 'C', graphOptions: { legendLbl: 'Thermostat Target Temperature' } },
    ALARM : { name:'ALARM', regexp:/ALARM\:(ON|OFF|AUTO)/i, value:''},
    
};

exports.events = {
    insideMotionPush: {
        label: "Push: Motion To Alarm Node",
        icon: "action",
        descr: "Push Motion from this node to Alarm Node",
        serverExecute: function (node) {
            if (node.metrics['M'] && (Date.now() - new Date(node.metrics['M'].updated).getTime() < 2000)) {
                console.log("Push Motion from this node to Alarm Node:" + settings.smartalarm.nodeId.value);
                var fakeSerialMsg = '[' + settings.smartalarm.nodeId.value + '] ' + node.metrics['M'].value;
                processSerialData(fakeSerialMsg);
                //setTimeout(sendMotionToNode,1000, {nodeId: node._id,destinationNodeId:settings.smartalarm.nodeId.value,metricValue:node.metrics['M']})
                //setTimeout(updateNodeMetric, 1000, { nodeId: settings.smartalarm.nodeId.value, metric: { name: 'M', value: node.metrics['M'].value } });

            }
        }
    },
    alarmEmail: {
        label: 'Motion Alarm : Email',
        icon: 'mail',
        descr: 'Send email when MOTION is detected and alarm is ON',
        serverExecute: function (node) {
            if (node.metrics['ALARM']) {
                console.log('ALARM : ' + node.metrics['ALARM'].value);
                if (node.metrics['ALARM'] && node.metrics['ALARM'].value == 'ON')
                    if (node.metrics['M'] && node.metrics['M'].value == 'MOTION' &&
                        (Date.now() - new Date(node.metrics['M'].updated).getTime() < 2000)
                    ) {
                        var approveSendMessage = false;
                        if (node.metrics['M'].lastTriggeredMovement) {
                            if (new Date(node.metrics['M'].updated).getTime() - new Date(node.metrics['M'].lastTriggeredMovement).getTime() < settings.smartalarm.alarmDelay.value) {
                                if (node.metrics['M'].lastMessage) /*check if lastMessage value is not NULL ... */ {
                                    if (Date.now() - node.metrics['M'].lastMessage > settings.smartalarm.limitMotionMessage.value) /*check if lastMessage timestamp is more than 1hr ago*/ {
                                        approveSendMessage = true;
                                    }
                                }
                                else {
                                    approveSendMessage = true;
                                }
                            }
                        }

                        node.metrics['M'].lastTriggeredMovement = node.metrics['M'].updated
                        if (approveSendMessage) {
                            node.metrics['M'].lastMessage = Date.now();
                            sendEmail('INTRUDER ALERT', 'MOTION WAS DETECTED WHEN ALARM IS ON @ ' + (new Date().toLocaleTimeString() + (new Date().getHours() > 12 ? 'PM' : 'AM')));
                            db.update({ _id: node._id }, { $set: node }, {}, function (err, numReplaced) { console.log('   [' + node._id + '] DB-Updates:' + numReplaced); }); /*save lastMessage timestamp to DB*/
                        }
                        else console.log('   [' + node._id + '] MOTION Message skipped.');
                    }
            }
            else {
                console.log('ALARM METRIC NOT FOUND!');
            }
        }
    },
    alarmSMS: {
        label: 'Motion Alarm : adb SMS',
        icon: 'comment',
        descr: 'Send adb SMS when MOTION is detected and alarm is ON',
        condition: function (node) {
            if (node.metrics['ALARM'] == undefined) return false;
            if (node.metrics['ALARM'].value != 'ON') return false;
            return node.metrics['M'] && node.metrics['M'].value == 'MOTION' &&
                (Date.now() - new Date(node.metrics['M'].updated).getTime() < 2000);
        },
        serverExecute: function (node) {
            var approveSendMessage = false;
            if (node.metrics['M'].lastTriggeredMovement) {
                if (new Date(node.metrics['M'].updated).getTime() - new Date(node.metrics['M'].lastTriggeredMovement).getTime() < settings.smartalarm.alarmDelay.value) {
                    if (node.metrics['M'].lastMessage) /*check if lastMessage value is not NULL ... */ {
                        if (Date.now() - node.metrics['M'].lastMessage > settings.smartalarm.limitMotionMessage.value) /*check if lastMessage timestamp is more than 1hr ago*/ {
                            approveSendMessage = true;
                        }
                    }
                    else {
                        approveSendMessage = true;
                    }
                }
            }

            node.metrics['M'].lastTriggeredMovement = node.metrics['M'].updated
            if (approveSendMessage) {
                node.metrics['M'].lastMessage = Date.now();
                console.log('   [' + node._id + '] Start ADB MOTION Message Alert.');
                exports.sendAdbSMS('INTRUDER%sALERT');
                //sendAdbSMS('INTRUDER%sALERT%s:%sMOTION%sWAS%sDETECTED%sWHEN%sALARM%sIS%sON%s@%s');// + (new Date().toLocaleTimeString() + (new Date().getHours() > 12 ? 'PM' : 'AM')));
                //sendEmail('INTRUDER ALERT', 'MOTION WAS DETECTED WHEN ALARM IS ON @ ' + (new Date().toLocaleTimeString() + (new Date().getHours() > 12 ? 'PM' : 'AM')));
                db.update({ _id: node._id }, { $set: node }, {}, function (err, numReplaced) { console.log('   [' + node._id + '] DB-Updates:' + numReplaced); }); /*save lastMessage timestamp to DB*/
            }
            else console.log('   [' + node._id + '] MOTION Message skipped.');
        }
    },
    alarmCall: {
        label: 'Motion Alarm : adb Call',
        icon: 'phone',
        descr: 'Send adb Call when MOTION is detected and alarm is ON',
        condition: function (node) {
            if (node.metrics['ALARM'] == undefined) return false;
            if (node.metrics['ALARM'].value != 'ON') return false;
            return node.metrics['M'] && node.metrics['M'].value == 'MOTION' &&
                (Date.now() - new Date(node.metrics['M'].updated).getTime() < 2000);
        },
        serverExecute: function (node) {
            var approveSendMessage = false;
            if (node.metrics['M'].lastTriggeredMovement) {
                if (new Date(node.metrics['M'].updated).getTime() - new Date(node.metrics['M'].lastTriggeredMovement).getTime() < settings.smartalarm.alarmDelay.value) {
                    if (node.metrics['M'].lastMessage) /*check if lastMessage value is not NULL ... */ {
                        if (Date.now() - node.metrics['M'].lastMessage > settings.smartalarm.limitMotionMessage.value) /*check if lastMessage timestamp is more than 1hr ago*/ {
                            approveSendMessage = true;
                        }
                    }
                    else {
                        approveSendMessage = true;
                    }
                }
            }

            node.metrics['M'].lastTriggeredMovement = node.metrics['M'].updated
            if (approveSendMessage) {
                node.metrics['M'].lastMessage = Date.now();
                exports.startAdbCall();
                //sendEmail('INTRUDER ALERT', 'MOTION WAS DETECTED WHEN ALARM IS ON @ ' + (new Date().toLocaleTimeString() + (new Date().getHours() > 12 ? 'PM' : 'AM')));
                db.update({ _id: node._id }, { $set: node }, {}, function (err, numReplaced) { console.log('   [' + node._id + '] DB-Updates:' + numReplaced); }); /*save lastMessage timestamp to DB*/
            }
            else console.log('   [' + node._id + '] MOTION Message skipped.');
        }
    },
    alarmBeep: {
        label: 'Motion Alarm: Buzzer beep!',
        icon: 'action',
        descr: 'Beep the gateway buzzer when MOTION is detected and alarm is ON',
        serverExecute: function (node) {
            if (node.metrics['ALARM']) {
                console.log('ALARM : ' + node.metrics['ALARM'].value);
                if (node.metrics['ALARM'] && node.metrics['ALARM'].value == 'ON')
                    if (node.metrics['M'] && node.metrics['M'].value == 'MOTION' &&
                        (Date.now() - new Date(node.metrics['M'].updated).getTime() < 2000)
                    )

                    { setTimeout(function () { sendMessageToGateway('BEEP2'); }, 1000); }
            }
            else {
                console.log('ALARM METRIC NOT FOUND!');
            }
        }
    },

};
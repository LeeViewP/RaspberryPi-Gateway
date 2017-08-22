User Metrics Folder
----------------
<br/>

The purpose of this folder is to have a place to put custom user definitions for metrics, motes, events, custom functions and variables etc., without the need to directly edit the main metrics.js which might get overwritten during an upgrade.

###How to use:
- place your custom metrics/motes/events in this folder
- whatever objects you define here will be merged with the contents of metrics.js
- if a matching metric/mote/event is redefined in a file this folder, it will override the default from metrics.js, that also means that if duplicates are found, the last one in the last file (alphabetically) will be the winner
- follow the same definition/syntax pattern as in main metrics.js definition file
- each metric could be broken into its own separate file or everything could be in a single file just like in metrics.js, it all gets merged into the main `metricsDef` object
- a basic example is provided as a starting point in _example.js


----------------
<br/>

Added 3 Motes type
Smart Alarm is created from some events: 
- event to the MotionMotes that push the motion to the alarm node (defined in settings) 
- some events on th alarm node that is triggered only if the smart alarm is in ARMED mode (send email if the motion is detected, call adb, sms adb the last 2 need an android phone conected to the Pi  and adb tools installed) 

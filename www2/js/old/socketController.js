var socketController = function (pageRenderController) {
    


    var socket = io();
    socket.showHiddenNodes = false;
    socket.nodeController = new NodeController();
    socket.pageController = new HTMLController();

    socket.nodeTemplate = {
                path: "templates/newNode.html",
                attribute: "id",
                idSelector: "node_",
                nodeParent : "nodeList",
            };
    socket.settingsTemplate = {
                path:"templates/settings.html",
                list: "settingsList",
            };
    // socket.pageController = new PageRenderController();

    socket.bindedNodes =[];
    socket.on('connect', function () {
        //   LOG('Connected!');
        var span = $("<span/>").text(" Waiting for data..").prepend($("<span/>").text("Connected!").addClass("importantRed"));
        pageRenderController.clearAddToParentObject($('#loadingSocket'), span);


         //clear loader
        pageRenderController.clearAddToParentObject($("#homepage"),$("<span/>"))
    });

    socket.on('disconnect', function () {
        var span = $("<span/>").text("Socket was ").append($("<span/>").text("disconnected.").addClass("importantRed")).append($("<span/>").text("Waiting for socket connection.."));
        pageRenderController.clearAddToParentObject($('#loadingSocket'), span);
        //   $('#log').val(new Date().toLocaleTimeString() + ' : Disconnected!\n' + $('#log').val());
        //   $("#loader").show();
        //$('#loadingSocket').html('Socket was <span style="color:red">disconnected.</span><br/><br/>Waiting for socket connection..');
        //   if ($.mobile.activePage.attr('id') != 'homepage')
        //     $.mobile.navigate('#homepage', { transition : 'slide'});
        //   $('#nodeList').hide();
    });

    socket.on('UPDATENODE', function(entry) {
        socket.pageController.renderNode(entry,socket.nodeTemplate, socket.showHiddenNodes)
        socket.bindedNodes.push(socket.nodeController.dataBindNode(entry));
        
        pageRenderController.clearAddToParentObject($('#loadingSocket'), socket.pageController.refreshNodeList(socket.nodeTemplate, socket.showHiddenNodes));
    });

    socket.on('UPDATENODES', function (entries) {
        var span = $("<span/>").text("Count: 0").addClass("node-count");
        pageRenderController.clearAddToParentObject($('#loadingSocket'), span);
       
        entries.sort(function (a, b) { if (a.label && b.label) return a.label < b.label ? -1 : 1; if (a.label) return -1; if (b.label) return 1; return a._id > b._id; });
        for (var i = 0; i < entries.length; ++i) {
            socket.pageController.renderNode(entries[i],socket.nodeTemplate, socket.showHiddenNodes)
            socket.bindedNodes.push(socket.nodeController.dataBindNode(entries[i]));
            }
        
        pageRenderController.clearAddToParentObject($('#loadingSocket'), socket.pageController.refreshNodeList(socket.nodeTemplate, socket.showHiddenNodes));
    });

    socket.on('MOTESDEF', function (motesDefinition) {
        socket.nodeController.motesDefinition = motesDefinition;

        // motesDef = motesDefinition;
        //   $("#nodeMoteType").empty();
        //   $('#nodeMoteType').append('<option value="">Select type...</option>');
        //   for(var mote in motesDef)
        //     $('#nodeMoteType').append('<option value="' + mote + '">' + motesDef[mote].label || mote + '</option>');
        //   $("#nodeMoteType").selectmenu();
    });

    socket.on('METRICSDEF', function (metricsDefinition) {
        socket.nodeController.metricsDefinition = metricsDefinition;
        //metricsDef = metricsDefinition;
    });

    socket.on('EVENTSDEF', function (eventsDefinition) {
        socket.nodeController.eventsDefinition = eventsDefinition;
        //eventsDef = eventsDefinition;
        //   $('#addEventType').change(function() {
        //     if ($(this).val())
        //     {
        //       $('#addEventDescr').html('<span style="color:#000">Action: </span>' + (eventsDef[$(this).val()].icon ? '<span class="ui-btn-icon-notext ui-icon-'+eventsDef[$(this).val()].icon+'" style="position:relative;float:left"></span>' : '') + (eventsDef[$(this).val()].descr || key));
        //       $('#addEvent_OK').show();
        //     }
        //     else {
        //       $('#addEventDescr').html(' ');
        //       $('#addEvent_OK').hide();
        //     }
        //   });
    });

	socket.on('NOTIFICATIONTYPEDEF', function(notificationTypeDefinition) {
      notificationTypeDef = notificationTypeDefinition;
      $('#addNotificationType').change(function() {
        if ($(this).val())
        {
			var typeN = notificationTypeDef[$(this).val()]; 
			var actionFields= $('#addNotificationActionsFields')
			 $('.removabletype').remove();
			Object.getOwnPropertyNames(typeN).forEach(function(val, idx, array) {
				if (val !='label' && val != 'nextScheduleSTR'){
					$('<label/>', {
								'for': 'notification'+ val + 'Label',
								'class':'labelbold removabletype',
								'text': val.toProperCase() + ':',
								})
					.appendTo(actionFields);
					var containerDiv = $('<div/>', { 'class': 'ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset removabletype'}).appendTo(actionFields);
					$('<input/>', {
								'id':'notification'+ val + 'Label',
								'name':'notification'+ val + 'Label',
								'type':'text',
								'placeholder': val + ' label',
								'value': typeN[val],
								'class':'removabletype',
								})
					.appendTo(containerDiv);
				}
			});
          //$('#addEventDescr').html('<span style="color:#000">Action: </span>' + (eventsDef[$(this).val()].icon ? '<span class="ui-btn-icon-notext ui-icon-'+eventsDef[$(this).val()].icon+'" style="position:relative;float:left"></span>' : '') + (eventsDef[$(this).val()].descr || key));
          $('#addNotification_OK').show();
        }
        else {
          //$('#addEventDescr').html(' ');
          $('#addNotification_OK').hide();
        }
      });
    });
    
	socket.on('NOTIFICATIONACTIONSDEF', function(notificationActionsDefinition) {
      notificationActionDef = notificationActionsDefinition;
      $('#addNotificationAction').change(function() {
        if ($(this).val())
        {
		var actionN = notificationActionDef[$(this).val()]; 
          $('#addNotificationActionIcon').html((actionN.icon ? '<span class="ui-btn-icon-notext ui-icon-'+ actionN.icon + '" style="position:relative;float:left"></span>' : ''));
		  var actionFields= $('#addNotificationActionsFields')
		  $('.removableaction').remove();
		 
			Object.getOwnPropertyNames(actionN).forEach(function(val, idx, array) {
			$('<label/>', {
						'for': 'notification'+ val + 'Label',
						'class':'labelbold removableaction',
						'text': val.toProperCase() + ':',
						})
			.appendTo(actionFields);
			var containerDiv = $('<div/>', { 'class': 'ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset removableaction'}).appendTo(actionFields);
			$('<input/>', {
						'id':'notification'+ val + 'Label',
						'name':'notification'+ val + 'Label',
						'type':'text',
						'placeholder': val + ' label',
						'value': actionN[val],
						'class':'removableaction',
						})
			.appendTo(containerDiv);
			
		});
          $('#addNotification_OK').show();
        }
        else {
          //$('#addEventDescr').html(' ');
          $('#addNotification_OK').hide();
        }
      });
    });
	
    socket.on('SETTINGSDEF', function (newSettingsDef) {
        socket.pageController.renderSettings(newSettingsDef);
        socket.nodeController.boundSettings = socket.nodeController.dataBindSettings(newSettingsDef);
        $(document).on('click', '#settingsSave', function() {
            socket.emit('UPDATESETTINGSDEF', socket.nodeController.boundSettings); 
        });
    });

    socket.on('LOG', function(data) {
      LOG(data);
    });
    socket.on('PLAYSOUND', function (soundFile) {
      new Audio(soundFile).play();
    });

    socket.on('GRAPHDATAREADY', function(rawData){
      graphData = [];
      var max = Number.NEGATIVE_INFINITY;
      var min = Number.POSITIVE_INFINITY;
      var minmax = 0;

      for(var key in rawData.graphData.data) {
        graphData.push([rawData.graphData.data[key].t, rawData.graphData.data[key].v]); //build flot series from raw data
        max = Math.max(max, rawData.graphData.data[key].v);
        min = Math.min(min, rawData.graphData.data[key].v);
      }

      //defining the upper and lower margin
      minmax=(max-min) * graphOptions.yaxis.autoscaleMargin;
      if (min==max)  // in case of only one value in the dataset (motion detection)
        minmax=graphOptions.yaxis.autoscaleMargin * min;
      min -= minmax;
      max += minmax;
      graphOptions.xaxis.min = graphView.start;
      graphOptions.xaxis.max = graphView.end;
      graphOptions.yaxis.min = min;
      graphOptions.yaxis.max = max;

      graphOptions = $.extend(true, graphOptions, rawData.options); //http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
      $('#graphStat').html(rawData.graphData.data.length + 'pts, ' + rawData.graphData.queryTime + 'ms');
      //need to defer plotting until after pageshow is finished rendering, otherwise the wrapper will return an incorrect width of "100"
      if (metricGraphWrapper.width()==100)
        $(document).on("pageshow", "#metricdetails", renderPlot);
      else renderPlot();
    });


    return socket;
}
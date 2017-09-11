var NodeController = function () {
    var ncontroller = {
        //self: null,
        nodes: {},        //this holds the current nodes data
        motesDefinition: null,         //holds the definition of the motes (from server side metrics.js)
        metricsDefinition: null,        //holds the definition of the metrics (from server side metrics.js)
        eventsDefinition: null,
        settingsDefinition: null,
        settingsDefinitionBindMap: null,
        boundSettings: null,
        selectedNodeId: null,
        showHiddenNodes: false,

        initialize: function () {
        },
        updateNodes: function (entries)
        { },
        // updateNode: function (node, nodeList, pageRenderController)
        // {
        //     var nodeHtml = pageRenderController.replaceAttr(pageRenderController.loadTemplate("templates/newNode.html"), "id", "{id}", node._id );

        //     if (node.hidden)
        //         if (ncontroller.showHiddenNodes)
        //             nodeHtml.addClass('hiddenNodeShow');
        //         else
        //             nodeHtml.addClass('hiddenNode');

        //     var existingNode = $('#node_' + node._id);
        //     if(existingNode.length)
        //         existingNode.replaceWith(nodeHtml);
        //     else 
        //         nodeList.append(nodeHtml);

        //     if (node._id == ncontroller.selectedNodeId) 
        //             ncontroller.refreshNodeDetails(node);

        //     return Bind(node, ncontroller.mapNode(node));   
        // },
        dataBindNode: function (node) {
            if (node._id == ncontroller.selectedNodeId)
                ncontroller.refreshNodeDetails(node);
            return Bind(node, ncontroller.mapNode(node));
        },
        dataBindSettings: function(settingsDef=ncontroller.settingsDefinition){
            return Bind(settingsDef, ncontroller.mapSettings(settingsDef));
        },
        refreshNodeDetails: function (node) { },

        mapNode: function (node) {

            var nodeMap =
                {
                    'label': "#node_" + node._id + "-label",
                    'rssi': {
                        dom: "#node_" + node._id + "-rssi",
                        transform: function (v) {
                            return resolveRSSIImage(this.safe(v));
                        }
                    },
                    'metrics.V.value': {
                        dom: "#node_" + node._id + "-battery",
                        transform: function (v) {
                            return resolveBatteryImage(this.safe(v));
                        }
                    },
                    'hidden': {
                        dom: "#node_" + node._id + "-hidden",
                        transform: function (v) {
                            return getHiddenNode(this.safe(v));
                        }
                    },
                    //"#node_"+node._id+" .rssi",
                    // 'node.descr':"#node_"+node._id+" .descr",
                    'descr': "#node_" + node._id + "-descr",

                    'type':{
                            dom: "#node_" + node._id + "-type",
                            transform: function (v) {
                            return getNodeIcon(this.safe(v), ncontroller.motesDefinition);
                        }
                    },


                };

            return nodeMap;
        },
        // mapNodes: function (nodes, pageRenderController)
        // { 

        //     var nodesMap = 
        //     {
        //         'nodes':{
        //         dom: '#nodeList',
        //         transform: function (v) {
        //         return updateNode( this.safe(v),pageRenderController);    }
        //     }

        //     };

        //     return nodeMap;
        // },
        mapSettings: function (settingsDef) {
           // ncontroller.settingsDefinitionBindMap = {};
           var settingsDefinitionBindMap = {};
            for (var sectionName in settingsDef) {
                var sectionSettings = settingsDef[sectionName];
                if (!sectionSettings.exposed) continue;
                for (var settingName in sectionSettings) {
                    var setting = sectionSettings[settingName];
                    if (setting.exposed === false) continue;
                    if (setting.value == undefined) continue;
                    //DoSomething with the setting
                    //socket.nodeController.settingsDefinitionBindMap[sectionName + '.' + settingName + '.value'] = '#' + sectionName + '-' + settingName;
                    settingsDefinitionBindMap[sectionName + '.' + settingName + '.value'] = '#' + sectionName + '-' + settingName;
                }

            }
            return settingsDefinitionBindMap;
        },




    }

    ncontroller.initialize();
    return ncontroller;

}


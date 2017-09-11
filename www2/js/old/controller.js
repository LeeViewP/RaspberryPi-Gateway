//var smartEHomeController = function () {
var PageRenderController = function(header, content, footer){
    var controller = {
        self: null,
        initialize: function () {
            self = this;
            self.header = header;
            self.content = content;
            self.footer = footer;
            self.tmp = $(".tmp");

            self.renderHeader(null, "/templates/header.html");
            self.renderObjectHtml(null, "/templates/loader.html", content);
            self.renderFooter(null, "/templates/footer.html");
            // var divHeight = $('#header-wrap').height(); 
            // $('#container').css('margin-top', divHeight+'px');
            

        },
        //USE [translation-text] ATTRBUTE FOR TRANSLATION
        translate: function (translations, item) {
            item.find("[translation-text]").each(
                $(this).text(translations[$(this).attr("translation-text")])
            );
            item.find("[translation-placeholder]").each(
                $(this).text(translations[$(this).attr("translation-placeholder")])
            );
            return item;
        },
        loadTemplate: function (url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);  // `false` makes the request synchronous
            request.send(null);

            if (request.status === 200) {
                self.tmp.append(request.responseText);
                $template = $(".tmp > .template").remove();
                return $template.clone()

            }

        },
        replaceAttr: function(itemTemplate, attribute, searchValue, value)
        {
            itemTemplate.find("[" + attribute +"*='"+ searchValue + "']").each(function(){
                //var newAttributeValue = $(this).attr()
                 $(this).attr(attribute,$(this).attr(attribute).replace(searchValue,value));
            });
            if(itemTemplate.attr(attribute) !="")
                itemTemplate.attr(attribute,itemTemplate.attr(attribute).replace(searchValue,value));
            return itemTemplate;
        },
        ///Fill Template with data object's properties
        fillTemplate: function(dataObject, itemTemplate, objectName = "") {
            var cssbinding = objectName == "" ? objectName: objectName+"\\.";
            for (var propertyName in dataObject) {
                if ((propertyName == "id" || propertyName == "_id") && objectName == "") {
                    itemTemplate.attr("data-id", dataObject[propertyName]);
                    itemTemplate.attr("id", dataObject[propertyName]);
                }
                //Text Elements
                itemTemplate.find("[data-template="+ cssbinding + propertyName + "][data-type=text]").text(dataObject[propertyName]);
                //Date Elements
                var newItem = itemTemplate.find("[data-template=" + cssbinding + propertyName + "][data-type=date][data-format]");
                if (newItem.length > 0) {
                    var dataformat = newItem.attr("data-format");
                    newItem.text($.datepicker.formatDate(dataformat, new Date(dataObject[propertyName])));
                }
                //Image NodeType
               // var a= itemTemplate.find("[data-template=" + propertyName + "][data-type=image]").attr("src", "images/" + getNodeIcon(dataObject[propertyName]) )
                itemTemplate.find("[data-template=" + cssbinding +  propertyName + "][data-type=imagetype]").replaceWith(getNodeTypeIcon(dataObject[propertyName]));
                itemTemplate.find("[data-template=" + cssbinding + propertyName + "][data-type=imagerssi]").replaceWith(resolveRSSIImage(dataObject[propertyName]));
                itemTemplate.find("[data-template=" + cssbinding + propertyName + "][data-type=imagebattery]").replaceWith(resolveBatteryImage(dataObject[propertyName]));
                itemTemplate.find("[data-template=" + cssbinding +  propertyName + "][data-type=imagehidden]").replaceWith(getHiddenNode(dataObject[propertyName]));
                if (typeof dataObject[propertyName] === 'object')
                  self.fillTemplate(dataObject[propertyName], itemTemplate, cssbinding+propertyName);
            }
            return itemTemplate;
        },
        renderObjectHtml: function(dataObject, url, control = self.content, empty = true)
        {
            if(empty)
                control.empty();
            //  self.app.empty();
             var $templatedObject = self.fillTemplate(dataObject, self.loadTemplate(url));
            control.append($templatedObject);
            // self.app.append($templatedObject);
            //return $templatedObject;
        },
        renderHeader: function(dataObject, url)
        {
            self.renderObjectHtml(dataObject,url,self.header)
            self.content.css("margin-top", self.header.height() + "px");
        },
        renderFooter: function(dataObject, url)
        {
            self.renderObjectHtml(dataObject,url,self.footer)
            self.content.css("margin-bottom", self.footer.height() + "px");
        },

        addToParentObject :function(parentControl, childControl)
        {
            parentControl.append(childControl);
        },
        clearAddToParentObject:function(parentControl, childControl)
        {
            parentControl.empty();
            parentControl.append(childControl);
        },
    }
    controller.initialize();
    return controller;
}



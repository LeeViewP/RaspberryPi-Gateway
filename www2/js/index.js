function AiController() {
    'use strict';
    this.initialize();
    return this;
}
AiController.prototype.socket = null;

AiController.prototype.initialize = function(){
    'use strict';
    this.socket = new SocketExtender(io(), new InterfaceNotifier());
};

var aiController  = new AiController();



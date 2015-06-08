Notify = function($timeout) {
    var pendingMessages = [];
    var idCounter = 0;
    this.notifications = {
        length: 0,
    };
    this.identity = 'notify';

    this.flashMessage = function(args) {
        //alert(args.msg + "\n" + this.notifications.length);
        itemId = this.showMessage(args);

        //this.notifications[itemId] = newMsg;
        $timeout(this.hideMessage.bind(this), args.duration, true, itemId);
        return itemId;
    };

    this.showMessage = function(args) {
        //alert('test');
        args = validateArguments(args);

        itemId = String(idCounter);
        idCounter++;
        var newMsg = {
            text: args.msg,
            type: args.type,
            subNotifications: args.subMsgs,
            id: itemId
        };

        Object.defineProperty(this.notifications, itemId, {
            enumerable: true,
            configurable: true,
            value: newMsg
        });
        this.notifications.length++;
        return itemId;
    };

    this.hideMessage = function(id) {
        delete this.notifications[String(id)];
        this.notifications.length--;
    };

    validateArguments = function(args) {
        if(!args) {
            throw "missing parameters";
        }
        if(!args.msg) {
            throw "missing required parameter: msg";
        }
        args.type = args.type || 'info';
        args.duration = args.duration || 3000;
        args.subMsgs = args.subMsgs || [];
        return args;
    };

};

angular.module("GiftsApp").service("Notify", ['$timeout', Notify]);


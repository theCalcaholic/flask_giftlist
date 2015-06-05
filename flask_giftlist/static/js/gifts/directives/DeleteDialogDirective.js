(function () {
    DeleteDialogCtrl = function(DataProvider, Dialogs) {
    this.shown = false;
    this.gift = DataProvider.selectedGift;
    this.name = 'delete';
    thiz = this;

    this.show = function() {
        this.gift = DataProvider.selectedGift;
        this.shown = true;
    }

    this.close = function() {
        this.shown = false;
    }

    this.submit = function() {
        if( this.form.$valid ) {
            this.close();
            this.form.$setPristine();
            DataProvider.selectedGift = this.gift;
            DataProvider.server.deleteGift(DataProvider.selectedIndex);
        } else {
            this.form.$setDirty();
        }
        
    };

    validString = function(bl) {
        if(bl) {
            return 'valid';
        } else {
            return 'invalid';
        }
    }

    thiz.debug = function() {
        /*this.gifter.surname = 'Tobias';
        this.gifter.lastname = 'Knöppler';
        this.gifter.email = 'tobias@knoeppler.net';
        this.gifter.email_confirm = 'tobias@knoeppler.net';
        this.claimDialog.$validate();
        $log.debug("gifter.surname:" + this.gifter.surname );
        $log.debug("gifter.name:" + this.gifter.name);
        $log.debug("gifter.email:" + this.gifter.email);
        $log.debug("gifter.email_confirm:" + this.gifter.email_confirm );
        $log.debug("email_confirm-error:" + this.claimDialog.email_confirm.$error );*/
    }

    Dialogs.deleteDialog(this);

};

    DeleteDialogDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'ajax/template/deleteDialog.html',
            replace: true,
            scope: {},
            controller: [
                'DataProvider', 
                'Dialogs', 
                DeleteDialogCtrl],
            controllerAs: 'dialog'
        };
    };

    angular.module('GiftsApp').directive('deleteDialog', DeleteDialogDirective);
})();

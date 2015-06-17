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
            DataProvider.deleteGift(DataProvider.selectedIndex);
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

    Dialogs.deleteDialog(this);

};

    DeleteDialogDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'template/deleteDialog.html',
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

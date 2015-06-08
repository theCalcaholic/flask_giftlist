(function () {
    ClaimDialogCtrl = function($location, DataProvider, Dialogs) {
        this.shown = false;
        this.gifter = DataProvider.gifter;

        this.show = function() {
            this.shown = true;
        }

        this.close = function() {
            this.shown = false;
        }

        this.submit = function() {
            if( this.form.$valid ) {
                $location.path('/claim/');
                this.close();
                DataProvider.gifter = this.gifter;
            }
            this.form.$setDirty();
            
        };

        validString = function(bl) {
            if(bl) {
                return 'valid';
            } else {
                return 'invalid';
            }
        }

        this.debug = function() {
            this.gifter.surname = 'Tobias';
            this.gifter.lastname = 'Knöppler';
            this.gifter.email = 'tobias@knoeppler.net';
            this.gifter.email_confirm = 'tobias@knoeppler.net';
        };

        Dialogs.claimDialog(this);

    };

    ClaimDialogDirective = function() {
        return {
            restrict: 'EA',
            templateUrl: 'ajax/template/claimDialog.html',
            replace: true,
            transclude: false,
            controller: ClaimDialogCtrl,
            controllerAs: 'dialog',
        };
    };

    angular.module('GiftsApp').directive('claimdialog', ['$location', 'DataProvider', 'Dialogs', ClaimDialogDirective]);
})();

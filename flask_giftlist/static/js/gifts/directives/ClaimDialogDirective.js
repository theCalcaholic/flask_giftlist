(function () {
    ClaimDialogCtrl = function($location, DataProvider) {
        this.show = false;
        this.gifter = DataProvider.gifter;

        this.showDialog = function() {
            this.show = true;
        }

        this.closeDialog = function() {
            this.show = false;
        }

        this.submit = function() {
            if( this.claimDialog.$valid ) {
                $location.path('/claim/');
                this.closeDialog();
                DataProvider.gifter = this.gifter;
            }
            this.claimDialog.$setDirty();
            
        };

        validString = function(bl) {
            if(bl) {
                return 'valid';
            } else {
                return 'invalid';
            }
        }

        this.debug = function() {
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
        };

    };

    ClaimDialogDirective = function() {
        return {
            restrict: 'EA',
            templateUrl: 'ajax/template/claimDialog.html',
            replace: true,
            transclude: false,
            controller: ClaimDialogCtrl,
            controllerAs: 'vm',
        };
    };

    angular.module('GiftsApp').directive('claimdialog', ['$location', 'DataProvider', ClaimDialogDirective.js]);
})();

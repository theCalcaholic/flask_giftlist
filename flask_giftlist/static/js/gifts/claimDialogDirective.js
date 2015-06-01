function claimDialogCtrl($location, $log, giftActions) {
    this.show = false;
    this.gift = null;
    this.gifter = {
        "surname": null,
        "name": null,
        "email": null,
        "email_confirm": null
    };
    this.action = null;

    this.showDialog = function() {
        if( this.gift ) {
            this.show = true;
            this.action = 'claim/' + this.gift.id + '/';
        }
    }

    this.closeDialog = function() {
        this.show = false;
    }

    this.submit = function() {
        if( this.claimDialog.$valid ) {
            $location.path('/claim/');
            this.closeDialog();
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
        $log.debug("gifter.surname:" + this.gifter.surname );
        $log.debug("gifter.name:" + this.gifter.name);
        $log.debug("gifter.email:" + this.gifter.email);
        $log.debug("gifter.email_confirm:" + this.gifter.email_confirm );
        $log.debug("email_confirm-error:" + this.claimDialog.email_confirm.$error );
    }

    giftActions.register(claimDialogCtrl=this);

};

app.directive('claimdialog', function() {
    return {
        restrict: 'EA',
        templateUrl: 'ajax/template/claimDialog.html',
        replace: true,
        transclude: false,
        controller: claimDialogCtrl,
        controllerAs: 'vm',
    };
});

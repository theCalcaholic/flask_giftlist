function claimDialogCtrl(giftActions) {
    this.show = false;
    this.gift = null;
    this.gifter = null;
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

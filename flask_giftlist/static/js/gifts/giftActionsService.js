app.service('giftActions', function() {
    this.claimDialogCtrl = null;
    this.editDialogCtrl = null;
    this.deleteDialogCtrl = null;
    this.selectedGift = null;
    thiz = this;
    
    this.register = function(claimDialogCtrl=null, editDialogCtrl=null, deleteDialogCtrl=null) {
        if( claimDialogCtrl ) {
            thiz.claimDialogCtrl = claimDialogCtrl;
        }
        if( editDialogCtrl ) {
            thiz.editDialogCtrl = editDialogCtrl;
        }
        if( deleteDialogCtrl ) {
            thiz.deleteDialogCtrl = deleteDialogCtrl;
        }
    }

    this.selectGift = function(gift) {
        thiz.selectedGift = gift;
    }

    this.claimSelected = function() {
        if( thiz.claimDialogCtrl ) {
            thiz.claimDialogCtrl.gift = thiz.selectedGift;
            thiz.claimDialogCtrl.showDialog();
        }
    }

    this.editSelected = function() {
        if( thiz.editDialogCtrl ) {
            thiz.editDialogCtrl.gift = thiz.selectedGift;
            thiz.editDialogCtrl.showDialog();
        }
    }

    this.deleteSelected = function() {
        if( thiz.deleteDialogCtrl ) {
            thiz.deleteDialogCtrl.gift = thiz.selectedGift;
            thiz.deleteDialogCtrl.showDialog();
        }
    }

});

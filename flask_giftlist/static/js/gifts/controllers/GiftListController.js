(function() {
    GiftListCtrl = function($scope, DataProvider, Dialogs, Notify) {
        this.gifts = DataProvider.gifts;
        this.loggedIn = false;//giftActions._loggedIn;
        this.notifications = Notify.notifications;
        var thiz = this;

        this.claimGift = function(index) {
            DataProvider.selectedIndex = index;
            Dialogs.showClaimDialog();
            //dataProvider.claim(dataProvider.selected());
        };

        this.editGift = function(index) {
            if( index !== undefined ) {
                DataProvider.selectedIndex = index;
            } else {
                //index = DataProvider.addGift();
                DataProvider.selectedGift = DataProvider.addGift();
            }
            Dialogs.showEditDialog();
            //giftActions.editSelected();
        };

        this.deleteGift = function(index) {
            DataProvider.selectedIndex = index;
            Dialogs.showDeleteDialog();
            //giftActions.deleteSelected();
        };

        this.closeDialog = function() {
            this.showForm = null;
        }

        this.update = function() {
            alert('update');
            DataProvider.updateGifts();
            this.gifts = DataProvider.gifts;
        }

        this.resolve = function() {
            DataProvider.updateGifts();
        };

        this.notify = function() {
            Notify.flashMessage({msg:"Some random message."});
        };

    };

    angular.module('GiftsApp').controller('GiftListCtrl', 
        ['$scope', 'DataProvider', 'Dialogs', 'Notify', GiftListCtrl]);
})();

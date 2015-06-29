(function() {
    GiftListCtrl = function($scope, DataProvider, Dialogs, Notify) {
        this.gifts = DataProvider.gifts;
        Object.defineProperty(this, 'loggedIn',{
            get: function(){return DataProvider.loggedIn;}
        });
        this.notifications = Notify.notifications;
        var thiz = this;

        this.claimGift = function(index) {
            DataProvider.selectedIndex = index;
            Dialogs.showClaimDialog();
            //dataProvider.claim(dataProvider.selected());
        }

        this.editGift = function(index) {
            if( index !== undefined ) {
                DataProvider.selectedIndex = index;
            } else {
                //index = DataProvider.addGift();
                DataProvider.selectedGift = DataProvider.addGift();
            }
            Dialogs.showEditDialog();
            //giftActions.editSelected();
        }

        this.deleteGift = function(index) {
            DataProvider.selectedIndex = index;
            Dialogs.showDeleteDialog();
            //giftActions.deleteSelected();
        }

        this.duplicateGift = function(index) {
            DataProvider.duplicateGift(index);
        }

        this.closeDialog = function() {
            this.showForm = null;
        }

        this.update = function() {
            DataProvider.updateGifts().then((function(gifts) {
                console.log("update permanent?");
                console.log(DataProvider.gifts);
            }).bind(this));
        }

        /*this.resolve = function() {
            DataProvider.updateGifts();
        }*/

        DataProvider.addListener((function() {
            $scope.$apply(this.gifts = DataProvider.gifts);
        }).bind(this));

        this.update();

    }

    angular.module('GiftsApp').controller('GiftListCtrl', 
        ['$scope', 'DataProvider', 'Dialogs', 'Notify', GiftListCtrl]);
})();

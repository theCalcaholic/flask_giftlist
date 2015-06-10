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
            //DataProvider.updateGifts.bind(DataProvider)();
            //this.gifts = DataProvider.gifts;
            DataProvider.updateGifts().then((function(gifts) {
                console.log("update permanent?");
                console.log(DataProvider.gifts);
                //this.gifts = gifts;
                //this.gifts = DataProvider.gifts;
                //$scope.giftList.gifts = this.gifts;
                //console.log("update finished: ");
                //console.log("DataProvider.gifts:");
                //console.log(DataProvider.gifts);
                //console.log("GiftListCtrl.gifts:");
                //console.log(this.gifts);
                //console.log("$scope.giftList.gifts: ");
                //console.log($scope.giftList.gifts);
                //console.log("gifts:");
                //console.log(gifts);
                //console.log("----");
            }).bind(this));


        }

        this.resolve = function() {
            DataProvider.updateGifts();
        };

        this.notify = function() {
            Notify.flashMessage({msg:"Some random message."});
        };
        

        /*DataProvider.retrieveGifts().then((function(gifts) {
            console.log("update finished: ");
            console.log(gifts);
            console.log(this.gifts);
            console.log("--");
            //this.gifts = gifts;
        }).bind(this));*/

        DataProvider.addListener((function() {
            this.gifts = DataProvider.gifts;
        }).bind(this));
        this.update();
        //
        /*console.log("testFunc1");
        TestService.testFunc1();
        console.log("testFunc2");
        TestService.testFunc2();
        console.log("testFunc3");
        TestService.testFunc3();
        //console.log("testFunc4");
        //TestService.testFunc4();
        console.log("testFunc5");
        TestService.testFunc5();
        console.log("testFunc6");
        TestService.testFunc6();*/

    };

    angular.module('GiftsApp').controller('GiftListCtrl', 
        ['$scope', 'DataProvider', 'Dialogs', 'Notify', GiftListCtrl]);
})();

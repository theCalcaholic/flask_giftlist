(function() {
    ClaimGiftCtrl = function(DataProvider) {
        this.gift = DataProvider.selectedGift;
        this.gifter = DataProvider.gifter;
        this.showMailText = true;

        this.submitClaim = function() {
            DataProvider.selectedGift = this.gift;
            DataProvider.server.claimGift( DataProvider.selectedIndex );
        };
    };

    angular.module('GiftsApp').controller('ClaimGiftCtrl', ['DataProvider', ClaimGiftCtrl]);
})();

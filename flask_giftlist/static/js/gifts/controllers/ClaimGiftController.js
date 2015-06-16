(function() {
    ClaimGiftCtrl = function(DataProvider) {
        this.gift = DataProvider.selectedGift;
        this.gifter = DataProvider.gifter;
        this.claimView = true;

        this.submitClaim = function() {
            DataProvider.selectedGift = this.gift;
            DataProvider.claimGift( DataProvider.selectedIndex );
        };
    };

    angular.module('GiftsApp').controller('ClaimGiftCtrl', ['DataProvider', ClaimGiftCtrl]);
})();

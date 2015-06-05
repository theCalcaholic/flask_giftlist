(function() {
    ClaimGiftCtrl = function(DataProvider) {
        this.gift = DataProvider.selectedGift;
        this.gifter = DataProvider.gifter;
        this.showMail = true;

        this.submitClaim = function() {
            alert('submit!');
        };
    };

    angular.module('GiftsApp').controller('ClaimGiftCtrl', ['DataProvider', ClaimGiftCtrl]);
})();

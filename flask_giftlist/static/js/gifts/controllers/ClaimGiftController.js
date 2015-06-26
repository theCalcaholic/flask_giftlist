(function() {
    ClaimGiftCtrl = function($scope, $timeout, DataProvider) {
        this.gift = DataProvider.selectedGift;
        this.gifter = DataProvider.gifter;
        this.claimView = true;

        this.submitClaim = function() {
            DataProvider.selectedGift = this.gift;
            DataProvider.claimGift( DataProvider.selectedIndex );
        };

        $timeout((function() {
            console.log(this);
            $scope.$apply(this.gift.prize = 10);
            $scope.$apply(this.gift.prize=this.gift.remaining_prize);
        }).bind(this), 200);
        console.log(this.gift);
    };

    angular.module('GiftsApp').controller('ClaimGiftCtrl', ['$scope', '$timeout', 'DataProvider', ClaimGiftCtrl]);
})();

//alert(dump(app));
app.controller('GiftFormController', ['$scope', function($scope) {
    //$scope.selected = null;
    $scope.giftFormDisplay = 'none';
    $scope.gifts = [];
    $scope.test = 'test';
    $scope.selectedGift = null;//$scope.gifts[0];
    //var form = angular.element($("#gift_form"));
    $scope.action = null;

    $scope.callGiftForm = function(giftIndex, $event) {
        //$scope.selected = giftIndex;
        if( giftIndex == null) {
            $scope.selectedGift = null;
        } else {
            $scope.selectedGift = $scope.gifts[giftIndex];
        }
        if( angular.element($event.target).hasClass('edit_button') ) {
            $scope.action = "gift/" + $scope.selectedGift.id + "/";
        } else if( angular.element($event.target).hasClass('claim_button') ) {
            $scope.action = "claim/" + $scope.selectedGift.id + "/";
        } else if( angular.element($event.target).hasClass('add-gift_button') ) {
            $scope.action = "gift/new/";
        }
        $scope.giftFormDisplay = 'flex';

    };
    $scope.closeGiftForm = function() {
        $scope.selected = null;
        $scope.giftFormDisplay = 'none';
    };
    $scope.showGiftForm = function() {
        $scope.giftFormDisplay = 'flex';
    };

    $scope.loadGifts = function( giftList ) {
        $scope.gifts = giftList;
    }

}]);

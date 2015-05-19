//alert(dump(app));
app.controller('GiftFormController', ['$scope', function($scope) {
    //$scope.selected = null;
    $scope.giftFormDisplay = 'none';
    $scope.gifts = [];
    $scope.test = 'test';
    $scope.selectedGift = null;//$scope.gifts[0];
    //var form = angular.element($("#gift_form"));

    $scope.callGiftForm = function(giftIndex) {
        //$scope.selected = giftIndex;
        $scope.giftFormDisplay = 'flex';
        $scope.selectedGift = $scope.gifts[giftIndex];

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

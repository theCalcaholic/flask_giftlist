//alert(dump(app));
app.controller('GiftFormController', ['$scope', function($scope) {
    $scope.giftForm = {
        'show': false,
        'action': null,
        'gift': null,
        'gifter': null
    };
    $scope.actionUrl = '';

    $scope.gifts = [];

    $scope.callGiftForm = function(giftIndex) {
        if( giftIndex == "new" ) {
            $scope.giftForm.gift = null;
            $scope.giftForm.action = $scope.actionUrl + "/new/";
            $scope.giftForm.show = true;
        } else if( giftIndex !== undefined ) {
            $scope.giftForm.gift = $scope.gifts[giftIndex];
            $scope.giftForm.action = $scope.actionUrl + "/" + $scope.gifts[giftIndex].id + "/";
            $scope.giftForm.show = true;
        } else {
            $scope.giftForm.action = null;
            $scope.giftForm.gift = null;
            $scope.giftForm.show = false;
        }
    }

    $scope.closeGiftForm = function() {
        $scope.giftForm.show = false;
    };

}]);

app.controller('claimGiftController', ['$scope', function($scope) {
    $scope.giftId = '';
    $scope.claimFormDisplay = 'none';
    $scope.claimGift = function(giftIndex) {
        $scope.giftId = giftIndex;
        $scope.claimFormDisplay = 'flex';
    };
    $scope.cancelClaimGift = function() {
        $scope.giftId = '';
        $scope.claimFormDisplay = 'none';
    };
    $scope.showClaimForm = function() {
        $scope.claimFormDisplay = 'flex';
    };
}]);



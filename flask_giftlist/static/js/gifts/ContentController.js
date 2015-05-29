//alert(dump(app));
app.controller('GiftFormController', ['$scope', function($scope) {

    $scope.showDeleteDialog = false;
    $scope.showEditDialog = false;
    $scope.showClaimDialog = false;

    $scope.gifts = [];
    $scope.gifter = null;
    $scope.currentGift = null;

    $scope.claimGift = function(giftIndex) {
        if( !$scope.claimDialog.gifter ) {
            $scope.claimDialog.gifter = $scope.gifter;
        }
        if( giftIndex !== undefined ) {
            $scope.claimDialog.gift = $scope.gifts[giftIndex];
            $scope.showClaimDialog = true;
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

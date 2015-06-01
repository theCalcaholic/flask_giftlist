app.controller('claimGiftCtrl', ['giftActions', function(giftActions) {
    this.gift = giftActions.selectedGift;
    this.showFull = true;
}]);

app.controller('giftListCtrl', ['$http', 'giftActions', function($http, giftActions) {
    this.gifts = null;
    this.loggedIn = false;
    var thiz = this;
   
    this.updateGifts = function() {
        $http.get('ajax/gifts')
            .success(function (data, status, headers, config) {
                thiz.gifts = data.gifts;
                thiz.loggedIn = data.loggedIn;
            })
            .error(function (data, status, headers, config) {
                alert('no no no no no!!!');
            });
    };

    this.claimGift = function(giftIndex) {
        giftActions.selectGift(this.gifts[giftIndex]);
        giftActions.claimSelected();
    };

    this.editGift = function(giftIndex) {
        giftActions.selectGift(this.gifts[giftIndex]);
        giftActions.editSelected();
    };

    this.deleteGift = function(giftIndex) {
        giftActions.selectGift(this.gifts[giftIndex]);
        giftActions.deleteSelected();
    };

    this.updateGifts();
}]);

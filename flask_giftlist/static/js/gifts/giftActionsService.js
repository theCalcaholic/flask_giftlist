app.service('dataProvider', function($location, $cookies, $http) {
    this._claimDialogCtrl = null;
    this._editDialogCtrl = null;
    this._deleteDialogCtrl = null;
    this._gifts;
    this._gift = null;
    this._gifter = null;
    this._loggedIn = null;
    this.giftsListeners = [];
    thiz = this;
    
    this.addGiftsListener = function(func) {
        this.giftsListeners.push(func);
    }

    this.register = function(claimDialogCtrl=null, editDialogCtrl=null, deleteDialogCtrl=null) {
        if( claimDialogCtrl ) {
            thiz._claimDialogCtrl = claimDialogCtrl;
        }
        if( editDialogCtrl ) {
            thiz._editDialogCtrl = editDialogCtrl;
        }
        if( deleteDialogCtrl ) {
            thiz._deleteDialogCtrl = deleteDialogCtrl;
        }
    };

    this.claimDialogCtrl = function(ctrl) {
        this._claimDialogCtrl = ctrl;
    };

    this.editDialogCtrl = function(ctrl) {
        this._editDialogCtrl = ctrl;
    };
    this.deleteDialogCtrl = function(ctrl) {
        this._deleteDialogCtrl = ctrl;
    };

    this.addGift = function(gift=null) {
        if( gift ) {
            this._gifts.push(gift);
        } else {
            for( var gift in thiz._gifts ) {
                if( gift.id = null ) {
                    return;
                }
            }
            this._gifts.push({
                'id': null,
                'giftName': null,
                'description': null,
                'prize': null,
                'url': null,
                'mailText': null,
                'image': null,
            });
        }
    }

    this.updateGifts = function() {
        $http.get('ajax/gifts')
            .success(function (data, status, headers, config) {
                gifts = data.gifts;
                for( var i = 0; i < gifts.length; i++) {
                    gifts[i].giftName = gifts[i].name;
                    gifts[i].mailText = gifts[i].mail_text;
                }
                thiz._gifts = gifts;
                thiz._loggedIn = data.loggedIn;
                if( !thiz._loggedIn ) {
                    thiz.loadPath();
                }

            })
            .error(function (data, status, headers, config) {
                alert('no no no no no!!!');
            });
        for( var giftList in thiz.giftsListeners ) {
            giftList = thiz._gifts;
        }
    }

    this.gifts = function() {
        if( !thiz._gifts ) {
            thiz.updateGifts();
        }
        return thiz._gifts;
    }

    this.gift = function(giftId=undefined) {
        if( !thiz._gifts ) {
            thiz.updateGifts();
        }
        if( giftId === undefined ) {
            giftId = $cookies.get('giftId');
        }
        if( thiz._gifts && giftId ) {
            for( var i = 0; i < thiz._gifts.length; i++ ) {
                if( thiz._gifts[i].id === giftId ) {
                    thiz._gift = thiz._gifts[i];
                }
            }
            $cookies.put('giftId', this._gift.id);
        } else if( !this._gift ) {
            this._gift = {
                'giftName': null,
                'prize': null,
                'url': null,
                'description': null,
                'mailText': null,
                'image': null };
        }
        return thiz._gift;
    };

    this.gifter = function(gifter = null) {
        if( gifter ) {
            thiz._gifter = gifter;
            $cookies.put('gifter', thiz._gifter);
        } else if( !thiz._gifter ) {
            gifter = $cookies.get('gifter');
            if( gifter ) {
                thiz._gifter = gifter;
            } else {
                thiz._gifter = {
                    'surname': null,
                    'lastname': null,
                    'email': null,
                    'email_confirm': null };
            }
        }
        return angular.copy(thiz._gifter);
    }

    this.loadPath = function() {
        if( thiz.gift() && thiz.gifter() ) {
            $location.path('/claim/');
        }
    };

    this.claimSelected = function() {
        if( thiz._claimDialogCtrl ) {
            if( thiz.gifter ) {
                thiz._claimDialogCtrl.gifter = thiz.gifter;
            }
            thiz._claimDialogCtrl.showDialog();
        }
    }

    this.editSelected = function() {
        if( thiz._editDialogCtrl ) {
            thiz._editDialogCtrl.gift = thiz.selectedGift;
            thiz._editDialogCtrl.showDialog();
        }
    }

    this.deleteSelected = function() {
        if( thiz._deleteDialogCtrl ) {
            thiz._deleteDialogCtrl.gift = thiz.selectedGift;
            thiz._deleteDialogCtrl.showDialog();
        }
    }

});

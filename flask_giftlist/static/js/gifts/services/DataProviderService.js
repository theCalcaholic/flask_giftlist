(function() {
    DataProvider = function($http, Notify) {
        var _gifts = undefined;
        var _gifter = {
            surname: null,
            name: null,
            email: null
        };
        var _newGift = null;
        var _selectedIndex = undefined;


        serverSaveGift = function(index) {
            $http.post('gift/' + _gifts[index].id + '/', _gifts[index])
                .success(function(data, status, headers, config) {
                    Notify.flashMessage('Erfolgreich gespeichert');
                })
                .error(function(data, status, headers, config) {
                    Notify.flashMessage('Speichern fehlgeschlagen.', type='error');
                    _selectedIndex = index;
                    Dialogs.showEditDialog();
                });
        };

        serverClaimGift = function(index) {
            if( _gifter ) {
                data = _gifter;
                data.giftId = _gifts[index].id;
                $http.post('claim/' + _gifts[index].id + '/', data)
                    .success(function(data, status, headers, config) {
                    })
                    .error(function(data, status, headers, config) {
                    });
            }
        };

        serverDeleteGift = function(index) {
            alert('delete!');
            $http.get('gift/' + _gifts[index].id + '/delete/')
                .success(function(data, status, headers, config) {
                    Notify.flashMessage('Geschenk gelöscht.');
                    _selectedIndex = undefined;
                })
                .error(function(data, status, headers, config) {
                    Notify.flashMessage('Löschen fehlgeschlagen.', type='error');
                    _selectedIndex = index;
                });
        }

        getGifts = function() {
            if( _gifts === undefined ) {
                return updateGifts();
            } else {
                return _gifts;
            }
        };

        updateGifts = function() {
            $http.get('ajax/gifts/')
                .success(function(data, status, headers, config) {
                    gifts = data.gifts;
                    for( var i=0; i < gifts.length; i++ ) {
                        gifts[i]['giftName'] = gifts[i]['name'];
                        gifts[i]['mailText'] = gifts[i]['mail_text'];
                        delete gifts[i].name;
                        delete gifts[i].mail_text;
                    }
                    _gifts = gifts;
                })
                .error(function(data, status, headers, config) {
                    alert("Nooooooooooooooooooooo!!!!");
                });
            return _gifts;
        };

        getGift = function(index, giftData=undefined) {
            if( giftData !== undefined ) {
                _gifts[index] = giftData;
            }
            return _gifts[index];
        };

        addGift = function(giftData=undefined) {
            if( giftData !== undefined ) {
                _newGift = giftData;
            } else {
                _newGift = {
                    id: 'new',
                    giftName: null,
                    prize: null,
                    url: null,
                    description: null,
                    mailText: null
                };
            }
            return (gifts.length - 1);
        };


        giftById = function(id) {
            for( gift in _gifts ) {
                if( gift.id === id ) {
                    return gift;
                }
            }
        };

        getSelectedGift = function() {
            if( _selectedIndex === undefined ) {
                return null;
            } else if( _selectedIndex === 'new' ) {
                return _newGift;
            } else {
                return _gifts[_selectedIndex];
            }
        };

        setSelectedGift = function(gift) {
            if( gift === undefined ) {
                _selectedIndex = undefined;
            } else if( gift.id ) {
                for( var i=0; i < _gifts.length; i++ ) {
                    if( _gifts[i].id = gift.id ) {
                        _selectedIndex = i;
                    }
                }
            }
        };

        setSelectedIndex = function(index) {
            if( index !== undefined && index < _gifts.length ) {
                _selectedIndex = index;
            }
            return _selectedIndex;
        };

        getSelectedIndex = function() {
            return _selectedIndex;
        };

        DataProvider = {
            get gifts() { 
                return getGifts();
            },
            updateGifts: updateGifts,
            get selectedGift() {
                return getSelectedGift();
            },
            set selectedGift(gift) {
                setSelectedGift(gift);
            },
            giftById: giftById,
            addGift: addGift,
            gifter: _gifter,
            get selectedIndex() {
                return getSelectedIndex();
            },
            set selectedIndex(index) {
                setSelectedIndex(index);
            },

            server: {
                saveGift: serverSaveGift,
                claimGift: serverClaimGift,
                deleteGift: serverDeleteGift
            }
        };

        return DataProvider;
    };


    angular.module('GiftsApp').factory("DataProvider", ['$http', 'Notify', DataProvider]);
})();


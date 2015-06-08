(function() {
    DataProvider = function($http, $location, Dialogs, Notify) {
        var _gifts = undefined;
        var _gifter = {
            surname: null,
            name: null,
            email: null
        };
        var _newGift = null;
        var _selectedIndex = undefined;


        serverSaveGift = function(index) {
            if( index && index === 'new' ) {
                gift = _newGift;
            } else if( index < _gifts.length ) {
                gift = _gifts[index];
            } else {
                Notify.flashMessage("Internal error: No such gift!");
                return
            }
            $http.post('gift/' + gift.id + '/', gift)
                .success(function(data, status, headers, config) {
                    if(data.errors.length) {
                        alert(data.errors);
                        Notify.flashMessage({
                            msg:'Speichern fehlgeschlagen.', 
                            type:'error', 
                            subMsgs:data.errors
                        });
                        _selectedIndex = index;
                        Dialogs.showEditDialog();
                    } else {
                        Notify.flashMessage({msg: 'Erfolgreich gespeichert'});
                    }
                })
                .error(function(data, status, headers, config) {

                    alert(data.errors);
                    Notify.flashMessage({
                        msg: 'Speichern fehlgeschlagen.', 
                        type:'error', 
                        subMsgs:data.errors
                    });
                    _selectedIndex = index;
                    Dialogs.showEditDialog();
                });
        };

        serverClaimGift = function(index) {
            if( _gifter && index < _gifts.length ) {
                data = _gifter;
                data.giftId = _gifts[index].id;

                errorMsg = "Beim reservieren des Geschenks ist ein Fehler aufgetreten. Bitte versuchen sie es noch einmal.";
                claimingMsgId = Notify.showMessage({
                    msg: 'Das Geschenk wird reserviert. Bitte warten...',
                    type: 'info'
                });

                $http.post('claim/' + _gifts[index].id + '/', data)
                    .success(function(data, status, headers, config) {
                        //alert('good status');
                        Notify.hideMessage(claimingMsgId);
                        if(data.errors.length) {
                            //alert('errors!');
                            Notify.flashMessage({
                                msg: errorMsg,
                                subNotifications: data.errors,
                                type: 'error',
                                duration: 5000
                            });
                        } else {
                            //alert('success');
                            Notify.flashMessage({
                                msg: "Das Geschenk wurde reserviert.\n\rEine E-Mail mit allen wichtigen Informationen wurde an die angegebene E-Mail-Adresse versandt."});
                            $location.path('/');
                        }
                    })
                    .error(function(data, status, headers, config) {
                        //alert('bad status!');
                        Notify.hideMessage(claimingMsgId);
                        Notify.flashMessage({
                            msg: errorMsg,
                            subNotifications: data.errors,
                            type: 'error',
                            duration: 5000
                        });
                    });
            }
        };

        serverDeleteGift = function(index) {
            $http.get('gift/' + _gifts[index].id + '/delete/')
                .success(function(data, status, headers, config) {
                    Notify.flashMessage({msg: 'Geschenk gelöscht.'});
                    _selectedIndex = undefined;
                })
                .error(function(data, status, headers, config) {
                    Notify.flashMessage({
                        msg: 'Löschen fehlgeschlagen.', 
                        type: 'error', 
                        duration: 5000,
                        subNotifications: data.errors
                    });
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
            if( !_newGift ) {
                if( giftData !== undefined ) {
                    _newGift = giftData;
                } else {
                    _newGift = {
                        id: 'new',
                        giftName: null,
                        prize: null,
                        url: '',
                        description: null,
                        mailText: null
                    };
                }
                return _newGift;
            }
            return null;
        };


        giftById = function(id) {
            if( id === 'new' && _newGift ) {
                return _newGift;
            } else {
                for( gift in _gifts ) {
                    if( gift.id === id ) {
                        return gift;
                    }
                }
                return null;
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
                if( _newGift && _newGift.id == gift.id ) {
                    return _selectedIndex = 'new';
                }

                for( var i=0; i < _gifts.length; i++ ) {
                    if( _gifts[i].id = gift.id ) {
                        _selectedIndex = i;
                    }
                }
            }
        };

        setSelectedIndex = function(index) {
            if( index !== undefined && (index === 'new' || index < _gifts.length) ) {
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


    angular.module('GiftsApp').factory("DataProvider", ['$http', '$location', 'Dialogs', 'Notify', DataProvider]);
})();


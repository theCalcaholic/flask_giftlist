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
                url = 'ajax/gift/' + gift.id + '/';
            } else if( index < _gifts.length ) {
                gift = _gifts[index];
                url = 'ajax/gift/' + gift.id + '/save/';
            } else {
                Notify.flashMessage("Internal error: No such gift!");
                return
            }
            data = new FormData();
            data.append('giftName', gift.giftName);
            data.append('prize', gift.prize);
            data.append('url', gift.url);
            data.append('description', gift.description);
            data.append('mailText', gift.mailText);
            data.append('image', gift.image);
            data.append('deleteImage', Boolean(gift.deleteImage));
            if( gift.imageFile ) {
                data.append('imageFile', gift.imageFile);
            }

            $http.post(url, data, {
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).success(function(data, status, headers, config) {
                    if(data.errors.length) {
                        Notify.flashMessage({
                            msg:'Speichern fehlgeschlagen.', 
                            type:'error', 
                            subMsgs:data.errors
                        });
                        _selectedIndex = index;
                        Dialogs.showEditDialog();
                    } else {
                        Notify.flashMessage({msg: 'Erfolgreich gespeichert'});
                        console.log(this);
                        updateGifts();
                    }
                }.bind(this))
                .error(function(data, status, headers, config) {
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

                $http.post('ajax/claim/' + _gifts[index].id + '/', data)
                    .success(function(data, status, headers, config) {
                        //alert('good status');
                        Notify.hideMessage(claimingMsgId);
                        if(data.errors.length) {
                            //alert('errors!');
                            Notify.flashMessage({
                                msg: errorMsg,
                                subMsgs: data.errors,
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
                            subMsgs: data.errors,
                            type: 'error',
                            duration: 5000
                        });
                    });
            }
        };

        serverDeleteGift = function(index) {
            $http.post('ajax/gift/' + _gifts[index].id + '/delete/')
                .success(function(data, status, headers, config) {
                    Notify.flashMessage({msg: 'Geschenk gelöscht.'});
                    selectedIndex = undefined;
                    updateGifts.bind(this)();
                })
                .error(function(data, status, headers, config) {
                    Notify.flashMessage({
                        msg: 'Löschen fehlgeschlagen.', 
                        type: 'error', 
                        duration: 5000,
                        subMsgs: data.errors
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
                    Notify.flashMessage({
                        msg: 'Die Geschenkliste konnte nicht geladen werden.',
                        type: 'error',
                        duration: 7000
                    });
                });
            console.log(_gifts);
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
                        giftName: undefined,
                        prize: undefined,
                        url: '',
                        description: undefined,
                        mailText: undefined,
                        image: undefined,
                        imageFile: undefined
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
            saveGift: serverSaveGift,
            claimGift: serverClaimGift,
            deleteGift: serverDeleteGift,
            gifter: _gifter,
            get selectedIndex() {
                return getSelectedIndex();
            },
            set selectedIndex(index) {
                setSelectedIndex(index);
            },
        };

        return DataProvider;
    };


    angular.module('GiftsApp').factory("DataProvider", ['$http', '$location', 'Dialogs', 'Notify', DataProvider]);
})();


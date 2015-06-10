(function() {
    DataProvider = function($q, $http, $location, Dialogs, Notify) {
        var _callbacks = [];
        //var _gifts = [];
        var _gifter = {
            surname: null,
            name: null,
            email: null
        };
        var _newGift = null;
        var _selectedIndex = undefined;
        this.identity = 'DataProviderfactory';


        DataProvider = {};

        DataProvider.gifts = [];

        Object.defineProperty(DataProvider, 'selectedGift', {
            get: function() {
                if( _selectedIndex === undefined ) {
                    return null;
                } else if( _selectedIndex === 'new' ) {
                    return _newGift;
                } else {
                    return DataProvider.gifts[_selectedIndex];
                }
            },
            set: function(gift) {
                if( gift === undefined ) {
                    _selectedIndex = undefined;
                } else if( gift.id ) {
                    if( _newGift && _newGift.id == gift.id ) {
                        return _selectedIndex = 'new';
                    }

                    for( var i=0; i < DataProvider.gifts.length; i++ ) {
                        if( DataProvider.gifts[i].id = gift.id ) {
                            _selectedIndex = i;
                        }
                    }
                }
            },
            configurable: true
        });

        DataProvider.gifter = _gifter;

        Object.defineProperty(DataProvider, 'selectedIndex', {
            get: function() {
                return _selectedIndex;
            },
            set: function(index) {
                if( index !== undefined && (index === 'new' || index < DataProvider.gifts.length) ) {
                    _selectedIndex = index;
                }
            }
        });

        DataProvider.saveGift = function(index) {
            if( index && index === 'new' ) {
                gift = _newGift;
                url = 'ajax/gift/' + gift.id + '/';
            } else if( index < _gifts.length ) {
                gift = DataProvider.gifts[index];
                url = 'ajax/gift/' + gift.id + '/save/';
            } else {
                Notify.flashMessage("Internal error: No such gift!");
                return
            }
            data = new FormData();
            data.append('giftName', gift.giftName || '');
            data.append('prize', gift.prize || '');
            data.append('url', gift.url || '');
            data.append('description', gift.description || '');
            data.append('mailText', gift.mailText || '');
            data.append('image', gift.image || '');
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
                        DataProvider.updateGifts();
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

        DataProvider.claimGift = function(index) {
            if( _gifter && index < DataProvider.gifts.length ) {
                data = _gifter;
                data.giftId = DataProvider.gifts[index].id;

                errorMsg = "Beim reservieren des Geschenks ist ein Fehler aufgetreten. Bitte versuchen sie es noch einmal.";
                claimingMsgId = Notify.showMessage({
                    msg: 'Das Geschenk wird reserviert. Bitte warten...',
                    type: 'info'
                });

                $http.post('ajax/claim/' + DataProvider.gifts[index].id + '/', data)
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

        DataProvider.deleteGift = function(index) {
            $http.post('ajax/gift/' + DataProvider.gifts[index].id + '/delete/')
                .success(function(data, status, headers, config) {
                    Notify.flashMessage({msg: 'Geschenk gelöscht.'});
                    selectedIndex = undefined;
                    DataProvider.updateGifts();
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

        DataProvider.retrieveGifts = function() {
            if( DataProvider.gifts === undefined ) {
                return $q(function(resolve, reject) {
                    DataProvider.updateGifts().then(function(data) {
                    return data;
                    },
                    function(data) {
                        return $q.reject(data);
                    });
                });
            } else {
                return $q(function(resolve, reject) {
                    resolve(DataProvider.gifts)
                });
            }
        };

        DataProvider.updateGifts = function() {
            return $http.get('ajax/gifts/')
                .success(function(data, status, headers, config) {
                    gifts = data.gifts;
                    DataProvider.gifts = gifts;
                    console.log("gifts updated: ");
                    console.log(DataProvider.gifts);
                    for(index in _callbacks) {
                        _callbacks[index]();
                    }
                    return DataProvider.gifts;
                })
                .error(function(data, status, headers, config) {
                    Notify.flashMessage({
                        msg: 'Die Geschenkliste konnte nicht geladen werden.',
                        type: 'error',
                        duration: 7000
                    });
                    return $q.reject(DataProvider.gifts);
                });
        };


        DataProvider.addGift = function(giftData=undefined) {
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


        DataProvider.giftById = function(id) {
            if( id === 'new' && _newGift ) {
                return _newGift;
            } else {
                for( gift in DataProvider.gifts ) {
                    if( gift.id === id ) {
                        return gift;
                    }
                }
                return null;
            }
        };


        /*Object.defineProperty(DataProvider, 'gifts', {
            get: function() {
                return _gifts;
            },
            //writable: false
        });*/

        DataProvider.addListener = function(callback) {
            _callbacks.push(callback);
        };


        return DataProvider;
    };


    angular.module('GiftsApp').factory("DataProvider", ['$q', '$http', '$location', 'Dialogs', 'Notify', DataProvider]);
})();


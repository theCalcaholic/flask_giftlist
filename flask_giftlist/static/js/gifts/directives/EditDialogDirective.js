(function() {
    EditDialogCtrl = function($location, $http, DataProvider, Dialogs) {
        this.gift = DataProvider.selectedGift;
        this.shown = false;
        this.name = 'edit';

        this.show = function() {
            this.shown = true;
            this.gift = DataProvider.selectedGift;
            if( this.gift ) {
                this.form.$setDirty();
            }
        }

        this.close = function() {
            this.shown = false;
        }

        this.submit = function() {
            if( this.form.$valid ) {
                this.close();
                /*$http.post('/gift/new/', {
                    'name': this.gift.giftName,
                    'prize': this.gift.prize,
                    'url': this.gift.url,
                    'description': this.gift.description,
                    'mail_text': this.gift.mailText,
                    'image': null,
                    'csrf_token': this.editDialog.csrfToken
                }).success(function(data, status, headers, config) {
                    alert('success: ' + data.error);
                    dataProvider.updateGifts();
                }).error(function(data, status, headers, config) {
                    alert('error: ' + data.error);
                });*/
                //DataProvider.selectedGift = this.gift;
                DataProvider.saveGift(DataProvider.selectedIndex);
                this.form.$setPristine();
            } else {
                this.form.$setDirty();
            }
        
        };

        validString = function(bl) {
            if(bl) {
                return 'valid';
            } else {
                return 'invalid';
            }
        }

        this.debug = function() {
            console.log(this.dialog);
            console.log(this.form);
            console.log(this.form.imageMethod);
        };

        Dialogs.editDialog(this);

    };

    EditDialogDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'ajax/template/editDialog.html',
            replace: true,
            scope:{},
            controller: [
                '$location', 
                '$http', 
                'DataProvider', 
                'Dialogs', 
                EditDialogCtrl],
            controllerAs: 'dialog'
        };
    };

    angular.module('GiftsApp').directive('editDialog', EditDialogDirective);
})();

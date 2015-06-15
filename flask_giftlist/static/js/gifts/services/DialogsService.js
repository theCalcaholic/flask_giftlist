(function() {
    Dialogs = function() {
        var _editDialogCtrl = null;
        var _claimDialogCtrl = null;
        var _deleteDialogCtrl = null;
        return {
            editDialog: function(dialog) {
                if(dialog !== undefined) {
                    _editDialogCtrl = dialog;
                }
                return _editDialogCtrl;
            },
            claimDialog: function(dialog) {
                _claimDialogCtrl = dialog;
            },

            deleteDialog: function(dialog) {
                if(dialog !== undefined) {
                    _deleteDialogCtrl = dialog;
                }
                return _deleteDialogCtrl;
            },
            showEditDialog: function() {
                _editDialogCtrl.show();//.bind(_editDialogCtrl);
            },
            showClaimDialog: function() {
                _claimDialogCtrl.show();
            },
            showDeleteDialog: function() {
                _deleteDialogCtrl.show();//.bind(_deleteDialogCtrl);
            }
        };
    };

    angular.module('GiftsApp').factory("Dialogs", Dialogs);
})();

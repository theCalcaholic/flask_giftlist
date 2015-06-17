(function() {
    FieldErrors = function() {
        return {
            restrict: 'E',
            scope: {
                field: "=field",
            },
            templateUrl: 'template/fieldErrorMsgs.html',
            replace: true
        };
    };
    
    angular.module('GiftsApp').directive("fieldErrors", FieldErrors);
})();

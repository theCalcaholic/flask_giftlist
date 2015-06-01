app.directive("fieldErrors", function() {
    return {
        restrict: 'E',
        scope: {
            field: "=field",
        },
        templateUrl: 'ajax/template/fieldErrorMsgs.html',
        replace: true
    };
});

app.directive('equalTo', ['$parse', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            compareValue: "=equalTo",
        },
        link: function($scope, elem, attrs, ctrl) {
            $scope.$watch("compareValue", function() {
                ctrl.$validate();
            });
            ctrl.$validators.equalTo = function(modelValue, viewValue) {
                if( $scope.compareValue === modelValue ) {
                    return true;
                } else {
                    return false;
                }
            };
        }
    };
}]);

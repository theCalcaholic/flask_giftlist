(function() {
    GiftDirective = function() {
        return {
            restrict: 'EA',
            templateUrl: 'ajax/template/gift.html',
        };
    };

    angular.module('GiftsApp').directive('gift', GiftDirective);
})();

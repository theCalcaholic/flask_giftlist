(function() {
    GiftDirective = function() {
        return {
            restrict: 'EA',
            templateUrl: 'template/gift.html',
        };
    };

    angular.module('GiftsApp').directive('gift', GiftDirective);
})();

angular.module('GiftsApp', ['ngRoute', 'ngMessages', 'ngCookies'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'ajax/template/giftList.html',
                controller: 'GiftListCtrl',
                controllerAs: 'giftList'
            })
        
            .when('/claim/', {
                templateUrl: 'ajax/template/claimGift.html',
                controller: 'ClaimGiftCtrl',
                controllerAs: 'vm'
            });

        $locationProvider.html5Mode(true);
    }]);


angular.module('GiftsApp', ['ngRoute', 'ngMessages', 'ngCookies'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'template/giftList.html',
                controller: 'GiftListCtrl',
                controllerAs: 'giftList'
            })
        
            .when('/claim/', {
                templateUrl: 'template/claimGift.html',
                controller: 'ClaimGiftCtrl',
                controllerAs: 'vm'
            });

        $locationProvider.html5Mode(true);
    }]);


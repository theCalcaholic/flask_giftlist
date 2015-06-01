var app = angular.module('giftListApp', ['ngRoute', 'ngMessages']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'ajax/template/giftList.html',
            controller: 'giftListCtrl'
        })
    
        .when('/claim/', {
            templateUrl: 'ajax/template/claimGift.html',
            controller: 'giftListCtrl',
            controllerAs: 'vm'
        });

    $locationProvider.html5Mode(true);
});


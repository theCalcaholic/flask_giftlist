var app = angular.module('giftListApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'ajax/template/giftList.html',
            controller: 'giftListCtrl'
        })
    
        .when('/claim/', {
            templateUrl: 'ajax/template/claimGift.html',
            controller: 'claimGiftCtrl',
            controllerAs: 'vm'
        });

    //$locationProvider.html5Mode(true);
});


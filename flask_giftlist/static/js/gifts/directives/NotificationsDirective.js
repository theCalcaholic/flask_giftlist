(function() {
    NotificationsCtrl = function($scope, Notify) {
        $scope.notifications = Notify.notifications;
        $scope.test = "it works!";

        $scope.hideMessage = function() {
            Notify.hideMessage.bind(Notify)();
            $scope.notifications = Notify.notifications;
        };


    };

    NotificationsDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'template/notifications.html',
            replace: true,
            transclude: false,
            controller: ['$scope', 'Notify', NotificationsCtrl]
        };
    };

    angular.module('GiftsApp').directive('notifications', NotificationsDirective);
})();

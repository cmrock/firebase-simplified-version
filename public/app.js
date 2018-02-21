'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.newStories',
    'myApp.topStories',
    'myApp.bestStories',
    'myApp.ask',
    'myApp.jobs'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/newStories'});

}])
    .controller('mainCtrl',['$scope','$location',function($scope, $location){
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }]);

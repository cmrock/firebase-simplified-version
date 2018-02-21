'use strict';

angular.module('myApp.bestStories', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/bestStories', {
            templateUrl: 'stories/bestStories/bestStories.html',
            controller: 'BestStoriesCtrl'
        });
    }])

    .controller('BestStoriesCtrl', ['$scope','$http', function ($scope, $http, $localStorage) {
        $scope.allStories = [];
        var self = this;

        /*
         * @description
         * Function to initialize view and get all the best stories.
         * store all ask stories in allStories array.
         * */
        this.init = function () {
            $http.get('https://hacker-news.firebaseio.com/v0/beststories.json').then(function (response) {
                return response.data;  //returns all best story ids
            }).then(function (storyIDs) {
                _.forEach(storyIDs, function (value, key) {
                    $http.get('https://hacker-news.firebaseio.com/v0/item/' + value + '.json').then(function (response) {
                        $scope.allStories.push(response.data);
                    });
                });
            });
        };

        self.init();
    }]);
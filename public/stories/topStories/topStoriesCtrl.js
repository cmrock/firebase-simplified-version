'use strict';

angular.module('myApp.topStories', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/topStories', {
            templateUrl: 'stories/topStories/topStories.html',
            controller: 'TopStoriesCtrl'
        });
    }])

    .controller('TopStoriesCtrl', ['$scope','$http', function ($scope, $http) {
        $scope.allStories = [];
        var self = this;

        /*
         * @description
         * Function to initialize view and get all the top stories.
         * store all top stories in allStories array.
         * */
        this.init = function () {
            $http.get('https://hacker-news.firebaseio.com/v0/topstories.json').then(function (response) {
                return response.data; // returns all top story ids
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
'use strict';

angular.module('myApp.newStories', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/newStories', {
            templateUrl: 'stories/newStories/newStories.html',
            controller: 'NewStoriesCtrl'
        });
    }])

    .controller('NewStoriesCtrl', ['$scope','$http', function ($scope, $http) {
        $scope.allStories = [];
        var self = this;

        /*
         * @description
         * Function to initialize view and get all the new stories.
         * store all ask stories in allStories array.
         * */
        this.init = function () {
            $http.get('https://hacker-news.firebaseio.com/v0/newstories.json').then(function (response) {
                return response.data;
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
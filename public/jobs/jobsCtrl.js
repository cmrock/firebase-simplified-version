'use strict';

angular.module('myApp.jobs', ['ngRoute','ngSanitize'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/jobs', {
            templateUrl: 'jobs/jobs.html',
            controller: 'JobsCtrl'
        });
    }])
    .controller('JobsCtrl', ['$scope','$http', function ($scope, $http) {

        var self = this;
        $scope.allJobs = [];

        /*
         * @description
         * Function to initialize view and get all the job stories.
         * store all job stories in allJobs array.
         * */
        this.init = function () {
            $http.get(' https://hacker-news.firebaseio.com/v0/jobstories.json').then(function (response) {
                return response.data;
            }).then(function (jobIDs) {
                _.forEach(jobIDs, function (value, key) {
                    $http.get(' https://hacker-news.firebaseio.com/v0/item/' + value + '.json').then(function (response) {
                        $scope.allJobs.push(response.data);
                    });
                });
            });
        };

        self.init();

        /*
         * @description
         * Function to load more items
         * */
        $scope.loadIndex = 10;
        $scope.loadMore = function() {
            if ($scope.loadIndex < $scope.allJobs.length) {
                $scope.loadIndex += 10;
            }
        };
    }]);
'use strict';

angular.module('myApp.ask', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/ask', {
            templateUrl: 'ask/ask.html',
            controller: 'AskCtrl'
        });
    }])
    .controller('AskCtrl', ['$scope','$http', function ($scope, $http) {

        var self = this;
        $scope.allAsk = [];
        $scope.allComments = [];
        $scope.newComment = {};

        /*
        * @description
        * Function for generating 8 digit random numbers
        * */
        function generateRandomID (){
            return Math.floor(10000000 + Math.random() * 90000000);
        }
        /*
         * @description
         * Function to initialize view and get all the ask stories.
         * store all ask stories in allAsk array.
         * */
        this.init = function () {
            $http.get(' https://hacker-news.firebaseio.com/v0/askstories.json').then(function (response) {
                return response.data; // returns all ask story ids
            }).then(function (askIDs) {
                _.forEach(askIDs, function (value, key) {
                    $http.get(' https://hacker-news.firebaseio.com/v0/item/' + value + '.json').then(function (response) {
                        $scope.allAsk.push(response.data);
                    });
                });
            });
        };
        self.init();

        /*
         * @params (askID, commentIDs)
         * @description
         * Function to get comments on particular ask story.
         * store all the comments in allComments array.
         * */
        $scope.getComments = function(askID, commentIDs){
            if(commentIDs){
                $scope.commentIDS = commentIDs;
                _.forEach($scope.commentIDS, function(value,key){
                    $http.get(' https://hacker-news.firebaseio.com/v0/item/'+value+'.json').
                    then(function(response) {
                        if(!$scope.allComments[askID]){$scope.allComments[askID] = [];}
                        $scope.allComments[askID].push(response.data);
                    });
                });
            }else{
                $scope.allComments[askID] = [];
            }
        };

        /*
         * @params (askID, cmt)
         * @description
         * Function to add comment in ask story and store that comment in ask story as kids.
         * */
        $scope.addCommentInAsk = function(askID, cmt){
            cmt.id = generateRandomID();
            cmt.type = "comment";
            cmt.time = moment();

            if(!$scope.allComments[askID])
            {
                $scope.allComments[askID] = [];  // create askID empty array as a object in allComments array.
            }

            $scope.allComments[askID].push(cmt); // push comment in particular ask story.

            var ask = _.find($scope.allAsk,{id:askID}); // find ask story from all ask stories

            if(!ask.kids){ ask.kids = [];}
            ask.kids.push(cmt.id);
            $scope.newComment = {};
        };

        /*
         * @description
         * Function to load more items
         * */
        $scope.loadIndex = 10;
        $scope.loadMore = function() {
            if ($scope.loadIndex < $scope.allStories.length) {
                $scope.loadIndex += 10;
            }
        };
    }])
    /*
     * @description
     * filter to count total comments in ask stories
     * */
    .filter('cmtCount', function(){
        return function(input) {
            // console.log(input);
            // var count =4;
            if(input && input.length>0){
                return input.length;
            }else{
                return 'No';
            }
        };
    });
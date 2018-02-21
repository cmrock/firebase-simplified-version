'use strict';

angular.module('myApp').directive('storyKind', function() {
        return {
            restrict: 'EA',
            templateUrl: '/stories/directive/story-kind.html',
            scope: {
                allStories:'='  // all stories kind which includes new, best or top stories.
            },
            controller: function($scope, $http) {

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
                 * @params (storyID, commentIDs)
                 * @description
                 * Function to get comments on particular story.
                 * store all the comments in allComments array.
                 * */
                $scope.getComments = function(storyID, commentIDs){
                    if(commentIDs){
                        $scope.commentIDS = commentIDs;
                        _.forEach($scope.commentIDS, function(value,key){
                            $http.get(' https://hacker-news.firebaseio.com/v0/item/'+value+'.json').
                            then(function(response) {
                                if(!$scope.allComments[storyID]){$scope.allComments[storyID] = [];}
                                $scope.allComments[storyID].push(response.data);
                            });
                        });
                    }else{
                        $scope.allComments[storyID] = [];
                    }
                };

                /*
                * @params (storyID, cmt)
                * @description
                * Function to add comment in story (top/best/new) and store that comment in story as kids.
                * */
                $scope.addCommentInStory = function(storyID, cmt){
                    cmt.id = generateRandomID();
                    cmt.type = "comment";
                    cmt.time = moment();

                    if(!$scope.allComments[storyID])
                    {
                        $scope.allComments[storyID] = []; // create storyID empty array as a object in allComments array.
                    }

                    $scope.allComments[storyID].push(cmt);  // push comment in particular story.

                    var story = _.find($scope.allStories,{id:storyID}); // find story from all stories

                    if(!story.kids){ story.kids = [];}
                    story.kids.push(cmt.id);
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
            }
        };
    })
    // filter to set time diff from now: eg: a few seconds ago or 10 minutes ago
    .filter('timeAgo', ['$interval', function($interval){
    // trigger digest every 60 seconds
    $interval(function (){}, 60000);

    function fromNowFilter(time){
        return moment(time).fromNow();
    }

    fromNowFilter.$stateful = true;
    return fromNowFilter;
}]);

var app = angular.module( 'myVirtualPack');

app.controller( 'MainCtrl', ['$scope', 'posts', 'auth', mainCtrl]);

function mainCtrl ($scope, posts, auth) {
  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };
  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };
  $scope.decrementUpvotes = function(post) {
    posts.upvote(post);
  }
}

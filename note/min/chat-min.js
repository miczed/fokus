(function (angular) {
  "use strict";

  var app = angular.module('myApp.chat', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('NoteCtrl', ['$scope', 'noteList', function($scope, noteList) {
      $scope.notes = noteList;
      $scope.blankNote = { title: '', markdown: ''};
      $scope.newNote = $scope.blankNote;
      $scope.addNote = function(newNote) {
        if( newNote ) {
          $scope.notes.$add(newNote);
        }
      };
    }]);

  app.factory('noteList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var ref = fbutil.ref('notes').limitToLast(10);
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/note', {
      templateUrl: 'note/note.html',
      controller: 'NoteCtrl'
    });
  }]);

})(angular);


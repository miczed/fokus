
(function (angular) {
  "use strict";

  var app = angular.module('myApp.chat', ['ngRoute', 'firebase.utils', 'firebase', 'firebase.auth']);

  app.controller('NoteCtrl', ['$scope', 'noteList' , 'user', 'FBURL', function($scope, noteList, user, FBURL) {
    $scope.viewMode = 'markdown';
    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: false,
      mode: 'gfm',
    };

    $scope.notes = noteList.getByUser(user.uid);
    $scope.blankNote = { title: '', markdown: ''};
    $scope.newNote = $scope.blankNote;
    $scope.addNote = function(newNote) {
      newNote.author = user.uid;
      if( newNote && !newNote.$id ) {
        console.log('Storing new note in DB');
        var d = new Date();
        newNote.created = d.getTime();
        $scope.notes.$add(newNote).then(function(ref) {
          var id = ref.key();
          console.log('New Note Created with ID:' + id + " for user: " + user.uid);
          var root = new Firebase(FBURL);
          root.child("/users/" + user.uid + "/notes/" + id).set(true);
        }, function(error) {
          console.log('there was an error!');
          console.log("The expected Firebase action failed to occur this was your error: " + err);
        });
        $scope.newNote = $scope.blankNote;
      } else {
        var d = new Date();
        newNote.updated = d.getTime();
        $scope.notes.$save(newNote);
      }
    };
    $scope.loadNote = function(index) {
      $scope.newNote = $scope.notes[index];
    }
  }]);

  app.factory('noteList', ['fbutil', '$firebaseArray','FBURL', function(fbutil, $firebaseArray, FBURL) {
    //var revert = Firebase.util.logLevel('debug');
    var _all = function() {
      var ref = fbutil.ref('notes').limitToLast(10);
      return $firebaseArray(ref);
    }
    var _getByUser = function(uid) {
      var fb = new Firebase(FBURL);
      console.log(fb.child('users/'+uid+'/notes'));
      var norm = new Firebase.util.NormalizedCollection( [fb.child('users/'+uid+'/notes'),'user'], [ fb.child('notes'), 'notes' ]);
      
      norm = norm.select(
       'user.notes',
       'notes.title',
       'notes.markdown',
       'notes.author',
       'notes.updated'

      );
      console.log(norm.ref());
      return $firebaseArray(norm.ref());
    }
    
    
    return {
        all: _all,
        getByUser: _getByUser
    }
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.whenAuthenticated('/note', {
      templateUrl: 'note/note.html',
      controller: 'NoteCtrl',
      resolve: {
        // forces the page to wait for this promise to resolve before controller is loaded
        // the controller can then inject `user` as a dependency. This could also be done
        // in the controller, but this makes things cleaner (controller doesn't need to worry
        // about auth status or timing of accessing data or displaying elements)
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }]);

})(angular);
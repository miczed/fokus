!function(e){"use strict";var t=e.module("myApp.home",["firebase.auth","firebase","firebase.utils","ngRoute"]);t.controller("HomeCtrl",["$scope","fbutil","user","$firebaseObject","FBURL",function(e,t,r,o,u){e.syncedValue=o(t.ref("syncedValue")),e.user=r,e.FBURL=u}]),t.config(["$routeProvider",function(e){e.whenAuthenticated("/home",{templateUrl:"home/home.html",controller:"HomeCtrl",resolve:{user:["Auth",function(e){return e.$waitForAuth()}]}})}])}(angular);
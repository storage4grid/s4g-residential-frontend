'use strict';

angular.module('loginView', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/loginView', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$rootScope', 'Auth', '$location', '$log' ,function($scope, $rootScope, Auth, $location, $log) {
        $scope.user={};
        $scope.auth = Auth; //acquires authentication from app.js (if it was done)


        $rootScope.s4gVar.currentPositionPage = 'login';
        $rootScope.s4gVar.currentView = "Login";
        $scope.signIn = function() {
            $scope.firebaseUser = null;
            $scope.error = null;
            $scope.auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
                // login successful: redirect to the pizza list
                $location.path("/home");
            }).catch(function(error) {
                $scope.error = error;
                $log.error(error.message);
            });
        };
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $location.path("/home");
            } else {
                // No user is signed in.
            }
            //let Angular know that things have changed
            $scope.$apply();
        });
    }]);
/*
    .run(["$location", function($location) {
        var user = firebase.auth();

        if (user) {
            $location.path("/home");
        } else {
            // No user is signed in.
        }
    }]);
*/
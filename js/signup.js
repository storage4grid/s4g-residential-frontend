'use strict';

angular.module('signupView', ['ngRoute', 'ui.bootstrap'])


    .controller('SignupCtrl', ['$scope', '$rootScope', 'Auth', '$location', '$log' ,function($scope, $rootScope, Auth, $location, $log) {
        $scope.user={};
        $scope.auth = Auth; //acquires authentication from app.js (if it was done)

        $rootScope.s4gVar.currentPositionPage = 'signup';
        $rootScope.s4gVar.currentView = "Signup";

        $scope.signUp = function() {
            $scope.firebaseUser = null;
            $scope.error = null;
            if ($scope.user.email!='' && $scope.user.email!=undefined && $scope.user.password!='' && $scope.user.password!=undefined && $scope.user.password2 != '' && $scope.user.password2 != undefined && $scope.user.password == $scope.user.password2)
            {
                // Create a new user
                $scope.auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
                    .then(function(firebaseUser) {
                        console.log("User created with uid: " + firebaseUser.uid);
                        // signup successful: redirect to the home
                        $rootScope.justSignedup = true;
                        $scope.error = undefined;
                    }).catch(function(error) {
                    $scope.error = error;
                });
            }
            else
            {
                $scope.error = {};
                $scope.error.message = "You forgot to fill one of the fields or password 1 is not equal to password 2";
                $log.error("You forgot to fill one of the fields or password 1 is not equal to password 2");
            }
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
'use strict';

angular.module('forgotPassView', ['ngRoute', 'ui.bootstrap'])


    .controller('ForgotPassCtrl', ['$scope', '$rootScope', 'Auth', '$location', '$log' ,function($scope, $rootScope, Auth, $location, $log) {
        $scope.user={};
        $scope.auth = Auth; //acquires authentication from app.js (if it was done)

        $rootScope.s4gVar.currentPositionPage = 'forgotPass';
        $rootScope.s4gVar.currentView = "ForgotPass";
        $scope.emailWasSent = false;

        $scope.sendResetEmail = function() {
            $scope.firebaseUser = null;
            $scope.error = null;
            if ($scope.user.email!=undefined && $scope.user.email!='') {
                //it is not necessary to check if the user actually insert a valid email: firebase will check it for us
                $scope.auth.$sendPasswordResetEmail($scope.user.email).then(function () {
                    $scope.error = undefined;
                    $scope.emailWasSent = true;
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else
            {
                $scope.error = {};
                $scope.error.message = "Please insert a valid email address!";
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
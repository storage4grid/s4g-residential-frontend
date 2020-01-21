'use strict';
var dashNavigation = angular.module('dashNavigation', []);

dashNavigation.controller("dashNavigationController", ['$scope', '$rootScope', '$firebaseAuth', '$location' ,function($scope, $rootScope, $firebaseAuth, $location) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if ($rootScope.data == null || $rootScope.data == undefined) {
                $rootScope.data = {};
            }
            $rootScope.data.userLogged = true;
        } else {
            // No user is signed in.
            if ($rootScope.data == null || $rootScope.data == undefined) {
                $rootScope.data = {};
            }
            $rootScope.data.userLogged = false;
        }
    });

    $scope.getCurrentView = function()
    {
        return $rootScope.s4gVar.currentView;
    }
/*

    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });
    */

    $scope.signOut = function() {
        $firebaseAuth().$signOut();
        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("User is yet signed in as:", firebaseUser.uid);
            } else {
                $location.path("/loginView");
            }
        });
    };

    $scope.showSubMenu = function (varToSet) {
        if($scope[varToSet]==true)
        {
            $scope[varToSet]=false
        }
        else
        {
            $scope[varToSet]=true;
        }
    }
}]);

// define the switch component
dashNavigation.component('dashNavigation', {
	// the component template
	templateUrl : 'templates/dash-nav.html',
	controller: 'dashNavigationController'
});

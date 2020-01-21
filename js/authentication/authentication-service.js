'use strict';

angular.module('authentication.authenticationService', ['firebase'])

    .factory('Auth', ["$firebaseAuth", function($firebaseAuth) {
        return $firebaseAuth();
    }]);
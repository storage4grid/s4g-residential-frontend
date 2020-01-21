'use strict';
var dashSystemHealth = angular.module('dashSystemHealth',
		[ 'ui.bootstrap' ]);

dashSystemHealth
		.controller(
				"dashSystemHealthController",
				[
						'$scope',
						'$timeout',
						function($scope, $timeout) {

						} ]);

// define the switch component
dashSystemHealth.directive('dashSystemHealth', function(){
    return {
        scope: true,
        // the component template
        templateUrl:'templates/dash-system-health.html',
        bindToController: {
            dashId: '<',
            value: '=',
            dashIcon: '<',
            dashLabel: '<'
        },
        controller: dashSystemHealthController,
        controllerAs: 'ctrl'

    }
});

function dashSystemHealthController() {
}

'use strict';

var dashBatteryOnlyStatus = angular.module('dashBatteryOnlyStatus',
    [ 'ui.bootstrap']);
dashBatteryOnlyStatus
		.controller(
				"dashBatteryOnlyStatusController",
				[
						'$scope',
						'$timeout',
						function($scope, $timeout) {
						} ]);

// define the switch component
dashBatteryOnlyStatus.directive('dashBatteryOnlyStatus', function(){
    return {
        scope: true,
        // the component template
        templateUrl:'templates/dash-battery-only-status.html',
        bindToController: {
            dashId: '<',
            value: '=',
            dashUnit: '=',
            dashIcon: '<',
            dashLabel: '<',
            getValue: '&'
        },
        controller: dashBatteryOnlyStatusController,
        controllerAs: 'ctrl'

    }
});

function dashBatteryOnlyStatusController() {
}
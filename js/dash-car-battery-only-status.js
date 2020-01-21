'use strict';
var dashCarBatteryOnlyStatus = angular.module('dashCarBatteryOnlyStatus',
		[ 'ui.bootstrap' ]);

dashCarBatteryOnlyStatus
		.controller(
				"dashCarBatteryOnlyStatusController",
				[
						'$scope',
						'$timeout',
						function($scope, $timeout) {

						} ]);

// define the switch component
dashCarBatteryOnlyStatus.directive('dashCarBatteryOnlyStatus', function(){
    return {
        scope: true,
        // the component template
        templateUrl:'templates/dash-car-battery-only-status.html',
        bindToController: {
            dashId: '<',
            value: '=',
            dashUnit: '=',
            dashIcon: '<',
            dashLabel: '<',
            getValue: '&'
        },
        controller: dashCarBatteryOnlyStatusController,
        controllerAs: 'ctrl'

    }
});

function dashCarBatteryOnlyStatusController() {
}

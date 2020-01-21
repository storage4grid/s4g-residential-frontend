'use strict';

// create the emailUpdates module
var emailUpdatesModule = angular.module('emailUpdatesModule', []);
// the module controller

emailUpdatesModule
		.controller(
				'emailUpdatesController',
				[
					'$scope',
					'$rootScope',
					'$element',
					'$attrs',
					'$timeout',
					'MqttFactory',
					function($scope, $rootScope, $element, $attrs, $timeout, MqttFactory)
                    {

						$rootScope.s4gVar.currentPositionPage = "emailUpdates";
						$rootScope.s4gVar.currentView = "Email Updates";
                        $scope.getBlockSizeForInput = function(divider)
                        {
                            return ((document.getElementsByClassName("row").item(0).offsetWidth)/divider).toFixed(0)
                        ;
                        }
                    } ]);

// define the text-measure component
emailUpdatesModule.component('emailUpdatesModule', {
	bindings : {
	},
	controller : emailUpdatesController
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function emailUpdatesController($scope, $element, $attrs) {
	// sensor = $attrs.dashLabel;

}

'use strict';

// create the text-measure module
var dashNewTemplateWidget = angular.module('dashNewTemplateWidget', []);
// the module controller

dashNewTemplateWidget
		.controller(
				'dashNewTemplateWidgetController',
				[
						'$scope',
						'$rootScope',
						'$element',
						'$attrs',
						'$timeout',
						function($scope, $rootScope, $element, $attrs, $timeout) {

                            $scope.inputData = {};
                            $scope.inputData.widgetType = 'text';

							// This controller update automatically the gauge
							// based on an API
							// The alternative is to feed the gauge from an
							// external controller
							// in that case this method can be removed
							$scope.init = function(name, widgetType) {

                                    $scope.inputData.widgetType = widgetType;


								if (name!=null && name!=undefined && name!='') {
                                    $scope.sensor = name;
                                }
                            };

                            $scope.getColorOfStatus = function(status)
                            {
                                if (status.toLowerCase()=='ok')
                                {
                                    return '#30bf5c';
                                }
                                else
                                {
                                    if (status.toLowerCase(status)=='warning')
                                    {
                                        return '#F2A708';
                                    }
                                    else {
                                        return '#f25353';
                                    }
                                }
                            }


						} ]);

// define the text-measure component
dashNewTemplateWidget.directive('dashNewTemplateWidget', function(){
	return {
        scope: true,
        // the component template
        templateUrl: 'templates/dash-new-template-widget.html',
        bindToController: {
            dashIcon: '<'
        },
		controller: dashNewTemplateWidgetController,
        controllerAs: 'ctrl'

    }
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function dashNewTemplateWidgetController($scope, $element, $attrs) {
	// sensor = $attrs.dashLabel;
}

/*

function mqttOnMessageArrived(message) {
    var topic = message.destinationName;
    console.log("onMessageArrivedTEO45 - :"+topic+" - "+message.payloadString);
}
*/
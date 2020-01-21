'use strict';

// create the credits module
var creditsModule = angular.module('creditsModule', []);
// the module controller

creditsModule
    .controller(
        'creditsController',
        [
            '$scope',
            '$rootScope',
            '$element',
            '$attrs',
            '$timeout',
            'MqttFactory',
            function ($scope, $rootScope, $element, $attrs, $timeout) {

                $rootScope.s4gVar.currentPositionPage = "credits";
                $rootScope.s4gVar.currentView = "Credits";
            }]);

// define the text-measure component
creditsModule.component('creditsModule', {
    bindings: {
        dashId: '<'
    },
    controller: creditsController
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function creditsController($scope, $element, $attrs) {
    // sensor = $attrs.dashLabel;
}

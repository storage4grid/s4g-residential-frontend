'use strict';

// create the credits module
var systemInfoModule = angular.module('systemInfoModule', []);
// the module controller

systemInfoModule
    .controller(
        'systemInfoController',
        [
            '$scope',
            '$rootScope',
            '$element',
            '$attrs',
            '$timeout',
            function ($scope, $rootScope, $element, $attrs, $timeout) {

                $rootScope.s4gVar.currentPositionPage = 'systemInfo';
            }]);

// define the text-measure component
systemInfoModule.component('systemInfoModule', {
    bindings: {
    },
    controller: systemInfoController
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function systemInfoController($scope, $element, $attrs) {
    // sensor = $attrs.dashLabel;
}

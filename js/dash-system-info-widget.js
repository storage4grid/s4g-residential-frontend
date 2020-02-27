'use strict';

// create the text-measure module
var dashSystemInfoWidget = angular.module('dashSystemInfoWidget', [ ]);
// the module controller

dashSystemInfoWidget
		.controller(
            'dashSystemInfoWidgetController',
            [
                '$scope',
                '$rootScope',
                '$element',
                '$attrs',
                '$interval',
                '$http',
                function($scope, $rootScope, $element, $attrs, $interval, $http) {

                    $scope.inputData = {};
                    $scope.inputData.widgetType = 'text';
                    $rootScope.s4gVar.currentPositionPage = "systemInfo";
                    $rootScope.s4gVar.currentView = "System Information";
                    $scope.s4gLocalVar ={};
                    $scope.s4gLocalVar.currentBatteryCycles = -1;
                    $scope.s4gLocalVar.sentAlerts = 0;
                    $scope.s4gLocalVar.receivedTodayEnergyP_PV = true;
                    $scope.s4gLocalVar.todayEnergyP_PV = 0;
                    $scope.startDateString = "2019-12-02";
                    $scope.startDateStringIta = "02.12.2019";
                    $scope.storageHealth = 54;

                    var today = new Date();

                    var tomorrow = new Date(today.getTime() + (60*60*24*1000));

                    var dd2 = tomorrow.getDate();
                    var mm2 = tomorrow.getMonth()+1;
                    var yyyy2 = tomorrow.getFullYear();
                    if(dd2<10)
                    {
                        dd2='0'+dd2;
                    }
                    if(mm2<10)
                    {
                        mm2='0'+mm2;
                    }
                    $scope.dateTomorrow = yyyy2+'-'+mm2+'-'+dd2;;



                    // This controller update automatically the gauge
                    // based on an API
                    // The alternative is to feed the gauge from an
                    // external controller
                    // in that case this method can be removed
                    $scope.init = function(name, widgetType) {
                        $scope.inputData.widgetType = widgetType;
                        if (name!=null && name!=undefined && name!='') {
                            $scope.inputData.sensor = name;
                        }

                    };


                    $scope.sendAlert = function(message)
                    {
                        if ($scope.s4gLocalVar.sentAlerts<=0) {
                            $scope.s4gLocalVar.sentAlerts++;
                            alert(message);
                        }

                    }

                    $scope.getUtilization = function()
                    {
                        var capacity = 5000;
                        var currentUtilization = ($rootScope.s4gVar.currentPV/capacity)*100;
                        currentUtilization = Math.round(currentUtilization * 100) / 100
                        return currentUtilization;
                    }

                    $scope.getCurrentProduction = function()
                    {
                        var currentProduction = $rootScope.s4gVar.currentPV/1000;
                        currentProduction = Math.round(currentProduction * 100) / 100
                        return currentProduction;
                    }


                    $scope.getCurrentBatteryStateOfCharge = function()
                    {
                        return $rootScope.s4gVar.fronius.CurrentBatteryStateOfCharge;
                    }

                    $scope.getTotalProduction = function()
                    {
                        var result = 0;
                        result = $scope.s4gLocalVar.todayEnergyP_PV/1000;

                        result = Math.round(result * 100) / 100;
                        return result;
                    }

                    $scope.getCurrentBatteryStatus = function()
                    {
                        //get data
                        var CurrentBatteryStatus = $rootScope.s4gVar.fronius.CurrentBatteryStatus;
                        return CurrentBatteryStatus;
                    }


                    $scope.getStorageHealth = function()
                    {
                        return $scope.storageHealth;
                    }

                    $scope.getCurrentCycles = function()
                    {
                        return $scope.s4gLocalVar.currentBatteryCycles;
                    }

                    $scope.updatecurrentBatteryCycles = function()
                    {
                        $http({
                            method: 'GET',
                            url: $rootScope.s4gVar.backendURL+'/Battery/cycles',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            //console.log(response.data)
                            // this callback will be called asynchronously
                            // when the response is available
                            $scope.s4gLocalVar.currentBatteryCycles = response.data;
                            $scope.s4gLocalVar.sentAlerts = 0;
                        }, function errorCallback(response) {
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                            //console.log(response)
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });
                    }

                    $scope.updateTodayEnergyP_PV = function()
                    {
                        //get Energy associated to P_PV

                        $scope.s4gLocalVar.receivedTodayEnergyP_PV = false;
                        $scope.startDate = new Date($scope.startDateString);

                        var dd = $scope.startDate.getDate();
                        var mm = $scope.startDate.getMonth()+1;
                        var yyyy = $scope.startDate.getFullYear();
                        if(dd<10)
                        {
                            dd='0'+dd;
                        }
                        if(mm<10)
                        {
                            mm='0'+mm;
                        }
                        $scope.startDate = yyyy+'-'+mm+'-'+dd;
                        $scope.urlEnergyProd = $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.startDate+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.PV.pathEnergy;
                        /*
                        if ($rootScope.s4gVar.demoEnabled)
                        {
                            $scope.urlEnergyProd = $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.startDate+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.installation+'/photovoltaic';
                        }
                        */
                        $http({
                            method: 'GET',
                            url: $scope.urlEnergyProd,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            //console.log(response.data)
                            // this callback will be called asynchronously
                            // when the response is available
                            var temp = response.data;
                            if (temp== null || JSON.stringify(temp).includes("Empty message"))
                            {
                                $scope.s4gLocalVar.todayEnergyP_PV = 0;
                            }
                            else
                            {
                                if (typeof temp == 'string') {
                                    $scope.s4gLocalVar.todayEnergyP_PV = Math.round(Number(temp)*100)/100;
                                }
                                else
                                {
                                    if (typeof temp == 'object') {
                                        $scope.s4gLocalVar.todayEnergyP_PV = Math.round(Number(temp[1])*100)/100;
                                    }
                                    else {
                                        $scope.s4gLocalVar.todayEnergyP_PV = Math.round(temp * 100) / 100;
                                    }
                                }
                            }
                            $scope.s4gLocalVar.sentAlerts = 0;
                            $scope.s4gLocalVar.receivedTodayEnergyP_PV = true;
                        }, function errorCallback(response) {
                            $scope.s4gLocalVar.todayEnergyP_PV = 0;

                            $scope.s4gLocalVar.receivedTodayEnergyP_PV = true;
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                            //console.log(response)
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });
                    }

                    $scope.updateVariables = function()
                    {
                        $scope.updatecurrentBatteryCycles();
                        $scope.updateTodayEnergyP_PV();
                    }
                    $scope.updateVariables();
                    var angularInterval = $interval($scope.updateVariables, 10000);

                }
            ]
        );

// define the text-measure component
dashSystemInfoWidget.directive('dashSystemInfoWidget', function(){
	return {
        scope: true,
        // the component template
        templateUrl: 'templates/dash-system-info-widget.html',
        bindToController: {
            dashIcon: '<'
        },
		controller: dashSystemInfoWidgetController,
        controllerAs: 'ctrl'

    }
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function dashSystemInfoWidgetController($scope, $element, $attrs) {
	// sensor = $attrs.dashLabel;
}

/*

function mqttOnMessageArrived(message) {
    var topic = message.destinationName;
    console.log("onMessageArrivedTEO45 - :"+topic+" - "+message.payloadString);
}
*/
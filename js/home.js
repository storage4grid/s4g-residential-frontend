'use strict';

// create the home module
var homeModule = angular.module('homeModule', []);
// the module controller

homeModule
    .controller(
        'homeController',
        [
            '$scope',
            '$rootScope',
            '$element',
            '$attrs',
            '$location',
            '$http',
            '$interval',
            function ($scope, $rootScope, $element, $attrs, $location, $http, $interval) {
                $rootScope.s4gVar.currentPositionPage = 'home';
                $rootScope.s4gVar.currentView = "Home";
                $scope.intervalAlert = {};

                $scope.dismissAlert = function ()
                {
                    $rootScope.justSignedup = false;
                    $interval.cancel($scope.intervalAlert);
                }

                if ($rootScope.justSignedup)
                {
                    //dismiss alert after 10 seconds
                    $scope.intervalAlert = $interval($scope.dismissAlert, 10000);
                }



                $scope.s4gLocalVar = {};
                $scope.s4gLocalVar.todayEnergyP_LoadFronius = 0;
                $scope.s4gLocalVar.todayEnergyP_EV = 0;
                $scope.s4gLocalVar.todayEnergyP_ESS_positive = 0;
                $scope.s4gLocalVar.todayEnergyP_ESS_negative = 0;
                $scope.s4gLocalVar.todayEnergyP_AkkuFronius = 0;
                $scope.s4gLocalVar.todayEnergyP_GridFronius = 0;
                $scope.s4gLocalVar.todayEnergyP_PV = 0;
                $scope.s4gLocalVar.todayTotalConsumption = 0;
                $scope.s4gLocalVar.todayConsumptionFromGrid =0;
                $scope.s4gLocalVar.todayPowerToGrid =0;
                $scope.s4gLocalVar.todayConsumptionSelf = 0;
                $scope.s4gLocalVar.todaySelfProduced = 0;
                $scope.s4gLocalVar.todaySelfConsumed = 0;
                $scope.s4gLocalVar.todayEnergyFromGrid = 0;
                $scope.s4gLocalVar.todayEnergyToGrid = 0;
                $scope.s4gLocalVar.receivedTodayEnergyP_LoadFronius = true;
                $scope.s4gLocalVar.receivedTodayEnergyP_EV = true;
                $scope.s4gLocalVar.receivedTodayEnergyP_ESS_positive = true;
                $scope.s4gLocalVar.receivedTodayEnergyP_ESS_negative = true;
                $scope.s4gLocalVar.receivedTodayEnergyP_AkkuFronius = true;
                $scope.s4gLocalVar.receivedTodayEnergyP_GridFronius = true;
                $scope.s4gLocalVar.receivedTodayEnergyP_GridNegFronius = true;
                $scope.s4gLocalVar.receivedTodayEnergyP_PV = true;
                $scope.s4gLocalVar.receivedCarStatus = true;
                $scope.s4gLocalVar.currentCarStatus = 'No status';
                $scope.s4gLocalVar.currentCarSoC = 0;
                $scope.s4gLocalVar.currentCarRemainingTime = 0;


                $scope.s4gLocalVar.sentAlerts = 0;

                $scope.updateDates = function() {
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    $scope.dateToday = yyyy + '-' + mm + '-' + dd;
                    //$scope.dateToday = '2020-01-08';

                    var tomorrow = new Date(today.getTime() + (60 * 60 * 24 * 1000));

                    var dd2 = tomorrow.getDate();
                    var mm2 = tomorrow.getMonth() + 1;
                    var yyyy2 = tomorrow.getFullYear();
                    if (dd2 < 10) {
                        dd2 = '0' + dd2;
                    }
                    if (mm2 < 10) {
                        mm2 = '0' + mm2;
                    }
                    $scope.dateTomorrow = yyyy2 + '-' + mm2 + '-' + dd2;
                    //$scope.dateTomorrow = '2020-01-08';
                }
                $scope.updateDates();

                $scope.redirectToSystemInfo = function()
                {

                    $location.path('/systemInfo');
                }
                $scope.getCurrentBatteryStatus = function()
                {
                    //var CurrentBatteryStatus = "Charging";
                    return $rootScope.s4gVar.fronius.CurrentBatteryStatus;

                }

                $scope.getCurrentBatteryStateOfCharge = function()
                {
                    return $rootScope.s4gVar.fronius.CurrentBatteryStateOfCharge;
                }
                $scope.getCurrentCarStatus = function()
                {
                    return $scope.s4gLocalVar.currentCarStatus;
                }

                $scope.getCurrentCarSoC = function()
                {
                    return $scope.s4gLocalVar.currentCarSoC;
                }
                $scope.getCurrentCarRemainingTime = function()
                {
                    return $scope.s4gLocalVar.currentCarRemainingTime;
                }

                $scope.imageCurrentCarStatus = function(status)
                {
                    if ($scope.s4gLocalVar.currentCarStatus.toLowerCase() == status)
                    {
                        return true;
                    }
                    else
                        return false;
                }


                $scope.sendAlert = function(message)
                {
                    if ($scope.s4gLocalVar.sentAlerts<=0) {
                        $scope.s4gLocalVar.sentAlerts++;
                        alert(message);
                    }

                }


                $scope.updateTodayEnergyP_LoadFronius = function()
                {
                    //get Energy associated to P_Load (fronius)

                    $scope.s4gLocalVar.receivedTodayEnergyP_LoadFronius = false;

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.PLoad.pathEnergy,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_LoadFronius = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_LoadFronius = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.todayEnergyP_LoadFronius = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_LoadFronius = true;
                        $scope.updateGUIValues();
                        if ($rootScope.s4gVar.demoEnabled) {
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        }
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


                    //$scope.s4gLocalVar.receivedTodayEnergyP_LoadFronius = true;
                    //$scope.s4gLocalVar.todayEnergyP_LoadFronius = 0;
                }


                $scope.updateTodayEnergyP_EV = function()
                {
                    //get Energy associated to P_EV
                    $scope.s4gLocalVar.receivedTodayEnergyP_EV = false;

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.EV.pathEnergy,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_EV = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;

                        $scope.s4gLocalVar.receivedTodayEnergyP_EV = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {

                        $scope.s4gLocalVar.todayEnergyP_EV = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_EV = true;
                        $scope.updateGUIValues();
                        if (!$rootScope.s4gVar.demoEnabled) {
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        }
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }

                $scope.updateTodayEnergyP_ESS_negative = function()
                {
                    //get Energy associated to P_ESS
                    $scope.s4gLocalVar.receivedTodayEnergyP_ESS_negative = false;

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.ESS.pathEnergyNegative,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_ESS_negative = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_ESS_negative = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.todayEnergyP_ESS_negative = 0;

                        $scope.s4gLocalVar.receivedTodayEnergyP_ESS_negative = true;
                        $scope.updateGUIValues();
                        $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }

                $scope.updateTodayEnergyP_ESS_positive = function()
                {
                    //get Energy associated to P_ESS
                    $scope.s4gLocalVar.receivedTodayEnergyP_ESS_positive = false;

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.ESS.pathEnergyPositive,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_ESS_positive = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_ESS_positive = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.todayEnergyP_ESS_positive = 0;

                        $scope.s4gLocalVar.receivedTodayEnergyP_ESS_positive = true;
                        $scope.updateGUIValues();
                        $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }


                $scope.updateTodayEnergyP_AkkuFronius = function()
                {
                    //get Energy associated to P_Akku (fronius)
                    $scope.s4gLocalVar.receivedTodayEnergyP_AkkuFronius = false;


                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.PAkku.pathEnergy,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_AkkuFronius = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_AkkuFronius = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.todayEnergyP_AkkuFronius = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_AkkuFronius = true;
                        $scope.updateGUIValues();
                        if ($rootScope.s4gVar.demoEnabled) {
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        }
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });



                    //$scope.s4gLocalVar.receivedTodayEnergyP_AkkuFronius = true;
                    //$scope.s4gLocalVar.todayEnergyP_AkkuFronius = 0;
                }

                $scope.updateTodayEnergyP_GridFronius = function()
                {

                    $scope.s4gLocalVar.receivedTodayEnergyP_GridFronius = false;

                    //get Energy associated to P_Grid (fronius)

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.PGrid.pathEnergy,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_GridFronius = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_GridFronius = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.todayEnergyP_GridFronius = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_GridFronius = true;
                        $scope.updateGUIValues();
                        if ($rootScope.s4gVar.demoEnabled) {
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        }
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


                    //$scope.s4gLocalVar.receivedTodayEnergyP_GridFronius = true;
                    //$scope.s4gLocalVar.todayEnergyP_GridFronius = 0;
                }


                $scope.updateTodayEnergyP_GridNegFronius = function()
                {

                    $scope.s4gLocalVar.receivedTodayEnergyP_GridNegFronius = false;

                    //get Energy associated to P_Grid (fronius)

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.PGridNeg.pathEnergy,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_GridNegFronius = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_GridNegFronius = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.todayEnergyP_GridNegFronius = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_GridNegFronius = true;
                        $scope.updateGUIValues();
                        if ($rootScope.s4gVar.demoEnabled) {
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        }
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


                    //$scope.s4gLocalVar.receivedTodayEnergyP_GridNegFronius = true;
                    //$scope.s4gLocalVar.todayEnergyP_GridNegFronius = 0;
                }

                $scope.updateTodayEnergyP_PV = function()
                {
                    //get Energy associated to P_PV

                    $scope.s4gLocalVar.receivedTodayEnergyP_PV = false;

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/ENERGY/'+$scope.dateToday+'/'+$scope.dateTomorrow+'/'+$rootScope.s4gVar.field.PV.pathEnergy,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.s4gLocalVar.todayEnergyP_PV = response.data;
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedTodayEnergyP_PV = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.todayEnergyP_PV = 0;

                        $scope.s4gLocalVar.receivedTodayEnergyP_PV = true;
                        $scope.updateGUIValues();
                        $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }



                $scope.updateCarStatus = function()
                {
                    //get Car status

                    $scope.s4gLocalVar.receivedCarStatus = false;
                    $scope.s4gLocalVar.currentCarStatus = 'No status';

                    $http({
                        method: 'GET',
                        url: $rootScope.s4gVar.backendURL+'/EV/data',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        var temp = response.data;

                        $rootScope.s4gVar.currentEV1Status = 'OK';
                        /*
                        {
                            "Charging": "False",
                            "SoC": 0,
                            "remainingTime": 0
                        }
                        */
                        try {
                            if(temp != null && temp!="")
                            {
                                if (temp.hasOwnProperty("Charging"))
                                {
                                    if (temp.Charging.toLowerCase().includes("true"))
                                    {

                                        $scope.s4gLocalVar.currentCarStatus = "Charging";
                                    }
                                    else
                                    {
                                        $scope.s4gLocalVar.currentCarStatus = "Not charging";
                                    }
                                }
                                else
                                {
                                    $scope.s4gLocalVar.currentCarStatus = 'No status';
                                }
                                if (temp.hasOwnProperty("SoC"))
                                {
                                    $scope.s4gLocalVar.currentCarSoC = Number(temp.SoC);
                                }
                                else
                                {
                                    $scope.s4gLocalVar.currentCarSoC = 0;
                                }
                                if (temp.hasOwnProperty("remainingTime"))
                                {
                                    $scope.s4gLocalVar.currentCarRemainingTime = Number(temp.remainingTime);
                                }
                                else
                                {
                                    $scope.s4gLocalVar.currentCarRemainingTime = 0;
                                }


                            }
                            else
                            {
                                $scope.s4gLocalVar.currentCarStatus = 'No status';
                            }
                        }
                        catch(err) {
                            $scope.s4gLocalVar.currentCarStatus = 'No status';
                        }
                        $scope.s4gLocalVar.sentAlerts = 0;
                        $scope.s4gLocalVar.receivedCarStatus = true;
                        $scope.updateGUIValues();
                    }, function errorCallback(response) {
                        $rootScope.s4gVar.currentEV1Status = 'Offline';
                        $scope.s4gLocalVar.currentCarStatus = 'No status';

                        $scope.s4gLocalVar.receivedCarStatus = true;
                        $scope.updateGUIValues();
                        if ($rootScope.s4gVar.demoEnabled) {
                            $scope.sendAlert("Error in contacting the server: the system will try again but no alert will be shown again");
                        }
                        //console.log(response)
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }


                $scope.updateGUIValues = function()
                {
                    //wait until all variables will be updated
                    if ($scope.s4gLocalVar.receivedTodayEnergyP_LoadFronius && $scope.s4gLocalVar.receivedTodayEnergyP_EV && $scope.s4gLocalVar.receivedTodayEnergyP_ESS_positive && $scope.s4gLocalVar.receivedTodayEnergyP_ESS_negative && $scope.s4gLocalVar.receivedTodayEnergyP_AkkuFronius && $scope.s4gLocalVar.receivedTodayEnergyP_GridFronius && $scope.s4gLocalVar.receivedTodayEnergyP_GridNegFronius && $scope.s4gLocalVar.receivedTodayEnergyP_PV)
                    {
                        /*
                            formulas:
                            self_produced = (energy_pv_prod+energy_ess_prod)/1000;
                            self_consumed = (energy_batt_consu+energy_load_consu)/1000;
                            energy_from_grid = energy_powerfromgrid/1000;

                            where:
                            energy_ess_prod -> receivedTodayEnergyP_ESS_positive
                            energy_pv_prod -> receivedTodayEnergyP_PV
                            energy_batt_consu -> receivedTodayEnergyP_ESS_negative
                            energy_load_consu -> todayEnergyP_LoadFronius
                            energy_powerfromgrid -> todayEnergyP_GridFronius
                        */
                        $scope.s4gLocalVar.todaySelfProduced = Math.round((($scope.s4gLocalVar.todayEnergyP_PV + $scope.s4gLocalVar.todayEnergyP_ESS_positive)/1000)*100)/100;
                        $scope.s4gLocalVar.todaySelfConsumed = Math.round(((-$scope.s4gLocalVar.todayEnergyP_ESS_negative + $scope.s4gLocalVar.todayEnergyP_LoadFronius)/1000)*100)/100;
                        $scope.s4gLocalVar.todayEnergyFromGrid = Math.round(($scope.s4gLocalVar.todayEnergyP_GridFronius/1000)*100)/100;
                        $scope.s4gLocalVar.todayEnergyToGrid = Math.abs(Math.round((-$scope.s4gLocalVar.todayEnergyP_GridNegFronius/1000)*100)/100);

                        if ($scope.s4gLocalVar.todayEnergyP_AkkuFronius<0)
                        {
                            $scope.s4gLocalVar.todayTotalConsumption = $scope.s4gLocalVar.todayEnergyP_LoadFronius + $scope.s4gLocalVar.todayEnergyP_EV + $scope.s4gLocalVar.todayEnergyP_ESS_positive;
                        }
                        else
                        {
                            $scope.s4gLocalVar.todayTotalConsumption = $scope.s4gLocalVar.todayEnergyP_LoadFronius + $scope.s4gLocalVar.todayEnergyP_EV;
                        }
                        if ($scope.s4gLocalVar.todayEnergyP_GridFronius>0) {
                            $scope.s4gLocalVar.todayConsumptionFromGrid = Math.abs($scope.s4gLocalVar.todayEnergyP_GridFronius);
                            $scope.s4gLocalVar.todayPowerToGrid = 0;
                        }
                        else
                        {
                            $scope.s4gLocalVar.todayConsumptionFromGrid = 0;
                            $scope.s4gLocalVar.todayPowerToGrid = Math.abs($scope.s4gLocalVar.todayEnergyP_GridFronius);
                        }

                        if ($scope.s4gLocalVar.todayEnergyP_AkkuFronius>0)
                        {
                            $scope.s4gLocalVar.todayConsumptionSelf = $scope.s4gLocalVar.todayEnergyP_PV + $scope.s4gLocalVar.todayEnergyP_ESS_positive;
                        }
                        else
                        {
                            $scope.s4gLocalVar.todayConsumptionSelf = $scope.s4gLocalVar.todayEnergyP_PV;
                        }
                        $scope.s4gLocalVar.todayTotalConsumption = Math.round(($scope.s4gLocalVar.todayTotalConsumption/1000)*100)/100;
                        $scope.s4gLocalVar.todayConsumptionFromGrid = Math.round(($scope.s4gLocalVar.todayConsumptionFromGrid/1000)*100)/100;
                        $scope.s4gLocalVar.todayPowerToGrid = Math.round(($scope.s4gLocalVar.todayPowerToGrid/1000)*100)/100;
                        $scope.s4gLocalVar.todayConsumptionSelf = Math.round(($scope.s4gLocalVar.todayConsumptionSelf/1000)*100)/100;
                        if ($scope.s4gLocalVar.todayTotalConsumption==null || isNaN($scope.s4gLocalVar.todayTotalConsumption))
                        {
                            $scope.s4gLocalVar.todayTotalConsumption = 0;
                        }
                        if ($scope.s4gLocalVar.todayConsumptionFromGrid==null || isNaN($scope.s4gLocalVar.todayConsumptionFromGrid))
                        {
                            $scope.s4gLocalVar.todayConsumptionFromGrid = 0;
                        }
                        if ($scope.s4gLocalVar.todayPowerToGrid==null || isNaN($scope.s4gLocalVar.todayPowerToGrid))
                        {
                            $scope.s4gLocalVar.todayPowerToGrid = 0;
                        }
                        if ($scope.s4gLocalVar.todayConsumptionSelf==null || isNaN($scope.s4gLocalVar.todayConsumptionSelf))
                        {
                            $scope.s4gLocalVar.todayConsumptionSelf = 0;
                        }
                    }
                }

                $scope.updateVariables = function()
                {
                    //update dates so that if the user is looking at the dashboard at 23.40, at midnight the data are updated for the new day
                    $scope.updateDates();
                    $scope.updateTodayEnergyP_LoadFronius();
                    $scope.updateTodayEnergyP_EV();
                    $scope.updateTodayEnergyP_ESS_positive();
                    $scope.updateTodayEnergyP_ESS_negative();
                    $scope.updateTodayEnergyP_AkkuFronius();
                    $scope.updateTodayEnergyP_GridFronius();
                    $scope.updateTodayEnergyP_GridNegFronius();
                    $scope.updateTodayEnergyP_PV();
                    $scope.updateCarStatus();
                }
                $scope.updateVariables();
                //update variable every 10 minutes (600 seconds)
                var angularInterval = $interval($scope.updateVariables, 600000);



            }]);

// define the text-measure component
homeModule.component('homeModule', {
    bindings: {
        dashId: '<',
        value: '=',
        dashUnit: '=',
        dashIcon: '<',
        dashLabel: '<',
        dashHeader: '=',
        widgetIcon: '=',
        currentIndependence: '=',
        currentConsumption: '=',
        currentProduction: '=',
        batterySOC: '=',
        batteryPAkku: '='
    },
    controller: homeController
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function homeController($scope, $element, $attrs) {
    // sensor = $attrs.dashLabel;
}

'use strict';

// create the consumption module
var consumptionModule = angular.module('consumptionModule', []);
// the module controller

consumptionModule
    .controller(
        'consumptionController',
        [
            '$scope',
            '$rootScope',
            '$element',
            '$attrs',
            '$timeout',
            'MqttFactory',
            '$http',
            function ($scope, $rootScope, $element, $attrs, $timeout, MqttFactory, $http) {

                $rootScope.s4gVar.currentPositionPage = "Consumption";
                $rootScope.s4gVar.currentView = "Analyse consumption";

                $scope.s4gLocalVar = {};
                $scope.s4gLocalVar.alreadyGetTimestampFromResponse = false;

                $scope.s4gLocalVar.frequencyInMinutesForChart = 5;
                $scope.s4gLocalVar.currentSelection = "day";//possible values: day, month, year
                // --- default values for the start and end date fields

                //this variable is used to start the acquisition of data from the backend when the user access the page the first time.
                //we have to adopt this workaround because the startDate and endDate are set only after a few seconds and we have to start the acquisition in the asynchronous function that store them

                $scope.firstTime = true;

                $scope.s4gLocalVar.xTimestamps = [];

                $scope.s4gLocalVar.PowerFromBatteryLabel = "Power From Storage";
                $scope.s4gLocalVar.ConsumptionDirectLabel = "Photovoltaics Power consumed by Loads";
                $scope.s4gLocalVar.ProductionLabel = "Photovoltaics Power consumed by House"; //pv meno overproduction
                $scope.s4gLocalVar.PowerFromGridLabel = "Power From Grid";
                $scope.s4gLocalVar.SoCLabel = "SoC";
                //limit To Identify Daily Selection (in seconds)
                $scope.s4gLocalVar.limitDailySelect = 6*24*60*60;
                $scope.s4gLocalVar.limitWeekSelect = 14*24*60*60;
                $scope.s4gLocalVar.limitMonthSelect = 35*24*60*60;
                //frequencyForDailySelect in minutes
                $scope.s4gLocalVar.freqDailySelectMinutes = 5;
                $scope.s4gLocalVar.freqWeekSelectMinutes = 24*60;
                $scope.s4gLocalVar.freqMonthSelectMinutes = 7*24*60;
                $scope.s4gLocalVar.freqYearSelectMinutes = 31*24*60;

                $scope.s4gLocalVar.allVar = {};
                $scope.s4gLocalVar.allVar['energyBalance'] = 0;
                $scope.s4gLocalVar.allVar['P_ESS'] = [];
                $scope.s4gLocalVar.allVar['P_EV'] = [];
                $scope.s4gLocalVar.allVar['P_PCC'] = [];
                $scope.s4gLocalVar.allVar['P_PV'] = [];
                $scope.s4gLocalVar.allVar['FroniusBattery'] = [];
                $scope.s4gLocalVar.allVar['FroniusGrid'] = [];
                $scope.s4gLocalVar.allVar['NegativeFroniusGrid'] = [];
                $scope.s4gLocalVar.allVar['FroniusLoad'] = [];
                $scope.s4gLocalVar.allVar['NegativeFroniusLoad'] = [];
                $scope.s4gLocalVar.allVar['FroniusPhotovoltaic'] = [];
                $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'] = [];
                $scope.s4gLocalVar.allVar['PowerFromBattery'] = [];


                $scope.s4gLocalVar.allVar['consumptionDirect'] = [];
                $scope.s4gLocalVar.allVar['NegConsHouseJSON'] = {};

                $scope.s4gLocalVar.allVar['SoC_JSON'] = {};
                $scope.s4gLocalVar.allVar['NegativeOverProduction'] = [];


                $scope.s4gLocalVar.allVar['ready_EnergyBalance'] = false;
                $scope.s4gLocalVar.allVar['ready_P_ESS'] = false;
                $scope.s4gLocalVar.allVar['ready_P_EV'] = false;
                $scope.s4gLocalVar.allVar['ready_P_PCC'] = false;
                $scope.s4gLocalVar.allVar['ready_P_PV'] = false;
                $scope.s4gLocalVar.allVar['ready_FroniusBattery'] = false;
                $scope.s4gLocalVar.allVar['ready_FroniusGrid'] = false;
                $scope.s4gLocalVar.allVar['ready_NegativeFroniusGrid'] = false;
                $scope.s4gLocalVar.allVar['ready_FroniusLoad'] = false;
                //$scope.s4gLocalVar.allVar['ready_NegativeFroniusLoad'] =  false;
                $scope.s4gLocalVar.allVar['ready_FroniusPhotovoltaic'] = false;
                $scope.s4gLocalVar.allVar['ready_PowerFromBattery'] = false;

                $scope.s4gLocalVar.allVar['ready_NegativeConsumptionBattery'] = false;
                //$scope.s4gLocalVar.allVar['ready_ConsumptionForEnergy'] = false;
                $scope.s4gLocalVar.allVar['ready_NegConsHouseJSON'] = false;
                $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] = false;
                $scope.s4gLocalVar.allVar['ready_ConsumptionHouse'] = false;
                $scope.s4gLocalVar.allVar['ready_Production'] = false;
                $scope.s4gLocalVar.allVar['ready_SoC_JSON'] = false;
                $scope.s4gLocalVar.allVar['ready_NegativeOverProduction'] = false;

                //$scope.s4gLocalVar.allVar['consumptionForEnergyCleaned'] = [];
                $scope.s4gLocalVar.allVar['negativeConsumptionHouse'] = [];
                $scope.s4gLocalVar.allVar['consumptionHouse'] = [];

                $scope.s4gLocalVar.select_SMX_P_ESS = true;
                $scope.s4gLocalVar.select_SMX_P_EV = true;
                $scope.s4gLocalVar.select_SMX_P_PCC = true;
                $scope.s4gLocalVar.select_SMX_P_PV = true;
                $scope.s4gLocalVar.select_froniusBattery = true;
                $scope.s4gLocalVar.select_froniusGrid = true;
                $scope.s4gLocalVar.select_froniusLoad = true;
                $scope.s4gLocalVar.select_froniusPhotovoltaic = true;
                $scope.s4gLocalVar.select_production = true;
                $scope.s4gLocalVar.select_powerFromBattery = true;
                $scope.s4gLocalVar.select_consumptionDirect = true;
                $scope.s4gLocalVar.select_powerFromGrid = true;
                $scope.s4gLocalVar.select_SoC = true;
                $scope.s4gLocalVar.select_all = true;

                $scope.s4gLocalVar.exportFormat = "JSON";

                $scope.s4gLocalVar.select_all_func = function () {
                    if ($scope.s4gLocalVar.select_all) {

                        $scope.s4gLocalVar.select_SMX_P_ESS = true;
                        $scope.s4gLocalVar.select_SMX_P_EV = true;
                        $scope.s4gLocalVar.select_SMX_P_PCC = true;
                        $scope.s4gLocalVar.select_SMX_P_PV = true;
                        $scope.s4gLocalVar.select_froniusBattery = true;
                        $scope.s4gLocalVar.select_froniusGrid = true;
                        $scope.s4gLocalVar.select_froniusLoad = true;
                        $scope.s4gLocalVar.select_froniusPhotovoltaic = true;
                        $scope.s4gLocalVar.select_production = true;
                        $scope.s4gLocalVar.select_powerFromBattery = true;
                        $scope.s4gLocalVar.select_consumptionDirect = true;
                        $scope.s4gLocalVar.select_powerFromGrid = true;
                        $scope.s4gLocalVar.select_SoC = true;
                    } else {


                        $scope.s4gLocalVar.select_SMX_P_ESS = false;
                        $scope.s4gLocalVar.select_SMX_P_EV = false;
                        $scope.s4gLocalVar.select_SMX_P_PCC = false;
                        $scope.s4gLocalVar.select_SMX_P_PV = false;
                        $scope.s4gLocalVar.select_froniusBattery = false;
                        $scope.s4gLocalVar.select_froniusGrid = false;
                        $scope.s4gLocalVar.select_froniusLoad = false;
                        $scope.s4gLocalVar.select_froniusPhotovoltaic = false;
                        $scope.s4gLocalVar.select_production = false;
                        $scope.s4gLocalVar.select_powerFromBattery = false;
                        $scope.s4gLocalVar.select_consumptionDirect = false;
                        $scope.s4gLocalVar.select_powerFromGrid = false;
                        $scope.s4gLocalVar.select_SoC = false;
                    }
                }

                $scope.s4gLocalVar.setxTimestampsForCharts = function (start, end) {

                    var diffInSeconds = ($scope.endDate.getTime() - $scope.startDate.getTime()) / 1000;
                    var diffInDays = Math.round(diffInSeconds / (24 * 60 * 60));
                    var date = new Date(start.getTime());
                    var dateEnd = new Date(end.getTime() + (diffInDays * 24 * 60 * 60));//we get next day because sometimes we receive 1 more data after the end of the day (at midnight)
                    var tempDates = [];
                    while (date <= dateEnd) {
                        tempDates.push(date);
                        date = new Date(date.getTime() + $scope.s4gLocalVar.frequencyInMinutesForChart * 60 * 1000);
                    }
                    $scope.s4gLocalVar.xTimestamps = tempDates;
                }


                $scope.s4gLocalVar.getDataFromBackend_number = function (url, varName) {
                    $scope.s4gLocalVar.allVar['ready_' + varName] = false;
                    $http({
                        method: 'GET',
                        url: url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        var temp = response.data;
                        if (temp == null || JSON.stringify(temp).includes("Empty message")) {
                            $scope.s4gLocalVar.allVar[varName] = 0;
                            $scope.s4gLocalVar.allVar['ready_' + varName] = true;
                            $scope.s4gLocalVar.updateChartVariables();
                            // console.log("Empty Message");
                            // $scope.insertDataInChart("P_EV",[], [], '#990000');
                        } else {
                            if (typeof temp == 'string') {
                                $scope.s4gLocalVar.allVar[varName] = Math.round(Number(temp) * 100) / 100;
                            } else {
                                $scope.s4gLocalVar.allVar[varName] = Math.round(temp * 100) / 100;
                            }
                            $scope.s4gLocalVar.allVar['ready_' + varName] = true;
                            $scope.s4gLocalVar.updateChartVariables();
                            //$scope.insertDataInChart("P_EV",$scope.s4gLocalVar.xTimestamps, tempDataEV, '#990000');
                        }
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.allVar[varName] = 0;
                        $scope.s4gLocalVar.allVar['ready_' + varName] = true;
                        $scope.s4gLocalVar.updateChartVariables();
                    });
                }

                $scope.s4gLocalVar.getDataFromBackend_array = function (url, varName) {
                    $scope.s4gLocalVar.allVar['ready_' + varName] = false;
                    $http({
                        method: 'GET',
                        url: url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //console.log(response.data)
                        // this callback will be called asynchronously
                        // when the response is available
                        var temp = response.data;
                        if (temp == null || JSON.stringify(temp).includes("Empty message")) {
                            $scope.s4gLocalVar.allVar[varName] = [];
                            $scope.s4gLocalVar.allVar['ready_' + varName] = true;
                            $scope.s4gLocalVar.updateChartVariables();
                            // console.log("Empty Message");
                            // $scope.insertDataInChart("P_EV",[], [], '#990000');
                        } else {
                            if (typeof temp == 'string') {
                                $scope.s4gLocalVar.allVar[varName] = JSON.parse(temp);
                            } else {
                                $scope.s4gLocalVar.allVar[varName] = temp;
                            }
                            $scope.s4gLocalVar.allVar['ready_' + varName] = true;
                            $scope.s4gLocalVar.updateChartVariables();
                            //$scope.insertDataInChart("P_EV",$scope.s4gLocalVar.xTimestamps, tempDataEV, '#990000');
                        }
                    }, function errorCallback(response) {
                        $scope.s4gLocalVar.allVar[varName] = [];
                        $scope.s4gLocalVar.allVar['ready_' + varName] = true;
                        $scope.s4gLocalVar.updateChartVariables();
                    });
                }

                $scope.s4gLocalVar.getEnergyConsumption = function () {
                    $scope.urlEnergyCons = $rootScope.s4gVar.backendURL + '/ENERGY/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.PLoad.pathEnergy;
                    if ($rootScope.s4gVar.demoEnabled) {
                        $scope.urlEnergyCons = $rootScope.s4gVar.backendURL + '/ENERGY/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/load';
                    }

                    //TODO if the data in the datawarehouse will never be corrected it should be necessary to find a way to correct also the energy Balance with sign change in specific dates already threated in correctArrayWithDates
                    $scope.s4gLocalVar.getDataFromBackend_number($scope.urlEnergyCons, 'energyBalance');
                }

                $scope.s4gLocalVar.round2Digit = function (number) {
                    return Math.round(number * 100) / 100;
                }

                $scope.s4gLocalVar.getP_EV = function () {
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.EV.pathP + '/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.field.EV.pathP + '/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.field.EV.pathP + '/ALL'
                    }
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'P_EV');
                }

                $scope.s4gLocalVar.getP_PV = function () {
                    //S4G-GW-EDYNA-0015
                    $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] = false;

                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.PV.pathP + '/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.field.PV.pathP + '/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.field.PV.pathP + '/ALL'
                    }
                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.PV.pathP + '/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'P_PV');
                }
                $scope.s4gLocalVar.getP_ESS = function () {
                    //S4G-GW-EDYNA-0016

                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.ESS.pathP + '/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.field.ESS.pathP + '/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.field.ESS.pathP + '/ALL'
                    }
                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.ESS.pathP + '/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'P_ESS');
                }

                $scope.s4gLocalVar.getP_PCC = function () {
                    //S4G-GW-EDYNA-0017
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.PLoad.pathP + '/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.field.PLoad.pathP + '/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.field.PLoad.pathP + '/ALL'
                    }
                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.field.PLoad.pathP + '/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'P_PCC');
                }


                $scope.s4gLocalVar.getFroniusPhotovoltaic = function () {

                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/photovoltaic/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/photovoltaic/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/photovoltaic/ALL'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/photovoltaic/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'FroniusPhotovoltaic');

                }
                $scope.s4gLocalVar.getFroniusLoad = function () {
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/ALL'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'FroniusLoad');
                }

                $scope.s4gLocalVar.getFroniusBattery = function () {
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/ALL'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'FroniusBattery');
                }


                $scope.s4gLocalVar.getFroniusGrid = function () {
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'FroniusGrid');

                }
                $scope.s4gLocalVar.getNegativeFroniusGrid = function () {
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/ALL/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'NegativeFroniusGrid');
                }


                $scope.s4gLocalVar.getNegativeConsumptionBattery = function () {
                    $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] = false;
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/NEGATIVE/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/NEGATIVE';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/NEGATIVE'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/NEGATIVE/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'NegativeConsumptionBattery');

                }


                $scope.s4gLocalVar.getNegativeOverProduction = function () {
                    $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] = false;
                    $scope.s4gLocalVar.allVar['ready_Production'] = false;
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/NEGATIVE/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/NEGATIVE';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/NEGATIVE'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/grid/NEGATIVE/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'NegativeOverProduction');
                }

                /*
                $scope.s4gLocalVar.getConsumptionForEnergy = function () {
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/direct_consumption/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/direct_consumption/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/direct_consumption/ALL'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/direct_consumption/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'ConsumptionForEnergy');

                }
                */


                $scope.s4gLocalVar.getNegConsHouseJSON = function () {
                    $scope.s4gLocalVar.allVar['ready_ConsumptionHouse'] = false;
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/ALL'
                    }

                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/load/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'NegConsHouseJSON');

                }

                $scope.s4gLocalVar.getPowerFromBattery = function () {
                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/POSITIVE/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/POSITIVE';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/POSITIVE'
                    }
                     //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/battery/POSITIVE/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'PowerFromBattery');
                }


                $scope.s4gLocalVar.getSoC_JSON = function () {

                    var url = "";
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart<=24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/SoC/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<=7*24*60)
                    {
                        //http://10.8.0.111:18081/INFLUXDB/MONTH/2019-12/InstallationHouse27/load/ALL
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/MONTH/' + $scope.startMonthItalianFormat + '/' + $rootScope.s4gVar.installation + '/SoC/ALL';
                    }
                    else if ($scope.s4gLocalVar.frequencyInMinutesForChart>7*24*60)
                    {
                        url = $rootScope.s4gVar.backendURL + '/INFLUXDB/YEAR/' + $scope.startYearItalianFormat + '/' + $rootScope.s4gVar.installation + '/SoC/ALL'
                    }
                    //var url = $rootScope.s4gVar.backendURL + '/INFLUXDB/' + $scope.startDateItalianFormat + '/' + $scope.endDateItalianFormat + '/' + $rootScope.s4gVar.installation + '/SoC/GROUPBY/' + $scope.s4gLocalVar.frequencyInMinutesForChart;
                    $scope.s4gLocalVar.getDataFromBackend_array(url, 'SoC_JSON');
                }

                $scope.s4gLocalVar.disableUpdateButton = function () {
                    //if ($scope.s4gLocalVar.allVar['ready_P_EV'] && $scope.s4gLocalVar.allVar['ready_P_PV'] && $scope.s4gLocalVar.allVar['ready_P_ESS'] && $scope.s4gLocalVar.allVar['ready_P_PCC'] && $scope.s4gLocalVar.allVar['ready_FroniusPhotovoltaic'] && $scope.s4gLocalVar.allVar['ready_FroniusLoad'] && $scope.s4gLocalVar.allVar['ready_FroniusBattery'] && $scope.s4gLocalVar.allVar['ready_FroniusGrid'] && $scope.s4gLocalVar.allVar['ready_NegativeFroniusGrid'] && $scope.s4gLocalVar.allVar['ready_NegativeConsumptionBattery'] && $scope.s4gLocalVar.allVar['ready_ConsumptionForEnergy'] && $scope.s4gLocalVar.allVar['ready_ConsumptionHouse'] && $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] && $scope.s4gLocalVar.allVar['ready_NegConsHouseJSON'] && $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] && $scope.s4gLocalVar.allVar['ready_NegativeOverProduction'] && $scope.s4gLocalVar.allVar['ready_Production'] && $scope.s4gLocalVar.allVar['ready_PowerFromBattery'] && $scope.s4gLocalVar.allVar['ready_SoC_JSON']) {
                    if ($scope.s4gLocalVar.allVar['ready_P_EV'] && $scope.s4gLocalVar.allVar['ready_P_PV'] && $scope.s4gLocalVar.allVar['ready_P_ESS'] && $scope.s4gLocalVar.allVar['ready_P_PCC'] && $scope.s4gLocalVar.allVar['ready_FroniusPhotovoltaic'] && $scope.s4gLocalVar.allVar['ready_FroniusLoad'] && $scope.s4gLocalVar.allVar['ready_FroniusBattery'] && $scope.s4gLocalVar.allVar['ready_FroniusGrid'] && $scope.s4gLocalVar.allVar['ready_NegativeFroniusGrid'] && $scope.s4gLocalVar.allVar['ready_NegativeConsumptionBattery'] && $scope.s4gLocalVar.allVar['ready_ConsumptionHouse'] && $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] && $scope.s4gLocalVar.allVar['ready_NegConsHouseJSON'] && $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] && $scope.s4gLocalVar.allVar['ready_NegativeOverProduction'] && $scope.s4gLocalVar.allVar['ready_Production'] && $scope.s4gLocalVar.allVar['ready_PowerFromBattery'] && $scope.s4gLocalVar.allVar['ready_SoC_JSON']) {
                            return false;
                    } else {
                        return true;
                    }
                }

                $scope.s4gLocalVar.restartAcquisition = function () {
                    if (($scope.startDate != undefined) && ($scope.endDate != undefined)) {
                        $scope.$broadcast('startLoading');
                        $scope.resetChart();
                        $scope.s4gLocalVar.alreadyGetTimestampFromResponse = false;
                        $scope.s4gLocalVar.getP_ESS();
                        $scope.s4gLocalVar.getP_EV();
                        $scope.s4gLocalVar.getP_PCC();
                        $scope.s4gLocalVar.getP_PV();
                        $scope.s4gLocalVar.getFroniusBattery();
                        $scope.s4gLocalVar.getFroniusGrid();
                        $scope.s4gLocalVar.getNegativeFroniusGrid();
                        $scope.s4gLocalVar.getFroniusLoad();
                        //$scope.s4gLocalVar.getNegativeFroniusLoad();
                        $scope.s4gLocalVar.getFroniusPhotovoltaic();
                        $scope.s4gLocalVar.getNegativeConsumptionBattery();
                        $scope.s4gLocalVar.getNegativeOverProduction();
                        //$scope.s4gLocalVar.getConsumptionForEnergy();
                        $scope.s4gLocalVar.getNegConsHouseJSON();
                        $scope.s4gLocalVar.getPowerFromBattery();
                        $scope.s4gLocalVar.getSoC_JSON();
                        $scope.s4gLocalVar.getEnergyConsumption();
                    }
                }
                $scope.updateDates = function () {

                    //if the user is requiring more than 1 day of data, we have to set a frequency that is higher than the previous one, otherwise all the GUI will crash
                    if (($scope.startDate != undefined) && ($scope.endDate != undefined)) {

                        $scope.s4gLocalVar.diffInSeconds = ($scope.endDate.getTime() - $scope.startDate.getTime())/1000;
                        if ($scope.s4gLocalVar.diffInSeconds<=$scope.s4gLocalVar.limitDailySelect)
                        {
                            $scope.s4gLocalVar.frequencyInMinutesForChart = $scope.s4gLocalVar.freqDailySelectMinutes; //5 minutes
                        }
                        else
                        {
                            $scope.s4gLocalVar.diffInDays = Math.round($scope.s4gLocalVar.diffInSeconds/(24*60*60));
                            if ($scope.s4gLocalVar.diffInSeconds <= $scope.s4gLocalVar.limitWeekSelect)
                            {
                                $scope.s4gLocalVar.frequencyInMinutesForChart = $scope.s4gLocalVar.freqWeekSelectMinutes;
                                //$scope.s4gLocalVar.frequencyInMinutesForChart = 5*1*$scope.s4gLocalVar.diffInDays;//5 minutes for the first day, 10 for the second day and so on
                            }
                            else
                            {
                                if ($scope.s4gLocalVar.diffInSeconds >= $scope.s4gLocalVar.limitWeekSelect && $scope.s4gLocalVar.diffInSeconds <= $scope.s4gLocalVar.limitMonthSelect)
                                {
                                    $scope.s4gLocalVar.frequencyInMinutesForChart = $scope.s4gLocalVar.freqMonthSelectMinutes; //1 week
                                }
                                else
                                {
                                    $scope.s4gLocalVar.frequencyInMinutesForChart = $scope.s4gLocalVar.freqYearSelectMinutes;
                                }
                            }
                        }
                    }
                    //update the variables for queries only if both start and end date were set
                    if (($scope.startDate != undefined) && ($scope.endDate != undefined)) {
                        var start = $scope.startDate;
                        var dd = start.getDate();
                        var mm = start.getMonth() + 1;
                        var yyyy = start.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        $scope.startDateItalianFormat = yyyy + '-' + mm + '-' + dd;
                        $scope.startMonthItalianFormat = yyyy + '-' + mm;
                        $scope.startYearItalianFormat = yyyy;
                        var end = $scope.endDate;

                        //in the request, if we set 23-04-2019, it will send us all the collected data
                        end = new Date(end.getTime() + (24 * 60 * 60 * 1000));
                        var dd2 = end.getDate();
                        var mm2 = end.getMonth() + 1;
                        var yyyy2 = end.getFullYear();
                        if (dd2 < 10) {
                            dd2 = '0' + dd2;
                        }
                        if (mm2 < 10) {
                            mm2 = '0' + mm2;
                        }
                        $scope.endDateItalianFormat = yyyy2 + '-' + mm2 + '-' + dd2;

                        $scope.s4gLocalVar.setxTimestampsForCharts($scope.startDate, $scope.endDate);

                        if ($scope.firstTime) {
                            $scope.s4gLocalVar.restartAcquisition();
                            $scope.firstTime = false;
                        }
                    }

                }

                var minusArray = function (array) {
                    if (array != null && array != [] && typeof array == 'object' && array.length > 0) {
                        return array.map(function (num, idx) {
                            return -num;
                        });
                    } else {
                        return [];
                    }
                }

                var absArray = function (array) {
                    if (array != null && array != [] && typeof array == 'object' && array.length > 0) {
                        return array.map(function (num, idx) {
                            if (num < 0) {
                                return -num;
                            } else {
                                return num;
                            }
                        });
                    } else {
                        return [];
                    }
                }

                var sumArrays = function (array1, array2) {
                    if (array1 != null && array1 != [] && (typeof array1 == 'object') && array1.length > 0) {
                        if (array2 != null && array2 != [] && typeof array2 == 'object') {
                            return array1.map(function (num, idx) {
                                return num + array2[idx];
                            });
                        } else {
                            return array1;
                        }
                    } else {
                        if (array2 != null && array2 != [] && typeof array2 == 'object' && array2.length > 0) {
                            return array2;
                        } else {
                            return [];
                        }
                    }
                }

                $scope.s4gLocalVar.updateChartVariables = function () {

                    //we have different kind of responses.
                    // - the one with JSON contains the timestamps
                    // - the one with only arrays does not contain timestamps
                    //For this reason, even though we call this method everytime we receive a reply, we will wait for the "ready_NegConsHouseJSON"
                    //because we need timestamps for all replies!

                    //calculate the Consumption House
                    if ($scope.s4gLocalVar.allVar['ready_NegConsHouseJSON']) {
                        //elaborate consumptionHouse (JSON to array)
                        $scope.s4gLocalVar.allVar['NegativeConsumptionHouse'] = [];

                        if ($scope.s4gLocalVar.allVar['NegConsHouseJSON'].hasOwnProperty("results")) {
                            var results = $scope.s4gLocalVar.allVar['NegConsHouseJSON'].results;
                            if (typeof results == 'object') {
                                var element0 = results[0];
                                if (element0.hasOwnProperty("series")) {
                                    var series = element0.series;
                                    if (typeof series == 'object') {
                                        var singleSerie = series[0];
                                        if (singleSerie.hasOwnProperty("values")) {
                                            var values = singleSerie.values;
                                            var tempDates = [];
                                            for (var key in values) {

                                                if (typeof values[key] == 'object') {
                                                    var x = values[key];
                                                    var singleTimestamp = x[0];
                                                    var singleValue = x[1];

                                                    if (singleValue == null) {
                                                        $scope.s4gLocalVar.allVar['NegativeConsumptionHouse'].push(0);
                                                    } else {
                                                        $scope.s4gLocalVar.allVar['NegativeConsumptionHouse'].push(singleValue);
                                                    }
                                                    if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60) {
                                                        tempDates.push(new Date(singleTimestamp));
                                                    }
                                                }
                                            }
                                            if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60 && !$scope.s4gLocalVar.alreadyGetTimestampFromResponse) {
                                                $scope.s4gLocalVar.xTimestamps = tempDates;
                                                $scope.s4gLocalVar.alreadyGetTimestampFromResponse = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $scope.s4gLocalVar.allVar['ConsumptionHouse'] = [];
                        $scope.s4gLocalVar.allVar['ready_ConsumptionHouse'] = true;
                        if ($scope.s4gLocalVar.allVar['NegativeConsumptionHouse'] != null && $scope.s4gLocalVar.allVar['NegativeConsumptionHouse'].length > 0 && $scope.s4gLocalVar.allVar['NegativeConsumptionHouse'] != []) {
                            //remove bad values wrongly (wrong sign) stored in the database
                            $scope.s4gLocalVar.allVar['NegativeConsumptionHouse'] = correctArrayWithDates($scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.allVar['NegativeConsumptionHouse']);

                            var singleType = "line";
                            var isArea = true;
                            if (!$rootScope.s4gVar.demoEnabled) {
                                $scope.s4gLocalVar.allVar['ConsumptionHouse'] = minusArray($scope.s4gLocalVar.allVar['NegativeConsumptionHouse']);
                            } else {
                                //when we get data from InstallationHouse27 the data are positive
                                $scope.s4gLocalVar.allVar['ConsumptionHouse'] = $scope.s4gLocalVar.allVar['NegativeConsumptionHouse'];
                            }
                            $scope.insertDataInChart($scope.s4gLocalVar.PowerFromGridLabel, $scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.allVar['ConsumptionHouse'], '#ff0000', singleType, 1, isArea);
                        } else {
                            $scope.insertDataInChart($scope.s4gLocalVar.PowerFromGridLabel, $scope.s4gLocalVar.xTimestamps, new Array($scope.s4gLocalVar.xTimestamps.length).fill(0), '#ff0000', singleType, 1, isArea);
                        }


                        //calculate the Power From Battery
                        if ($scope.s4gLocalVar.allVar['ready_PowerFromBattery']) {
                            //var singleType = "area";
                            var singleType = "line";
                            var isArea = true;
                            if ($scope.s4gLocalVar.allVar['PowerFromBattery'] != null && $scope.s4gLocalVar.allVar['PowerFromBattery'].length > 0 && $scope.s4gLocalVar.allVar['PowerFromBattery'] != []) {
                                $scope.insertDataInChart($scope.s4gLocalVar.PowerFromBatteryLabel, $scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.allVar['PowerFromBattery'], '#ffcc00', singleType, 1, isArea);
                            } else {
                                //in the new version (for YEAR and MONTH) we receive different data (JSON instead of array) so we have to process them differently
                                if ($scope.s4gLocalVar.allVar['PowerFromBattery'].hasOwnProperty("results")) {
                                    var results = $scope.s4gLocalVar.allVar['PowerFromBattery'].results;
                                    $scope.s4gLocalVar.allVar['PowerFromBattery'] = [];
                                    if (typeof results == 'object') {
                                        var element0 = results[0];
                                        if (element0.hasOwnProperty("series")) {
                                            var series = element0.series;
                                            if (typeof series == 'object') {
                                                var singleSerie = series[0];
                                                if (singleSerie.hasOwnProperty("values")) {
                                                    var values = singleSerie.values;
                                                    var tempDates = [];
                                                    for (var key in values) {

                                                        if (typeof values[key] == 'object') {
                                                            var x = values[key];
                                                            var singleTimestamp = x[0];
                                                            var singleValue = x[1];

                                                            if (singleValue == null) {
                                                                $scope.s4gLocalVar.allVar['PowerFromBattery'].push(0);
                                                            } else {
                                                                $scope.s4gLocalVar.allVar['PowerFromBattery'].push(singleValue);
                                                            }
                                                            if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60) {
                                                                tempDates.push(new Date(singleTimestamp));
                                                            }
                                                        }
                                                    }
                                                    if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60 && !$scope.s4gLocalVar.alreadyGetTimestampFromResponse) {
                                                        $scope.s4gLocalVar.xTimestamps = tempDates;
                                                        $scope.s4gLocalVar.alreadyGetTimestampFromResponse = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if ($scope.s4gLocalVar.allVar['PowerFromBattery'] != null && $scope.s4gLocalVar.allVar['PowerFromBattery'].length > 0 && $scope.s4gLocalVar.allVar['PowerFromBattery'] != []) {
                                        //remove bad values wrongly (wrong sign) stored in the database
                                        //$scope.s4gLocalVar.allVar['PowerFromBattery'] = correctArrayWithDates($scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.allVar['PowerFromBattery']);
                                        $scope.insertDataInChart($scope.s4gLocalVar.PowerFromBatteryLabel, $scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.allVar['PowerFromBattery'], '#ffcc00', singleType, 1, isArea);
                                    } else {
                                        $scope.insertDataInChart($scope.s4gLocalVar.PowerFromBatteryLabel, $scope.s4gLocalVar.xTimestamps, new Array($scope.s4gLocalVar.xTimestamps.length).fill(0), '#ffcc00', singleType, 1, isArea);
                                    }
                                } else {
                                    $scope.insertDataInChart($scope.s4gLocalVar.PowerFromBatteryLabel, $scope.s4gLocalVar.xTimestamps, new Array($scope.s4gLocalVar.xTimestamps.length).fill(0), '#ffcc00', singleType, 1, isArea);
                                }
                            }
                        }

                        /*
                        //calculate the ConsumptionForEnergy
                        if ($scope.s4gLocalVar.allVar['ready_ConsumptionForEnergy']) {
                            //elaborate consumptionForEnergyCleaned (JSON to array)
                            //result should be like this:
                            /!*
                            {
                                "results":
                                [
                                    {
                                        "statement_id": 0,
                                        "series":
                                        [
                                            {
                                                "columns": ["time", "mean"],
                                                "name": "InstallationHouseBolzano",
                                                "values":
                                                [
                                                    [
                                                        "2019-01-01T00:00:00Z", null],
                                                        ["2019-01-01T00:30:00Z", null],
                                                        ["2019-01-01T01:00:00Z", null],
                                                        ..
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                            *!/

                            if ($scope.s4gLocalVar.allVar['ConsumptionForEnergy'].hasOwnProperty("results")) {
                                $scope.s4gLocalVar.allVar['ConsumptionForEnergyCleaned'] = [];
                                var results = $scope.s4gLocalVar.allVar['ConsumptionForEnergy'].results;
                                if (typeof results == 'object') {
                                    var element0 = results[0];
                                    if (element0.hasOwnProperty("series")) {
                                        var series = element0.series;
                                        if (typeof series == 'object') {
                                            var singleSerie = series[0];
                                            if (singleSerie.hasOwnProperty("values")) {
                                                var values = singleSerie.values;
                                                var tempDates = [];
                                                for (var key in values) {

                                                    if (typeof values[key] == 'object') {
                                                        var x = values[key];
                                                        var singleTimestamp = x[0];
                                                        var singleValue = x[1];

                                                        if (singleValue == null) {
                                                            $scope.s4gLocalVar.allVar['ConsumptionForEnergyCleaned'].push(0);
                                                        } else {
                                                            $scope.s4gLocalVar.allVar['ConsumptionForEnergyCleaned'].push(singleValue);
                                                        }
                                                        if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60) {
                                                            tempDates.push(new Date(singleTimestamp));
                                                        }
                                                    }
                                                }
                                                if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60 && !$scope.s4gLocalVar.alreadyGetTimestampFromResponse) {
                                                    $scope.s4gLocalVar.xTimestamps = tempDates;
                                                    $scope.s4gLocalVar.alreadyGetTimestampFromResponse = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        */
                        if ($scope.s4gLocalVar.allVar['ready_P_PV']) {
                            if ($scope.s4gLocalVar.allVar['P_PV'].hasOwnProperty("results")) {
                                var results = $scope.s4gLocalVar.allVar['P_PV'].results;
                                $scope.s4gLocalVar.allVar['P_PV'] = [];
                                if (typeof results == 'object') {
                                    var element0 = results[0];
                                    if (element0.hasOwnProperty("series")) {
                                        var series = element0.series;
                                        if (typeof series == 'object') {
                                            var singleSerie = series[0];
                                            if (singleSerie.hasOwnProperty("values")) {
                                                var values = singleSerie.values;
                                                var tempDates = [];
                                                for (var key in values) {

                                                    if (typeof values[key] == 'object') {
                                                        var x = values[key];
                                                        var singleTimestamp = x[0];
                                                        var singleValue = x[1];

                                                        if (singleValue == null) {
                                                            $scope.s4gLocalVar.allVar['P_PV'].push(0);
                                                        } else {
                                                            $scope.s4gLocalVar.allVar['P_PV'].push(singleValue);
                                                        }
                                                        if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60) {
                                                            tempDates.push(new Date(singleTimestamp));
                                                        }
                                                    }
                                                }
                                                if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60 && !$scope.s4gLocalVar.alreadyGetTimestampFromResponse) {
                                                    $scope.s4gLocalVar.xTimestamps = tempDates;
                                                    $scope.s4gLocalVar.alreadyGetTimestampFromResponse = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if ($scope.s4gLocalVar.allVar['ready_NegativeConsumptionBattery'])
                        {
                            if ($scope.s4gLocalVar.allVar['NegativeConsumptionBattery'].hasOwnProperty("results")) {
                                var results = $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'].results;
                                $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'] = [];
                                if (typeof results == 'object') {
                                    var element0 = results[0];
                                    if (element0.hasOwnProperty("series")) {
                                        var series = element0.series;
                                        if (typeof series == 'object') {
                                            var singleSerie = series[0];
                                            if (singleSerie.hasOwnProperty("values")) {
                                                var values = singleSerie.values;
                                                var tempDates = [];
                                                for (var key in values) {

                                                    if (typeof values[key] == 'object') {
                                                        var x = values[key];
                                                        var singleTimestamp = x[0];
                                                        var singleValue = x[1];

                                                        if (singleValue == null) {
                                                            $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'].push(0);
                                                        } else {
                                                            $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'].push(singleValue);
                                                        }
                                                        if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60) {
                                                            tempDates.push(new Date(singleTimestamp));
                                                        }
                                                    }
                                                }
                                                if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60 && !$scope.s4gLocalVar.alreadyGetTimestampFromResponse) {
                                                    $scope.s4gLocalVar.xTimestamps = tempDates;
                                                    $scope.s4gLocalVar.alreadyGetTimestampFromResponse = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //remove bad values wrongly (wrong sign) stored in the database
                            //$scope.s4gLocalVar.allVar['NegativeConsumptionBattery'] = correctArrayWithDates($scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.allVar['NegativeConsumptionBattery']);

                        }
                        if ($scope.s4gLocalVar.allVar['ready_NegativeOverProduction'])
                        {
                            if ($scope.s4gLocalVar.allVar['NegativeOverProduction'].hasOwnProperty("results")) {
                                var results = $scope.s4gLocalVar.allVar['NegativeOverProduction'].results;
                                $scope.s4gLocalVar.allVar['NegativeOverProduction'] = [];
                                if (typeof results == 'object') {
                                    var element0 = results[0];
                                    if (element0.hasOwnProperty("series")) {
                                        var series = element0.series;
                                        if (typeof series == 'object') {
                                            var singleSerie = series[0];
                                            if (singleSerie.hasOwnProperty("values")) {
                                                var values = singleSerie.values;
                                                var tempDates = [];
                                                for (var key in values) {

                                                    if (typeof values[key] == 'object') {
                                                        var x = values[key];
                                                        var singleTimestamp = x[0];
                                                        var singleValue = x[1];

                                                        if (singleValue == null) {
                                                            $scope.s4gLocalVar.allVar['NegativeOverProduction'].push(0);
                                                        } else {
                                                            $scope.s4gLocalVar.allVar['NegativeOverProduction'].push(singleValue);
                                                        }
                                                        if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60) {
                                                            tempDates.push(new Date(singleTimestamp));
                                                        }
                                                    }
                                                }
                                                if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60 && !$scope.s4gLocalVar.alreadyGetTimestampFromResponse) {
                                                    $scope.s4gLocalVar.xTimestamps = tempDates;
                                                    $scope.s4gLocalVar.alreadyGetTimestampFromResponse = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //calculate the ConsumptionDirect
                        if ($scope.s4gLocalVar.allVar['ready_P_PV'] && $scope.s4gLocalVar.allVar['ready_NegativeConsumptionBattery'] && $scope.s4gLocalVar.allVar['ready_NegativeOverProduction']) {
                            //var singleType = "area";
                            var singleType = "line";
                            var isArea = true;
                            //$scope.s4gLocalVar.allVar["ConsumptionDirect"] = absArray(sumArrays(sumArrays($scope.s4gLocalVar.allVar['P_PV'], $scope.s4gLocalVar.allVar['NegativeConsumptionBattery']), $scope.s4gLocalVar.allVar['NegativeOverProduction']));
                            $scope.s4gLocalVar.allVar['ConsumptionDirect'] = $scope.s4gLocalVar.calculateConsumptionDirect($scope.s4gLocalVar.allVar['P_PV'], $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'], $scope.s4gLocalVar.allVar['NegativeOverProduction']);
                            $scope.s4gLocalVar.allVar['ready_ConsumptionDirect'] = true;
                            if ($scope.s4gLocalVar.allVar['ConsumptionDirect'] != null && $scope.s4gLocalVar.allVar['ConsumptionDirect'].length > 0 && $scope.s4gLocalVar.allVar['ConsumptionDirect'] != []) {
                                $scope.insertDataInChart($scope.s4gLocalVar.ConsumptionDirectLabel, $scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.allVar['ConsumptionDirect'], '#999999', singleType, 1, isArea);
                            } else {
                                $scope.insertDataInChart($scope.s4gLocalVar.ConsumptionDirectLabel, $scope.s4gLocalVar.xTimestamps, new Array($scope.s4gLocalVar.xTimestamps.length).fill(0), '#999999', singleType, 1, isArea);
                            }
                        }


                        //calculate the production
                        if ($scope.s4gLocalVar.allVar['ready_P_PV'] && $scope.s4gLocalVar.allVar['ready_NegativeOverProduction']) {
                            //production = P_PV - overProduction
                            var singleType = "line";
                            var isArea = false;
                            //$scope.s4gLocalVar.production = sumArrays($scope.s4gLocalVar.allVar['P_PV'], $scope.s4gLocalVar.allVar['NegativeOverProduction']);
                            $scope.s4gLocalVar.production = $scope.s4gLocalVar.calculateProduction($scope.s4gLocalVar.allVar['P_PV'], $scope.s4gLocalVar.allVar['NegativeOverProduction']);
                            $scope.s4gLocalVar.allVar['ready_Production'] = true;
                            if ($scope.s4gLocalVar.production != null && $scope.s4gLocalVar.production.length > 0 && $scope.s4gLocalVar.production != []) {
                                $scope.insertDataInChart($scope.s4gLocalVar.ProductionLabel, $scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.production, '#000000', singleType, 1, isArea);
                            } else {
                                $scope.insertDataInChart($scope.s4gLocalVar.ProductionLabel, $scope.s4gLocalVar.xTimestamps, new Array($scope.s4gLocalVar.xTimestamps.length).fill(0), '#000000', singleType, 1, isArea);
                            }
                        }

                        //calculate the State of Charge (è in percentuale, quindi da capire come mostrarlo nello stesso grafico)
                        //http://130.192.86.142:18081/INFLUXDB/2019-03-05/2019-03-07/InstallationHouseBolzano/SoC/GROUPBY/30


                        if ($scope.s4gLocalVar.allVar['SoC_JSON'].hasOwnProperty("results")) {
                            $scope.s4gLocalVar.SoC = [];
                            var results = $scope.s4gLocalVar.allVar['SoC_JSON'].results;
                            if (typeof results == 'object') {
                                var element0 = results[0];
                                if (element0.hasOwnProperty("series")) {
                                    var series = element0.series;
                                    if (typeof series == 'object') {
                                        var singleSerie = series[0];
                                        if (singleSerie.hasOwnProperty("values")) {
                                            var values = singleSerie.values;
                                            var tempDates = [];
                                            for (var key in values) {

                                                if (typeof values[key] == 'object') {
                                                    var x = values[key];
                                                    var singleTimestamp = x[0];
                                                    var singleValue = x[1];

                                                    if (singleValue == null) {
                                                        $scope.s4gLocalVar.SoC.push(0);
                                                    } else {
                                                        $scope.s4gLocalVar.SoC.push(singleValue);
                                                    }
                                                    if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60) {
                                                        tempDates.push(new Date(singleTimestamp));
                                                    }
                                                }
                                            }
                                            if ($scope.s4gLocalVar.frequencyInMinutesForChart > 24 * 60 && !$scope.s4gLocalVar.alreadyGetTimestampFromResponse) {
                                                $scope.s4gLocalVar.xTimestamps = tempDates;
                                                $scope.s4gLocalVar.alreadyGetTimestampFromResponse = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //if we are plotting more than 1 week the SoC is not plotted
                        if ($scope.s4gLocalVar.diffInSeconds <= 6 * 24 * 60 * 60) {
                            var singleType = "line";
                            var isArea = false;

                            $scope.s4gLocalVar.allVar['ready_SoC_JSON'] = true;
                            if ($scope.s4gLocalVar.SoC != null && $scope.s4gLocalVar.SoC.length > 0 && $scope.s4gLocalVar.SoC != []) {
                                $scope.insertDataInChart($scope.s4gLocalVar.SoCLabel, $scope.s4gLocalVar.xTimestamps, $scope.s4gLocalVar.SoC, '#ff9900', singleType, 2, isArea);
                            } else {
                                $scope.insertDataInChart($scope.s4gLocalVar.SoCLabel, $scope.s4gLocalVar.xTimestamps, new Array($scope.s4gLocalVar.xTimestamps.length).fill(0), '#ff9900', singleType, 2, isArea);
                            }
                        } else {
                            $scope.s4gLocalVar.deleteSeriesFromChart($scope.s4gLocalVar.SoCLabel);
                        }
                    }
                }
                // fill chart data with temporary dummy data to avoid issues
                // related to chart generation with no data defined, e.g., wrong
                // axis computation. It will be deleted upon data loading
                $scope.dashData = [
                    {
                        values: [],
                        key: $scope.s4gLocalVar.PowerFromGridLabel,
                        color: '#ff0000'
                    }
                ];


                // define the initial range for data to be loaded as the last
                // month

                // end date will be today
                var today = new Date();
                // start date will be one month ago
                var oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDate() - 1);

                var oneHourAgo = new Date();
                oneHourAgo.setHours(oneHourAgo.getHours() - 25);

                $scope.resetChart = function () {
                    var index = 0;
                    var inserted = false;
                    // at first we check if we have already any series in the chart
                    // if so, we simply remove the data inside each series
                    // otherwise, if the chart is completely empty, we set a sample series
                    for (index = 0; index < $scope.dashData.length; index++) {
                        if ($scope.dashData[index] != undefined) {
                            inserted = true;
                            $scope.dashData[index].values = [];
                            /*
                            $scope.dashData[index].values.push({'x':[],'y':[]});
                            */
                            //we set only the first date to let user see that no data is available, but avoiding to start from 1986
                            var tempReset1 = {};
                            tempReset1.x = $scope.s4gLocalVar.xTimestamps[0];
                            tempReset1.y = 0;
                            $scope.dashData[index].values.push(tempReset1);
                        }
                    }
                    if (!inserted) {
                        $scope.dashData[index] = {};
                        $scope.dashData[index].values = [];
                        /*
                        $scope.dashData[index].values.push({'x':[],'y':[]});
                        */
                        //we set only the first date to let user see that no data is available, but avoiding to start from 1986
                        var tempReset2 = {};
                        tempReset2.x = $scope.s4gLocalVar.xTimestamps[0];
                        tempReset2.y = 0;
                        $scope.dashData[index].values.push(tempReset2);
                        $scope.dashData[index].color = '#999999';
                        $scope.dashData[index].key = 'Consumption Direct';
                    }
                };

                $scope.resetChart();

                //$scope.changeCurrentMeasure('production');
                $scope.setStartDate = function (startDate) {
                    if (startDate != undefined) {
                        //it is necessary to propagate the new values from the parent controller to this (don't know why)
                        $scope.startDate = startDate;
                        $scope.startDate.setSeconds(0);
                        $scope.startDate.setMinutes(0);
                        $scope.startDate.setHours(0);
                        $scope.updateDates();
                    }
                }
                $scope.setEndDate = function (endDate) {
                    if (endDate != undefined) {
                        //it is necessary to propagate the new values from the parent controller to this (don't know why)
                        $scope.endDate = endDate;
                        var tempNow = new Date();
                        if (tempNow.getDay() != endDate.getDay() || tempNow.getMonth() != endDate.getMonth() ||tempNow.getFullYear() != endDate.getFullYear()) {
                            $scope.endDate.setSeconds(59);
                            $scope.endDate.setMinutes(59);
                            $scope.endDate.setHours(23);
                        }
                        $scope.updateDates();
                    }
                }

                //startup data:
                // end fixed at today
                var tempEndDate = new Date();
                //var tempStartDate = new Date(tempEndDate.getTime()-(24*60*60*1000));

                // start date: today at midnight
                var todayMidNight = new Date();
                todayMidNight.setHours(0);
                todayMidNight.setMinutes(0);
                todayMidNight.setSeconds(0);

                var tempStartDate = todayMidNight;
                $scope.setStartDate(tempStartDate);
                $scope.setEndDate(tempEndDate);
                $scope.updateDates();

                $scope.getBlockSizeForGauge = function () {
                    var dimension = document.getElementById("graph-container").offsetWidth;
                    if (dimension > 600) {
                        return dimension - (dimension / 2) - 150;
                    } else {
                        return dimension - 150;
                    }
                }

                $scope.insertDataInChart = function (label, xTimestamps, data, color, type, yAxis, isArea) {
                    /*
                    * change the type of chart if period >= 7 days
                    */
                    //if yAxis=2 it means that we are plotting a percentage on the second axis thus we do not have to change type of chart
                    if (yAxis != 2) {
                        //if the selected period is bigger than 1 week we change type of graph into bar
                        //if (type == "area") {
                            if ($scope.s4gLocalVar.diffInSeconds >= $scope.s4gLocalVar.limitDailySelect) {
                                type = "bar";
                            }
                            //else
                            //{
                            //    type = "area";
                            //}
                        //}
                    }
                    var found = false;
                    var inserted = false;
                    //at first we check if the specific data (with specified label) is already plotted.
                    // If so, we substitute the values with the new one,
                    //Otherwise, we create a new label in the chart

                    if (data != undefined && data.length > 0) {
                        if (typeof newData == "string") {
                            var dataJSON = JSON.parse(data);
                        } else {
                            var dataJSON = data;
                        }
                        //the following for is needed to avoid the error: TypeError: Cannot assign to readonly property
                        var newData = [];
                        for (var index = 0; index < dataJSON.length; index++) {
                            //substitute NaN with 0
                            if (isNaN(dataJSON[index]) || dataJSON[index] == '' || dataJSON[index] == null) {
                                newData[index] = 0;
                            } else {
                                newData[index] = dataJSON[index];
                            }
                        }

                        dataJSON = newData;
                        for (var index = 0; index < $scope.dashData.length; index++) {
                            if ($scope.dashData[index] != undefined && $scope.dashData[index].key.includes(label)) {
                                found = true;
                                inserted = true;
                                $scope.dashData[index] = {};
                                $scope.dashData[index].values = [];
                                for (var index2 = 0; index2 < dataJSON.length; index2++) {

                                    var tempinsertDataInChart = {};
                                    tempinsertDataInChart.x = xTimestamps[index2];
                                    tempinsertDataInChart.y = dataJSON[index2];
                                    $scope.dashData[index].values.push(tempinsertDataInChart);
                                }
                                $scope.dashData[index].color = color;
                                $scope.dashData[index].key = label;
                                $scope.dashData[index].type = type;
                                $scope.dashData[index].yAxis = yAxis;
                                if (isArea && type=="line")
                                {
                                    $scope.dashData[index].area = true;
                                }
                            }
                        }
                        var index = $scope.dashData.length;
                        if (!found) {
                            $scope.dashData[index] = {};
                            $scope.dashData[index].values = [];
                            for (var index2 = 0; index2 < dataJSON.length; index2++) {

                                var tempinsertDataInChart2 = {};
                                inserted = true;
                                tempinsertDataInChart2.x = xTimestamps[index2];
                                tempinsertDataInChart2.y = dataJSON[index2];
                                $scope.dashData[index].values.push(tempinsertDataInChart2);
                            }
                            $scope.dashData[index].color = color;
                            $scope.dashData[index].key = label;
                            $scope.dashData[index].type = type;
                            $scope.dashData[index].yAxis = yAxis;
                            if (isArea && type=="line")
                            {
                                $scope.dashData[index].area = true;
                            }
                        }
                    }
                    if (!inserted) {
                        var index = 0;
                        for (index = 0; index < $scope.dashData.length; index++) {
                            if ($scope.dashData[index] != undefined && $scope.dashData[index].key.includes(label)) {
                                found = true;
                                inserted = true;
                                $scope.dashData[index] = {};
                                $scope.dashData[index].values = [];
                                /*
                                $scope.dashData[index].values.push({'x':[],'y':[]});
                                */
                                //we set only the first date to let user see that no data is available, but avoiding to start from 1986
                                var tempinsertDataInChart3 = {};
                                tempinsertDataInChart3.x = xTimestamps[0];
                                tempinsertDataInChart3.y = 0;
                                $scope.dashData[index].values.push(tempinsertDataInChart3);

                                $scope.dashData[index].color = color;
                                $scope.dashData[index].key = label;
                                $scope.dashData[index].type = type;
                                $scope.dashData[index].yAxis = yAxis;
                                if (isArea && type=="line")
                                {
                                    $scope.dashData[index].area = true;
                                }
                            }
                        }
                        if (!inserted) {
                            $scope.dashData[index] = {};
                            $scope.dashData[index].values = [];
                            /*
                            $scope.dashData[index].values.push({'x':[],'y':[]});
                            */
                            //we set only the first date to let user see that no data is available, but avoiding to start from 1986
                            var tempinsertDataInChart4 = {};
                            tempinsertDataInChart4.x = xTimestamps[0];
                            tempinsertDataInChart4.y = 0;
                            $scope.dashData[index].values.push(tempinsertDataInChart4);
                            $scope.dashData[index].color = color;
                            $scope.dashData[index].key = label;
                            $scope.dashData[index].type = type;
                            $scope.dashData[index].yAxis = yAxis;
                            if (isArea && type=="line")
                            {
                                $scope.dashData[index].area = true;
                            }
                        }
                    }
                    $scope.$broadcast('endLoading');
                    // $scope.dashData = [{}]
                    //
                    // var temp3 = {};
                    // temp3.x = new Date(receivedData["time"]);
                    // temp3.y = receivedData["mean_P3"];
                    // $scope.dashData[2].values.push(temp3);
                    //
                    // {
                    //     values: [],
                    //     key: 'overproduction',
                    //     color: '#ff0000'
                    // }
                }
                //TODO get $scope.startDateItalianFormat and $scope.endDateItalianFormat from data-historic-time-series


                $scope.s4gLocalVar.deleteSeriesFromChart = function (seriesLabel)
                {
                    for (var index = 0; index < $scope.dashData.length; index++) {
                        if ($scope.dashData[index] != undefined && $scope.dashData[index].key.includes(seriesLabel)) {
                            $scope.dashData.splice(index,1);
                        }
                    }
                    if ($scope.dashData.length == 0)
                    {
                        $scope.dashData = [
                            {
                                values: [],
                                key: $scope.s4gLocalVar.PowerFromGridLabel,
                                color: '#ff0000'
                            }
                        ];
                    }
                }

                $scope.s4gLocalVar.exportData = function()
                {

                    var atLeastOne = false;
                    var proceed = true;
                    var listOfNotYetAvailable = [];
                    if ($scope.s4gLocalVar.select_SMX_P_ESS)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_P_ESS'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("SMX_P_ESS");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_SMX_P_EV)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_P_EV'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("SMX_P_EV");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_SMX_P_PCC)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_P_PCC'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("SMX_P_PCC");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_SMX_P_PV)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_P_PV'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("SMX_P_PV");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_froniusBattery)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_FroniusBattery'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("FroniusBattery");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_froniusGrid)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_FroniusGrid'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("FroniusGrid");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_froniusLoad)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_FroniusLoad'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("FroniusLoad");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_froniusPhotovoltaic)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_FroniusPhotovoltaic'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("FroniusPhotovoltaic");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_ConsumptionBattery)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_NegativeConsumptionBattery'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("ConsumptionBattery");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_consumptionDirect)
                    {
                        if (!$scope.s4gLocalVar.allVar['ready_ConsumptionDirect'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("ConsumptionDirect");
                        }
                    }
                    if ($scope.s4gLocalVar.select_powerFromGrid)
                    {
                        //the value PowerFromGrid is actually equal to the consumptionHouse
                        if (!$scope.s4gLocalVar.allVar['ready_ConsumptionHouse'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("PowerFromGrid");
                        }
                        atLeastOne = true;
                    }

                    if ($scope.s4gLocalVar.select_SoC)
                    {
                        //the value PowerFromGrid is actually equal to the consumptionHouse
                        if (!$scope.s4gLocalVar.allVar['ready_SoC_JSON'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("SoC");
                        }
                        atLeastOne = true;
                    }

                    if ($scope.s4gLocalVar.select_production)
                    {
                        //the value PowerFromGrid is actually equal to the consumptionHouse
                        if (!$scope.s4gLocalVar.allVar['ready_Production'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("Production");
                        }
                        atLeastOne = true;
                    }
                    if ($scope.s4gLocalVar.select_powerFromBattery)
                    {
                        //the value PowerFromGrid is actually equal to the consumptionHouse
                        if (!$scope.s4gLocalVar.allVar['ready_PowerFromBattery'])
                        {
                            proceed = false;
                            listOfNotYetAvailable.push("powerFromBattery");
                        }
                        atLeastOne = true;
                    }

                    if (proceed && atLeastOne)
                    {
                        var headerCSV = [];
                        var result={};
                        var finalResultsForCSV = [];
                        for (var i = 0; i < $scope.s4gLocalVar.xTimestamps.length; i++) {
                            headerCSV = [];
                            var resultForCSV = {};
                            result[$scope.s4gLocalVar.xTimestamps[i].getTime()] = {};
                            result[$scope.s4gLocalVar.xTimestamps[i].getTime()].dateTime=$scope.s4gLocalVar.xTimestamps[i];
                            headerCSV.push("timestamp");
                            resultForCSV.timestamp = $scope.s4gLocalVar.xTimestamps[i].getTime();
                            headerCSV.push("dateTime");
                            resultForCSV.dateTime = $scope.s4gLocalVar.xTimestamps[i];
                            if ($scope.s4gLocalVar.select_SMX_P_ESS) {
                                if ($scope.s4gLocalVar.allVar['P_ESS'].length > 0 && $scope.s4gLocalVar.allVar['P_ESS'][i] != null && !isNaN($scope.s4gLocalVar.allVar['P_ESS'][i]) && $scope.s4gLocalVar.allVar['P_ESS'][i] != '' && $scope.s4gLocalVar.allVar['P_ESS'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_ESS = $scope.s4gLocalVar.allVar['P_ESS'][i];
                                    resultForCSV.SMX_P_ESS = $scope.s4gLocalVar.allVar['P_ESS'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_ESS = 0;
                                    resultForCSV.SMX_P_ESS = 0;
                                }
                                headerCSV.push("SMX_P_ESS");
                            }
                            if ($scope.s4gLocalVar.select_SMX_P_EV)
                            {
                                if ($scope.s4gLocalVar.allVar['P_EV'].length > 0 && $scope.s4gLocalVar.allVar['P_EV'][i] != null && !isNaN($scope.s4gLocalVar.allVar['P_EV'][i]) && $scope.s4gLocalVar.allVar['P_EV'][i] != '' && $scope.s4gLocalVar.allVar['P_EV'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_EV = $scope.s4gLocalVar.allVar['P_EV'][i];
                                    resultForCSV.SMX_P_EV = $scope.s4gLocalVar.allVar['P_EV'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_EV = 0;
                                    resultForCSV.SMX_P_EV = 0;
                                }
                                headerCSV.push("SMX_P_EV");
                            }
                            if ($scope.s4gLocalVar.select_SMX_P_PCC)
                            {
                                if ($scope.s4gLocalVar.allVar['P_PCC'].length > 0 && $scope.s4gLocalVar.allVar['P_PCC'][i] != null && !isNaN($scope.s4gLocalVar.allVar['P_PCC'][i]) && $scope.s4gLocalVar.allVar['P_PCC'][i] != '' && $scope.s4gLocalVar.allVar['P_PCC'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_PCC = $scope.s4gLocalVar.allVar['P_PCC'][i];
                                    resultForCSV.SMX_P_PCC = $scope.s4gLocalVar.allVar['P_PCC'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_PCC = 0;
                                    resultForCSV.SMX_P_PCC = 0;
                                }
                                headerCSV.push("SMX_P_PCC");
                            }
                            if ($scope.s4gLocalVar.select_SMX_P_PV)
                            {
                                if ($scope.s4gLocalVar.allVar['P_PV'].length > 0 && $scope.s4gLocalVar.allVar['P_PV'][i] != null && !isNaN($scope.s4gLocalVar.allVar['P_PV'][i]) && $scope.s4gLocalVar.allVar['P_PV'][i] != '' && $scope.s4gLocalVar.allVar['P_PV'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_PV = $scope.s4gLocalVar.allVar['P_PV'][i];
                                    resultForCSV.P_PV = $scope.s4gLocalVar.allVar['P_PV'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SMX_P_PV = 0;
                                    resultForCSV.P_PV = 0;
                                }
                                headerCSV.push("P_PV");
                            }
                            if ($scope.s4gLocalVar.select_froniusBattery)
                            {
                                if ($scope.s4gLocalVar.allVar['FroniusBattery'].length > 0 && $scope.s4gLocalVar.allVar['FroniusBattery'][i] != null && !isNaN($scope.s4gLocalVar.allVar['FroniusBattery'][i]) && $scope.s4gLocalVar.allVar['FroniusBattery'][i] != '' && $scope.s4gLocalVar.allVar['FroniusBattery'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusBattery = $scope.s4gLocalVar.allVar['FroniusBattery'][i];
                                    resultForCSV.froniusBattery = $scope.s4gLocalVar.allVar['FroniusBattery'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusBattery = 0;
                                    resultForCSV.froniusBattery = 0;
                                }
                                headerCSV.push("froniusBattery");
                            }
                            if ($scope.s4gLocalVar.select_froniusGrid)
                            {
                                if ($scope.s4gLocalVar.allVar['FroniusGrid'].length > 0 && $scope.s4gLocalVar.allVar['FroniusGrid'][i] != null && !isNaN($scope.s4gLocalVar.allVar['FroniusGrid'][i]) && $scope.s4gLocalVar.allVar['FroniusGrid'][i] != '' && $scope.s4gLocalVar.allVar['FroniusGrid'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusGrid = $scope.s4gLocalVar.allVar['FroniusGrid'][i];
                                    resultForCSV.froniusGrid = $scope.s4gLocalVar.allVar['FroniusGrid'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusGrid = 0;
                                    resultForCSV.froniusGrid = 0;
                                }
                                headerCSV.push("froniusGrid");
                            }
                            if ($scope.s4gLocalVar.select_froniusLoad)
                            {
                                if ($scope.s4gLocalVar.allVar['FroniusLoad'].length > 0 && $scope.s4gLocalVar.allVar['FroniusLoad'][i] != null && !isNaN($scope.s4gLocalVar.allVar['FroniusLoad'][i]) && $scope.s4gLocalVar.allVar['FroniusLoad'][i] != '' && $scope.s4gLocalVar.allVar['FroniusLoad'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusLoad = $scope.s4gLocalVar.allVar['FroniusLoad'][i];
                                    resultForCSV.froniusLoad = $scope.s4gLocalVar.allVar['FroniusLoad'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusLoad = 0;
                                    resultForCSV.froniusLoad = 0;
                                }
                                headerCSV.push("froniusLoad");
                            }
                            if ($scope.s4gLocalVar.select_froniusPhotovoltaic)
                            {
                                if ($scope.s4gLocalVar.allVar['FroniusPhotovoltaic'].length > 0 && $scope.s4gLocalVar.allVar['FroniusPhotovoltaic'][i] != null && !isNaN($scope.s4gLocalVar.allVar['FroniusPhotovoltaic'][i]) && $scope.s4gLocalVar.allVar['FroniusPhotovoltaic'][i] != '' && $scope.s4gLocalVar.allVar['FroniusPhotovoltaic'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusPhotovoltaic = $scope.s4gLocalVar.allVar['FroniusPhotovoltaic'][i];
                                    resultForCSV.froniusPhotovoltaic = $scope.s4gLocalVar.allVar['FroniusPhotovoltaic'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].froniusPhotovoltaic = 0;
                                    resultForCSV.froniusPhotovoltaic = 0;
                                }
                                headerCSV.push("froniusPhotovoltaic");
                            }
                            if ($scope.s4gLocalVar.select_ConsumptionBattery)
                            {
                                if ($scope.s4gLocalVar.allVar['NegativeConsumptionBattery'].length > 0 && $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'][i] != null && !isNaN($scope.s4gLocalVar.allVar['NegativeConsumptionBattery'][i]) && $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'][i] != '' && $scope.s4gLocalVar.allVar['NegativeConsumptionBattery'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].consumptionBattery = -$scope.s4gLocalVar.allVar['NegativeConsumptionBattery'][i];
                                    resultForCSV.consumptionBattery = -$scope.s4gLocalVar.allVar['NegativeConsumptionBattery'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].consumptionBattery = 0;
                                    resultForCSV.consumptionBattery = 0;
                                }
                                headerCSV.push("consumptionBattery");
                            }
                            if ($scope.s4gLocalVar.select_consumptionDirect)
                            {
                                if ($scope.s4gLocalVar.allVar['ConsumptionDirect'].length > 0 && $scope.s4gLocalVar.allVar['ConsumptionDirect'][i] != null && !isNaN($scope.s4gLocalVar.allVar['ConsumptionDirect'][i]) && $scope.s4gLocalVar.allVar['ConsumptionDirect'][i] != '' && $scope.s4gLocalVar.allVar['ConsumptionDirect'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.ConsumptionDirectLabel] = $scope.s4gLocalVar.allVar['ConsumptionDirect'][i];
                                    resultForCSV[$scope.s4gLocalVar.ConsumptionDirectLabel] = $scope.s4gLocalVar.allVar['ConsumptionDirect'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.ConsumptionDirectLabel] = 0;
                                    resultForCSV[$scope.s4gLocalVar.ConsumptionDirectLabel] = 0;
                                }
                                headerCSV.push($scope.s4gLocalVar.ConsumptionDirectLabel);
                            }
                            if ($scope.s4gLocalVar.select_production)
                            {
                                if ($scope.s4gLocalVar.production.length > 0 && $scope.s4gLocalVar.production[i] != null  && !isNaN($scope.s4gLocalVar.production[i]) && $scope.s4gLocalVar.production[i] != '' && $scope.s4gLocalVar.production[i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.ProductionLabel] = $scope.s4gLocalVar.production[i];
                                    resultForCSV[$scope.s4gLocalVar.ProductionLabel] = $scope.s4gLocalVar.production[i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.ProductionLabel] = 0;
                                    resultForCSV[$scope.s4gLocalVar.ProductionLabel] = 0;
                                }
                                headerCSV.push($scope.s4gLocalVar.ProductionLabel);
                            }
                            if ($scope.s4gLocalVar.select_powerFromBattery)
                            {
                                if ($scope.s4gLocalVar.allVar['PowerFromBattery'].length > 0 && $scope.s4gLocalVar.allVar['PowerFromBattery'][i] != null && !isNaN($scope.s4gLocalVar.allVar['PowerFromBattery'][i]) && $scope.s4gLocalVar.allVar['PowerFromBattery'][i] != '' && $scope.s4gLocalVar.allVar['PowerFromBattery'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.PowerFromGridLabel] = $scope.s4gLocalVar.allVar['PowerFromBattery'][i];
                                    resultForCSV[$scope.s4gLocalVar.PowerFromGridLabel] = $scope.s4gLocalVar.allVar['PowerFromBattery'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.PowerFromGridLabel] = 0;
                                    resultForCSV[$scope.s4gLocalVar.PowerFromGridLabel] = 0;
                                }
                                headerCSV.push([$scope.s4gLocalVar.PowerFromGridLabel]);
                            }
                            if ($scope.s4gLocalVar.select_powerFromGrid)
                            {
                                if ($scope.s4gLocalVar.allVar['ConsumptionHouse'].length > 0 && $scope.s4gLocalVar.allVar['ConsumptionHouse'][i] != null && !isNaN($scope.s4gLocalVar.allVar['ConsumptionHouse'][i])  && $scope.s4gLocalVar.allVar['ConsumptionHouse'][i] != '' && $scope.s4gLocalVar.allVar['ConsumptionHouse'][i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.PowerFromGridLabel] = $scope.s4gLocalVar.allVar['ConsumptionHouse'][i];
                                    resultForCSV[$scope.s4gLocalVar.PowerFromGridLabel] = $scope.s4gLocalVar.allVar['ConsumptionHouse'][i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.PowerFromGridLabel] = 0;
                                    resultForCSV[$scope.s4gLocalVar.PowerFromGridLabel] = 0;
                                }
                                headerCSV.push($scope.s4gLocalVar.PowerFromGridLabel);
                            }
                            if ($scope.s4gLocalVar.select_SoC)
                            {
                                if ($scope.s4gLocalVar.SoC.length > 0 && $scope.s4gLocalVar.SoC[i] != null && !isNaN($scope.s4gLocalVar.SoC[i])  && $scope.s4gLocalVar.SoC[i] != '' && $scope.s4gLocalVar.SoC[i] != [])
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()][$scope.s4gLocalVar.SoCLabel] = $scope.s4gLocalVar.SoC[i];
                                    resultForCSV[$scope.s4gLocalVar.SoCLabel] = $scope.s4gLocalVar.SoC[i];
                                } else
                                {
                                    result[$scope.s4gLocalVar.xTimestamps[i].getTime()].SoC = 0;
                                    resultForCSV[$scope.s4gLocalVar.SoCLabel] = 0;
                                }
                                headerCSV.push([$scope.s4gLocalVar.SoCLabel]);
                            }
                            finalResultsForCSV.push(resultForCSV);
                        }


                        var results = {"results": result}
                        //create data structure
                        $scope.s4gLocalVar.dataToSend = results;
                        if ($scope.s4gLocalVar.exportFormat == "JSON") {
                            //dataToSend[$scope.typeResult+"Results"] = variableToDownload;
                            //create a link to download data, click on it and then remove it
                            var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.s4gLocalVar.dataToSend));
                            var downloader = document.createElement('a');
                            downloader.href = data;
                            downloader.style = "visibility:hidden";
                            downloader.download = "ResidentialGUIExport_cons.json";
                            document.body.appendChild(downloader);
                            downloader.click();
                            document.body.removeChild(downloader);
                        }                                       //'{ name: "John Smith" }'

                        if ($scope.s4gLocalVar.exportFormat == "CSV") {
                            var stringifiedHeader = JSON.stringify(headerCSV);
                            stringifiedHeader = stringifiedHeader.replace(/["]/g, "'");

                            var option = {
                                header: true,
                                columns: stringifiedHeader //or array of strings
                            }
                            var parsedCSVData = Papa.unparse(finalResultsForCSV, option);
                            var csvData = new Blob([parsedCSVData], {type: 'text/csv;charset=utf-8;'});
                            var csvURL =  null;
                            if (navigator.msSaveBlob) {
                                csvURL = navigator.msSaveBlob(csvData, 'ResidentialGUIExport_cons.csv');
                            } else {
                                csvURL = window.URL.createObjectURL(csvData);
                            }

                            var downloader = document.createElement('a');
                            downloader.href = csvURL;
                            downloader.style = "visibility:hidden";
                            downloader.download = "ResidentialGUIExport_cons.csv";
                            document.body.appendChild(downloader);
                            downloader.click();
                            document.body.removeChild(downloader);
                        }

                    }
                    else {
                        if (atLeastOne) {
                            alert("We cannot export the data! The following variables are not yet ready (sent request to the server to get them but a reply was not yet received): " + JSON.stringify(listOfNotYetAvailable));
                        }
                        else
                        {
                            alert("Please select at least one variable");
                        }
                    }
                }

                var correctArrayWithDates = function (timestamps,values) {
                    if (timestamps != null && timestamps != [] && typeof timestamps == 'object' && timestamps.length > 0 && values != null && values != [] && typeof values == 'object' && values.length > 0) {
                        return values.map(function (num, idx) {
                            if (((new Date(timestamps[idx])).getTime()>=(new Date('2017-09-27T00:00:00')) && (new Date(timestamps[idx])).getTime()<=(new Date('2019-03-27T23:59:59'))))
                                return -num;
                            else
                                return num;
                        });
                    } else {
                        return [];
                    }
                }

                $scope.s4gLocalVar.calculateConsumptionDirect = function(P_PV, NegativeConsumptionBattery, NegativeOverProduction) {
                    //$scope.s4gLocalVar.allVar['ConsumptionDirect'] = absArray(sumArrays(sumArrays($scope.s4gLocalVar.allVar['P_PV'], $scope.s4gLocalVar.allVar['NegativeConsumptionBattery']), $scope.s4gLocalVar.allVar['NegativeOverProduction']));
                    if (P_PV != null && typeof P_PV == 'object' && NegativeConsumptionBattery != null && typeof NegativeConsumptionBattery == 'object' && NegativeOverProduction != null && typeof NegativeOverProduction == 'object' ) {
                        var leadingArray = [];
                        if (P_PV.length > 0)
                        {
                            leadingArray = P_PV;
                        }
                        else
                        {
                            if (NegativeConsumptionBattery.length > 0)
                            {
                                leadingArray = NegativeConsumptionBattery;
                            }
                            else
                            {
                                if (NegativeOverProduction.length > 0)
                                {
                                    leadingArray = NegativeOverProduction;
                                }
                            }
                        }
                        if (leadingArray.length > 0) {
                            return leadingArray.map(function (num, idx) {
                                var temp_P_PV = 0;
                                if (P_PV.length>idx)
                                {
                                    temp_P_PV = P_PV[idx];
                                }
                                var temp_NegativeConsumptionBattery = 0;
                                if (NegativeConsumptionBattery.length>idx)
                                {
                                    temp_NegativeConsumptionBattery = NegativeConsumptionBattery[idx];
                                }
                                var temp_NegativeOverProduction = 0;
                                if (NegativeOverProduction.length>idx)
                                {
                                    temp_NegativeOverProduction = NegativeOverProduction[idx];
                                }
                                var consumptionDirect = temp_P_PV + temp_NegativeConsumptionBattery + temp_NegativeOverProduction;
                                if (consumptionDirect<0)
                                {
                                    consumptionDirect = temp_P_PV + temp_NegativeConsumptionBattery;
                                }
                                return Math.abs(consumptionDirect);
                            });
                        }
                        else
                        {
                            return [];
                        }
                    } else {
                        return [];
                    }

                }
                $scope.s4gLocalVar.calculateProduction = function(P_PV, NegativeOverProduction) {
                    //$scope.s4gLocalVar.allVar['ConsumptionDirect'] = absArray(sumArrays(sumArrays($scope.s4gLocalVar.allVar['P_PV'], $scope.s4gLocalVar.allVar['NegativeConsumptionBattery']), $scope.s4gLocalVar.allVar['NegativeOverProduction']));
                    if (P_PV != null && typeof P_PV == 'object' && NegativeOverProduction != null && typeof NegativeOverProduction == 'object' ) {
                        var leadingArray = [];
                        if (P_PV.length > 0)
                        {
                            leadingArray = P_PV;
                        }
                        else
                        {
                            if (NegativeOverProduction.length > 0)
                            {
                                leadingArray = NegativeOverProduction;
                            }
                        }
                        if (leadingArray.length > 0) {
                            return leadingArray.map(function (num, idx) {
                                var temp_P_PV = 0;
                                if (P_PV.length>idx)
                                {
                                    temp_P_PV = P_PV[idx];
                                }
                                var temp_NegativeOverProduction = 0;
                                if (NegativeOverProduction.length>idx)
                                {
                                    temp_NegativeOverProduction = NegativeOverProduction[idx];
                                }
                                var production = temp_P_PV + temp_NegativeOverProduction;
                                if (production<0)
                                {
                                    production = temp_P_PV;
                                }
                                return Math.abs(production);
                            });
                        }
                        else
                        {
                            return [];
                        }
                    } else {
                        return [];
                    }

                }

                $scope.getArray = [{a: 1, b:2}, {a:3, b:4}];
            }]);


// define the switch component
consumptionModule.directive('consumptionModule', function () {
    return {
        scope: true,
        bindToController: {
            dashData: '=',
            onUpdate: '&',
            startDate: '=',
            endDate: "=",
            s4gLocalVar: "="
        },
        controller: consumptionController,
        controllerAs: 'ctrl'

    }
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function consumptionController($scope, $element, $attrs) {
    // sensor = $attrs.dashLabel;

}



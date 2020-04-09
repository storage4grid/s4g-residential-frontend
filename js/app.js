'use strict';
// Initialize the Firebase SDK

//TODO insert your information in all the <ADD_YOUR_DATA> field
var config = {
    apiKey: "<ADD_YOUR_DATA>",
    authDomain: "<ADD_YOUR_DATA>",
    databaseURL: "<ADD_YOUR_DATA>",
    projectId: "<ADD_YOUR_DATA>",
    storageBucket: "<ADD_YOUR_DATA>",
    messagingSenderId: "<ADD_YOUR_DATA>"
};
firebase.initializeApp(config);

/*
 * Host angular app, in the long term this will just contain a list of modules
 * on which the app depends, i.e., of widgets used by the app.
 */

var app = angular.module('app', [ 'ngRoute', 'dashNavigation', 'dashFooter',
		'dashHistoricTimeSeries', 'loginView', 'signupView','forgotPassView','authentication', 'homeModule', 'angularPaho', 'mqttIsmb',
		'angularjs-gauge', 'dashBatteryOnlyStatus', 'dashCarBatteryOnlyStatus', 'dashSystemHealth', 'emailUpdatesModule',
		'accountModule', 'productionModule', 'consumptionModule', 'dashNewTemplateWidget',
        'creditsModule', 'systemInfoModule', 'dashSystemInfoWidget']);

// declare the routes for showing the views
app.config(['$locationProvider',  '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

/*
    $rootScope.localbackendURL = "http://"+$rootScope.localServerDomain+":8888";
    $rootScope.localOpModURL = "http://"+$rootScope.localServerDomain+":18081";

 */

    $routeProvider.when('/home', {
		templateUrl : 'views/home.html',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
	});
    $routeProvider.when('/systemInfo', {
        templateUrl : 'views/systemInfo.html',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
    });
    $routeProvider.when('/credits', {
        templateUrl : 'views/credits.html',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
    });
    $routeProvider.when('/account', {
        templateUrl : 'views/account.html',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
    });
    /*
    $routeProvider.when('/emailUpdates', {
        templateUrl : 'views/emailUpdates.html',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
    });
     */
    $routeProvider.when('/dataAnalysis/production', {
        templateUrl : 'views/production.html',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
    });
    $routeProvider.when('/dataAnalysis/consumption', {
        templateUrl : 'views/consumption.html',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
    });
    $routeProvider.when('/forgotPass', {
        templateUrl : 'views/forgotPass.html',
        controller: 'ForgotPassCtrl'
    });
    $routeProvider.when('/signup', {
        templateUrl : 'views/signup.html',
        controller: 'SignupCtrl'
    });
	$routeProvider.otherwise({
		redirectTo : '/loginView'
	});
} ]);


app.run(["$rootScope", "$location", "$interval", "MqttFactory", function($rootScope, $location, $interval, MqttFactory) {
    $rootScope.s4gVar = {};
    $rootScope.s4gVar.currentPositionPage = "home";
    $rootScope.s4gVar.currentView = "Home"

    $rootScope.justSignedup = false;

    $rootScope.s4gVar.domainName = window.location.hostname;
    $rootScope.s4gVar.mqttTopicAgg = 'RESIDENTIAL/AGGREGATED';
    $rootScope.s4gVar.mqttTopicGUI = 'RESIDENTIAL/GUI';
    $rootScope.s4gVar.mqttTopicFronius = 'FRONIUS/RESIDENTIAL/GUI';
    $rootScope.s4gVar.lastNowESS = new Date();
    $rootScope.s4gVar.lastNowPV = new Date();


    //$rootScope.s4gVar.demoEnabled = false;
    $rootScope.s4gVar.demoEnabled = true;
    $rootScope.s4gVar.installationHouse = "Bolzano";
    //$rootScope.s4gVar.installationHouse = "27";

    if (!$rootScope.s4gVar.demoEnabled)
    {
        //demo NOT Enabled

        $rootScope.s4gVar.backendURL = '<ADD_YOUR_DATA>';  
        $rootScope.s4gVar.mqttBrokerIp = '<ADD_YOUR_DATA>';  
        $rootScope.s4gVar.mqttBrokerPort = '<ADD_YOUR_DATA>';

        $rootScope.s4gVar.maxTimeForStatusPV = 20;
        $rootScope.s4gVar.maxTimeForStatusESS = 20;

        $rootScope.s4gVar.edynaP_EV = 'S4G-GW-EDYNA-0014';
        $rootScope.s4gVar.edynaP_PV = 'S4G-GW-EDYNA-0015';
        $rootScope.s4gVar.edynaP_ESS = 'S4G-GW-EDYNA-0016';
        $rootScope.s4gVar.edynaPLoad = 'S4G-GW-EDYNA-0017';
        $rootScope.s4gVar.installation = "InstallationHouse"+$rootScope.s4gVar.installationHouse;


        $rootScope.s4gVar.field = {};
        $rootScope.s4gVar.field.EV = {};
        $rootScope.s4gVar.field.EV.pathEnergy=$rootScope.s4gVar.edynaP_EV;
        $rootScope.s4gVar.field.EV.pathP=$rootScope.s4gVar.edynaP_EV+"/P";
        $rootScope.s4gVar.field.PV = {};
        $rootScope.s4gVar.field.PV.pathEnergy=$rootScope.s4gVar.edynaP_PV;
        $rootScope.s4gVar.field.PV.pathP=$rootScope.s4gVar.edynaP_PV+"/P";
        $rootScope.s4gVar.field.ESS = {};
        $rootScope.s4gVar.field.ESS.pathEnergy=$rootScope.s4gVar.edynaP_ESS;
        $rootScope.s4gVar.field.ESS.pathEnergyPositive=$rootScope.s4gVar.edynaP_ESS;
        $rootScope.s4gVar.field.ESS.pathEnergyNegative=$rootScope.s4gVar.edynaP_ESS;
        $rootScope.s4gVar.field.ESS.pathP=$rootScope.s4gVar.edynaP_ESS+"/P";
        $rootScope.s4gVar.field.PLoad = {};
        $rootScope.s4gVar.field.PLoad.pathEnergy=$rootScope.s4gVar.edynaPLoad;
        $rootScope.s4gVar.field.PLoad.pathP=$rootScope.s4gVar.edynaPLoad+"/P";
        $rootScope.s4gVar.field.PAkku = {};
        $rootScope.s4gVar.field.PAkku.pathEnergy="";
        $rootScope.s4gVar.field.PAkku.pathP="";
        $rootScope.s4gVar.field.PGrid = {};
        $rootScope.s4gVar.field.PGrid.pathEnergy="";
        $rootScope.s4gVar.field.PGrid.pathP="";
        $rootScope.s4gVar.field.PGridNeg = {};
        $rootScope.s4gVar.field.PGridNeg.pathEnergy="";
        $rootScope.s4gVar.field.PGridNeg.pathP="";
        // http://130.192.86.142:11111/Battery/realcycles/InstallationHouseBolzano
        $rootScope.s4gVar.field.batteryCycles="Battery/realcycles/"+$rootScope.s4gVar.installation;

    }
    else
    {
        //demoEnabled

        $rootScope.s4gVar.backendURL = '<ADD_YOUR_DATA>';  
        $rootScope.s4gVar.mqttBrokerIp = '<ADD_YOUR_DATA>';  
        $rootScope.s4gVar.mqttBrokerPort = '<ADD_YOUR_DATA>';

        $rootScope.s4gVar.maxTimeForStatusPV = 40;
        $rootScope.s4gVar.maxTimeForStatusESS = 40;

        $rootScope.s4gVar.installation = "InstallationHouse"+$rootScope.s4gVar.installationHouse;


        $rootScope.s4gVar.field = {};
        $rootScope.s4gVar.field.EV = {};
        $rootScope.s4gVar.field.EV.pathEnergy=$rootScope.s4gVar.installation+"/EV-Load/ALL";
        $rootScope.s4gVar.field.EV.pathP=$rootScope.s4gVar.installation+"/EV-Load";
        $rootScope.s4gVar.field.PV = {};
        $rootScope.s4gVar.field.PV.pathEnergy=$rootScope.s4gVar.installation+"/photovoltaic/ALL";
        $rootScope.s4gVar.field.PV.pathP=$rootScope.s4gVar.installation+"/photovoltaic";
        $rootScope.s4gVar.field.ESS = {};
        $rootScope.s4gVar.field.ESS.pathEnergy=$rootScope.s4gVar.installation+"/battery/ALL";
        $rootScope.s4gVar.field.ESS.pathEnergyPositive=$rootScope.s4gVar.installation+"/battery/POSITIVE";
        $rootScope.s4gVar.field.ESS.pathEnergyNegative=$rootScope.s4gVar.installation+"/battery/NEGATIVE";
        $rootScope.s4gVar.field.ESS.pathP=$rootScope.s4gVar.installation+"/battery";
        $rootScope.s4gVar.field.PLoad = {};
        $rootScope.s4gVar.field.PLoad.pathEnergy=$rootScope.s4gVar.installation+"/load/ALL";
        $rootScope.s4gVar.field.PLoad.pathP=$rootScope.s4gVar.installation+"/load";
        $rootScope.s4gVar.field.PAkku = {};
        $rootScope.s4gVar.field.PAkku.pathEnergy=$rootScope.s4gVar.installation+"/battery/ALL";
        $rootScope.s4gVar.field.PAkku.pathP=$rootScope.s4gVar.installation+"/battery";
        $rootScope.s4gVar.field.PGrid = {};
        $rootScope.s4gVar.field.PGrid.pathEnergy=$rootScope.s4gVar.installation+"/grid/POSITIVE";
        $rootScope.s4gVar.field.PGrid.pathP=$rootScope.s4gVar.installation+"/grid/POSITIVE/GROUPBY/1";
        $rootScope.s4gVar.field.PGridNeg = {};
        $rootScope.s4gVar.field.PGridNeg.pathEnergy=$rootScope.s4gVar.installation+"/grid/NEGATIVE";
        $rootScope.s4gVar.field.PGridNeg.pathP=$rootScope.s4gVar.installation+"/grid/NEGATIVE/GROUPBY/1";

        // http://130.192.86.142:11111/Battery/realcycles/InstallationHouseBolzano
        $rootScope.s4gVar.field.batteryCycles="/Battery/realcycles/"+$rootScope.s4gVar.installation;
    }

    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/loginView");
        }
        else
		{
            $location.path("/home");
		}
        //let Angular know that things have changed
        $rootScope.$apply();
    });

    $rootScope.mqttFieldToUpdate = {};
    $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg] = {};
    $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicGUI] = {};
    $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicFronius] = {};
    $rootScope.availableSensorsWithType = {};


    $rootScope.currentPositionPage = "home";
    $rootScope.s4gVar.currentPVSystem1Status = 'Offline';
    $rootScope.s4gVar.currentStorage1Status = 'Offline';
    $rootScope.s4gVar.currentEV1Status = 'Offline';
    $rootScope.s4gVar.currentBatteryStatusStorage1 = 'Offline';
    $rootScope.s4gVar.currentBatteryStatusStorage2 = 'Offline';
    $rootScope.s4gVar.currentCarStatus1 = 'Offline';
    $rootScope.s4gVar.currentCarStatus2 = 'Offline';
    $rootScope.s4gVar.currentPV = 0;
    $rootScope.s4gVar.currentESS = 0;
    $rootScope.s4gVar.currentEV = 0;
    $rootScope.s4gVar.currentSMM = 0;
    $rootScope.s4gVar.fronius = {};
    $rootScope.s4gVar.fronius.CurrentBatteryStatus = "Charging";
    $rootScope.s4gVar.fronius.CurrentBatteryStateOfCharge = 0;

    $rootScope.s4gVar.currentFroPGrid = 0;
    $rootScope.s4gVar.currentFroPLoad = 0;
    $rootScope.s4gVar.currentFroPAkku = 0;
    $rootScope.s4gVar.currentFroPPV = 0;
    $rootScope.s4gVar.currentFroSOC = 0;
    $rootScope.s4gVar.lastTimestampPV = (new Date(2018, 0, 1, 0, 0, 0, 0)).getTime(); // Start of 2018.
    $rootScope.s4gVar.lastTimestampESS = (new Date(2018, 0, 1, 0, 0, 0, 0)).getTime(); // Start of 2018.

    $rootScope.s4gVar.currentConsumption = 0;
    $rootScope.s4gVar.currentConsumptionFromGrid = 0;
    $rootScope.s4gVar.currentPowerToGrid = 0
    $rootScope.s4gVar.currentConsumptionSelf = 0;

    $rootScope.s4gVar.currentSelfProduced_final = 0;
    $rootScope.s4gVar.currentSelfConsumed_final = 0;
    $rootScope.s4gVar.currentFromGrid_final = 0;
    $rootScope.s4gVar.currentToGrid = 0;


    $rootScope.s4gVar.diff_seconds = function (dt2, dt1) {

        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        //diff /= 60;
        return Math.abs(Math.round(diff));

    }

    //function to be called every 10 seconds to update all the variables due to info received through MQTT
    $rootScope.s4gVar.updateStatuses = function () {
        //if PV is received in the last 20 seconds, everything is ok, otherwise: offline
        var now = new Date();

        var lastDateTimePV = new Date($rootScope.s4gVar.lastTimestampPV/1000000);
        if ($rootScope.s4gVar.diff_seconds( now, $rootScope.s4gVar.lastNowPV) > $rootScope.s4gVar.maxTimeForStatusPV) {
            $rootScope.s4gVar.currentPVSystem1Status = 'Offline';
        }
        else {
            if ($rootScope.s4gVar.diff_seconds(now, lastDateTimePV) > $rootScope.s4gVar.maxTimeForStatusPV) {
                $rootScope.s4gVar.currentPVSystem1Status = 'Warning';
            } else {
                //TODO: manage Warning and Failure message
                $rootScope.s4gVar.currentPVSystem1Status = 'OK';
            }
        }

        //if ESS is received in the last 20 seconds, everything is ok, otherwise: offline
        var lastDateTimeESS = new Date($rootScope.s4gVar.lastTimestampESS/1000000);

        if ($rootScope.s4gVar.diff_seconds(now, $rootScope.s4gVar.lastNowESS) > $rootScope.s4gVar.maxTimeForStatusESS) {
            $rootScope.s4gVar.currentStorage1Status = 'Offline';
        } else {
            if ($rootScope.s4gVar.diff_seconds(now, lastDateTimeESS) > $rootScope.s4gVar.maxTimeForStatusESS) {
                $rootScope.s4gVar.currentStorage1Status = 'Warning';
            } else {
                //TODO: manage Warning and Failure message
                $rootScope.s4gVar.currentStorage1Status = 'OK';
            }
        }
    }

    //function to be called when a new MQTT data arrives
    $rootScope.s4gVar.mqttOnMessageArrived = function (message) {
        var topic = message.destinationName;
        //console.log("onMessageArrived - :"+topic+" - "+message.payloadString);
        /*
        message sample
        <topic> AGGREGATED <dataFrom1>; <dataFrom2>; <dataFrom3>; <dataFrom...> <timestamp>
        RESIDENTIAL/AGGREGATED AGGREGATED Processed_Q2=0.0,I1=0.0,Processed_Q3=0.0,I2=0.0,Processed_P1=0.0,Processed_I3=0.0,f=49.900000000000006,K2=2.0,Rm=22950.0,P=6,Q=0,P1=0,Rp=0.0,Processed_P3=6.0,Q3=0,K1=2.0,U2=240.4,Am=0.0,K3=1.0,U3=226.10000000000002,Ap=415211.10000000003,Processed_P=6.0,Processed_I2=0.0,NumPayloadsPub=300025,Processed_P2=0.0,Processed_Q=0.0,Q1=0,Processed_Q1=0.0,I3=0.0,U1=227.3,P2=0,Processed_I1=0.0,P3=6,Q2=0,Type=2; Processed_Q2=0.0,I1=4.91,Processed_Q3=26.0,I2=4.8500000000000005,Processed_P1=-1114.0,Processed_I3=4.83,f=50.0,K2=-1.0,Rm=8350.4,P=3374,Q=4,P1=1114,Rp=12828.6,Processed_P3=-1093.0,Q3=26,K1=-0.99,U2=240.20000000000002,Am=3218549.0,K3=-0.99,U3=226.0,Ap=2564471.4000000004,Processed_P=-3373.0,Processed_I2=4.8500000000000005,NumPayloadsPub=300019,Processed_P2=-1166.0,Processed_Q=48.0,Q1=22,Processed_Q1=22.0,I3=4.83,U1=227.3,P2=1166,Processed_I1=4.91,P3=1093,Q2=0,Type=3; Processed_Q2=80.0,I1=8.47,Processed_Q3=0.0,I2=8.15,Processed_P1=-1927.0,Processed_I3=0.0,f=50.0,K2=-0.99,Rm=1315307.1,P=3893,Q=135,P1=1927,Rp=47970.3,Processed_P3=0.0,Q3=0,K1=-0.99,U2=240.8,Am=1.1743763200000001E7,K3=2.0,U3=226.10000000000002,Ap=14688.900000000001,Processed_P=-3892.0,Processed_I2=8.15,NumPayloadsPub=299944,Processed_P2=-1965.0,Processed_Q=133.0,Q1=53,Processed_Q1=53.0,I3=0.0,U1=227.8,P2=1965,Processed_I1=8.47,P3=0,Q2=80,Type=1; Processed_Q2=130.0,I1=0.56,Processed_Q3=95.0,I2=1.3900000000000001,Processed_P1=89.0,Processed_I3=0.85,f=50.0,K2=0.88,Rm=1084822.7,P=486,Q=225,P1=89,Rp=230531.0,Processed_P3=149.0,Q3=95,K1=1.0,U2=240.5,Am=0.0,K3=0.84,U3=226.4,Ap=9967593.0,Processed_P=485.0,Processed_I2=1.3900000000000001,NumPayloadsPub=299658,Processed_P2=247.0,Processed_Q=225.0,Q1=0,Processed_Q1=0.0,I3=0.85,U1=227.4,P2=247,Processed_I1=0.56,P3=149,Q2=130,Type=0 1559289478000000000

         */
        if (topic.includes($rootScope.s4gVar.mqttTopicAgg)) {
            //SENSOR_ID KEY1=Value1,KEY2=value2,...,KEYn=valuen timestamp
            var parts = message.payloadString.split(" ");
            var sensorId = parts[0];
            var timestamp = parts[parts.length-1];
            var numDataGroups = (parts.length - 1);

            //avoid to read the first, second and the last part (containing the topic, AGGREGATED and the timestamp)

            for (var indexDataGroup = 1; indexDataGroup < numDataGroups-1; indexDataGroup++) {
                var data = parts[indexDataGroup];

                var dataParts = data.split(",");
                var dataTypeString = dataParts[dataParts.length - 1];
                var dataTypeParts = dataTypeString.split("=");
                var dataType = '';
                var dataTypeNum = '';
                var dataTypeLabel = '';
                if (dataTypeParts.length == 2) {
                    dataTypeLabel = dataTypeParts[0];
                    dataTypeNum = dataTypeParts[1];
                    dataTypeNum = dataTypeNum.replace(';', '');
                }
                if (dataTypeLabel.toLowerCase() == 'type' && dataTypeNum != '' && !isNaN(dataTypeNum)) {
                    switch (dataTypeNum) {
                        case "0":
                            dataType = 'SMM';
                            break;
                        case "1":
                            dataType = 'PV';
                            break;
                        case "2":
                            dataType = 'EV';
                            break;
                        case "3":
                            dataType = 'ESS';
                            break;
                        case "7":
                            dataType = 'Fronius';
                            break;
                        default:
                            dataType = '';
                    }

                    var mqttSensorType = dataType;

                    var tempP = 0;
                    var tempFroPGrid = 0;
                    var tempFroPLoad = 0;
                    var tempFroPAkku = 0;
                    var tempFroPPV = 0;
                    var tempFroSOC = 0;
                    for (var i = 0; i < dataParts.length; i++) {
                        //for (var singleData in dataParts) {
                        var singleData = dataParts[i];
                        var singleDataParts = singleData.split("=");
                        var key = singleDataParts[0];
                        var receivedValue = singleDataParts[1];
                        if ($rootScope.mqttFieldToUpdate.hasOwnProperty($rootScope.s4gVar.mqttTopicAgg)) {
                            //sensorId = EDYNA-0013
                            if (dataType != '') {

                                $rootScope.availableSensorsWithType[sensorId] = dataType;
                                if ($rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg].hasOwnProperty(mqttSensorType)) {
                                    //if ($rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg][mqttSensorType].hasOwnProperty(key))
                                    //{
                                    $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg][mqttSensorType][key] = receivedValue;
                                    //}
                                } else {
                                    //check if there is one field with multiple sensor types
                                    var foundOne = false;
                                    for (var singleType in $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg]) {
                                        if (singleType.includes(mqttSensorType)) {
                                            $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg][singleType][key] = receivedValue;
                                            foundOne = true;
                                        }
                                    }
                                    if (!foundOne)
                                    {
                                        $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg][mqttSensorType] = {};
                                        $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicAgg][mqttSensorType][key] = receivedValue;
                                    }
                                }
                            }
                        }
                        if (key == 'Processed_P') {
                            tempP = parseInt(receivedValue, 10);
                        }

                        switch (dataTypeNum) {
                            case "0":
                                //dataType = 'SMM';
                                //Type = 0
                                $rootScope.s4gVar.currentSMM = tempP;
                                tempFroPLoad = parseInt(receivedValue, 10);
                                //TODO controlla se questo corrisponde a PLoad o a Pgrid
                                $rootScope.s4gVar.currentFroPLoad = tempFroPLoad;
                                break;
                            case "1":
                                //dataType = 'PV';
                                //Type = 1
                                $rootScope.s4gVar.currentPV = tempP;
                                tempFroPPV = parseInt(receivedValue, 10);
                                $rootScope.s4gVar.currentFroPPV = tempFroPPV;
                                break;
                            case "2":
                                //dataType = 'EV';
                                $rootScope.s4gVar.currentEV = tempP;
                                break;
                            case "3":
                                //dataType = 'ESS';
                                //P-Akku
                                //Type = 3
                                $rootScope.s4gVar.currentESS = tempP;
                                tempFroPAkku = parseInt(receivedValue, 10);
                                $rootScope.s4gVar.currentFroPAkku = tempFroPAkku;
                                break;
                            case "7":
                                //dataType = 'Fronius';
                                break;
                            default:
                                dataType = '';
                        }
                        break;

                        //TODO da dove prendiamo Fronius P-Grid?

                    }
                    /*
                    if (mqttSensorType.includes('Fronius')) {
                        $rootScope.s4gVar.currentFroPGrid = tempFroPGrid;
                        $rootScope.s4gVar.currentFroPLoad = tempFroPLoad;
                        $rootScope.s4gVar.currentFroPAkku = tempFroPAkku;
                        $rootScope.s4gVar.currentFroPPV = tempFroPPV;
                        $rootScope.s4gVar.currentFroSOC = tempFroSOC;
                    }
                    */
                }
            }
            $rootScope.s4gVar.updateIndConsProd();
        }


        else if (topic.includes($rootScope.s4gVar.mqttTopicFronius))
        {
            //FRONIUS/Data/v1.0/Datastreams(136)/Observations Payload [125] -> InstallationHouse27 ESS-status="CHARGING",SOC=73.0,P-Akku=-2491.8,P-Grid=-93.88,P-Load=153.12,P-PV=2758.1 1570528518452000000

            var parts = message.payloadString.split(" ");
            var localInstallationHouse = parts[0];
            //process data only if they are related to the right installation House
            if (("InstallationHouse"+$rootScope.s4gVar.installationHouse)==localInstallationHouse) {
                var timestamp = parts[parts.length - 1];
                var numDataGroups = (parts.length - 1);

                //avoid to read the first, second and the last part (containing the topic, GUI and the timestamp)

                for (var indexDataGroup = 1; indexDataGroup < numDataGroups; indexDataGroup++) {
                    var data = parts[indexDataGroup];

                    var dataParts = data.split(",");

                    for (var i = 0; i < dataParts.length; i++) {
                        //for (var singleData in dataParts) {
                        var singleData = dataParts[i];
                        var singleDataParts = singleData.split("=");
                        var key = singleDataParts[0];
                        var receivedValue = singleDataParts[1];

                        //remove quotes and double quotes
                        // ['"] is a character class, matches both single and double quotes. you can replace this with " to only match double quotes.
                        // +: one or more quotes, chars, as defined by the preceding char-class (optional)
                        // g: the global flag. This tells JS to apply the regex to the entire string. If you omit this, you'll only replace a single char.
                        receivedValue = receivedValue.replace(/['"]+/g, '');

                        if ($rootScope.mqttFieldToUpdate.hasOwnProperty($rootScope.s4gVar.mqttTopicFronius)) {

                            if ($rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicFronius].hasOwnProperty(localInstallationHouse)) {
                                //if ($rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicGUI][mqttSensorType].hasOwnProperty(key))
                                //{
                                $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicFronius][localInstallationHouse][key] = receivedValue;
                                //}
                            } else {
                                //check if there is one field with multiple installations
                                for (var singleInstallation in $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicFronius]) {
                                    if (singleInstallation.includes(localInstallationHouse)) {
                                        $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicFronius][localInstallationHouse][key] = receivedValue;
                                    }
                                }
                            }
                        }
                        if (key.includes("ESS-status")) {
                            $rootScope.s4gVar.fronius.CurrentBatteryStatus = receivedValue;
                        }
                        if (key.includes("SOC")) {
                            $rootScope.s4gVar.fronius.CurrentBatteryStateOfCharge = receivedValue;
                        }
                        if (key.includes("EV-Load")) {
                            $rootScope.s4gVar.currentEV = receivedValue;
                        }
                        if ($rootScope.s4gVar.demoEnabled) {
                            //elaborate also ESS-status="EMPTY",SOC=7.0,P-Akku=-2491.8,P-Grid=-93.88,P-Load=153.12,P-PV=2758.1
                            if (key.includes("P-Akku")) {
                                $rootScope.s4gVar.currentESS = Number(receivedValue);
                                $rootScope.s4gVar.currentFroPAkku = Number(receivedValue);
                                $rootScope.s4gVar.lastNowESS = new Date();
                                $rootScope.s4gVar.lastTimestampESS = timestamp;
                            }
                            if (key.includes("P-Grid")) {
                                $rootScope.s4gVar.currentFroPGrid = Number(receivedValue);
                            }
                            if (key.includes("P-Load")) {
                                $rootScope.s4gVar.currentSMM = Number(receivedValue);
                                $rootScope.s4gVar.currentFroPLoad = Number(receivedValue);
                            }
                            if (key.includes("P-PV")) {
                                $rootScope.s4gVar.currentPV = Number(receivedValue);
                                $rootScope.s4gVar.currentFroPPV = Number(receivedValue);
                                $rootScope.s4gVar.lastNowPV = new Date();
                                $rootScope.s4gVar.lastTimestampPV = timestamp;
                            }
                            if (key.includes("SOC")) {
                                $rootScope.s4gVar.currentFroSOC = Number(receivedValue);
                            }
                            if (key.includes("ESS-status")) {
                                $rootScope.s4gVar.CurrentBatteryStatus = receivedValue;
                            }
                            if (key.includes("EV-Load")) {
                                $rootScope.s4gVar.currentEV = receivedValue;
                            }
                        }
                    }
                }
            }
            $rootScope.s4gVar.updateIndConsProd();
        }
        else if (topic.includes($rootScope.s4gVar.mqttTopicGUI)) {
            //SENSOR_ID KEY1=Value1,KEY2=value2,...,KEYn=valuen timestamp
            var parts = message.payloadString.split(" ");
            var sensorId = parts[0];
            var timestamp = parts[parts.length-1];
            var numDataGroups = (parts.length - 1);

            //avoid to read the first, second and the last part (containing the topic, GUI and the timestamp)

            for (var indexDataGroup = 0; indexDataGroup <= numDataGroups; indexDataGroup++) {
                var data = parts[indexDataGroup];

                var dataParts = data.split(",");
                var dataTypeString = dataParts[dataParts.length - 1];
                var dataTypeParts = dataTypeString.split("=");
                var dataType = '';
                var dataTypeNum = '';
                var dataTypeLabel = '';
                if (dataTypeParts.length == 2) {
                    dataTypeLabel = dataTypeParts[0];
                    dataTypeNum = dataTypeParts[1];
                    dataTypeNum = dataTypeNum.replace(';', '');
                }
                if (dataTypeLabel.toLowerCase() == 'type' && dataTypeNum != '' && !isNaN(dataTypeNum)) {
                    switch (dataTypeNum) {
                        case "0":
                            dataType = 'SMM';
                            break;
                        case "1":
                            dataType = 'PV';
                            break;
                        case "2":
                            dataType = 'EV';
                            break;
                        case "3":
                            dataType = 'ESS';
                            break;
                        case "7":
                            dataType = 'Fronius';
                            break;
                        default:
                            dataType = '';
                    }

                    var mqttSensorType = dataType;

                    var tempP = 0;
                    var tempFroPGrid = 0;
                    var tempFroPLoad = 0;
                    var tempFroPAkku = 0;
                    var tempFroPPV = 0;
                    var tempFroSOC = 0;
                    for (var i = 0; i < dataParts.length; i++) {
                        //for (var singleData in dataParts) {
                        var singleData = dataParts[i];
                        var singleDataParts = singleData.split("=");
                        var key = singleDataParts[0];
                        var receivedValue = singleDataParts[1];
                        if ($rootScope.mqttFieldToUpdate.hasOwnProperty($rootScope.s4gVar.mqttTopicGUI)) {

                            //sensorId = EDYNA-0013
                            if (dataType != '') {

                                $rootScope.availableSensorsWithType[sensorId] = dataType;
                                if ($rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicGUI].hasOwnProperty(mqttSensorType)) {
                                    //if ($rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicGUI][mqttSensorType].hasOwnProperty(key))
                                    //{
                                    $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicGUI][mqttSensorType][key] = receivedValue;
                                    //}
                                }
                                else {
                                    //check if there is one field with multiple sensor types
                                    for (var singleType in $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicGUI]) {
                                        if (singleType.includes(mqttSensorType)) {
                                            $rootScope.mqttFieldToUpdate[$rootScope.s4gVar.mqttTopicGUI][singleType][key] = receivedValue;
                                        }
                                    }
                                }
                            }
                        }
                        if (mqttSensorType.includes('PV')) {
                            $rootScope.s4gVar.lastNowPV = new Date();
                            $rootScope.s4gVar.lastTimestampPV = timestamp;
                        }
                        if (mqttSensorType.includes('ESS')) {
                            $rootScope.s4gVar.lastNowESS = new Date();
                            $rootScope.s4gVar.lastTimestampESS = timestamp;
                        }
                    }
                }
            }
            $rootScope.s4gVar.updateIndConsProd();
        }
        //update the status
        $rootScope.s4gVar.updateStatuses();
    }

    //update the values of all the inferred variables
    $rootScope.s4gVar.updateIndConsProd = function () {


        var P_ESS_positive = ($rootScope.s4gVar.currentESS>0)?$rootScope.s4gVar.currentESS:0;
        var P_ESS_negative = ($rootScope.s4gVar.currentESS<0)?Math.abs($rootScope.s4gVar.currentESS):0;
        var currentFroPGridPos = ($rootScope.s4gVar.currentFroPGrid>0)?$rootScope.s4gVar.currentFroPGrid:0;
        var currentFroPGridNeg = ($rootScope.s4gVar.currentFroPGrid<0)?$rootScope.s4gVar.currentFroPGrid:0;
        $rootScope.s4gVar.currentSelfProduced_final = Math.round((($rootScope.s4gVar.currentPV + P_ESS_positive)/1000)*100)/100;
        $rootScope.s4gVar.currentSelfConsumed_final = Math.round(((P_ESS_negative + $rootScope.s4gVar.currentFroPLoad + Number($rootScope.s4gVar.currentEV))/1000)*100)/100;
        $rootScope.s4gVar.currentFromGrid_final = Math.round((currentFroPGridPos/1000)*100)/100;
        $rootScope.s4gVar.currentToGrid = Math.abs(Math.round((currentFroPGridNeg/1000)*100)/100);

        if ($rootScope.s4gVar.currentFroPAkku<0)
        {
            $rootScope.s4gVar.currentConsumption = Number($rootScope.s4gVar.currentFroPLoad) + Number($rootScope.s4gVar.currentEV) + Number($rootScope.s4gVar.currentESS);
        }
        else
        {
            $rootScope.s4gVar.currentConsumption = Number($rootScope.s4gVar.currentFroPLoad) + Number($rootScope.s4gVar.currentEV);
        }
        //TODO (sometimes we see a small negative number (-0.07) )
        if ($rootScope.s4gVar.currentFroPGrid>0) {
            $rootScope.s4gVar.currentConsumptionFromGrid = Number($rootScope.s4gVar.currentFroPGrid);
            $rootScope.s4gVar.currentPowerToGrid = Math.abs(0);
        }
        else
        {
            $rootScope.s4gVar.currentConsumptionFromGrid = 0;
            $rootScope.s4gVar.currentPowerToGrid = Math.abs(Number($rootScope.s4gVar.currentFroPGrid));
        }

        if ($rootScope.s4gVar.currentFroPAkku>0)
        {
            $rootScope.s4gVar.currentConsumptionSelf = Number($rootScope.s4gVar.currentPV) + Number($rootScope.s4gVar.currentESS);
        }
        else
        {
            $rootScope.s4gVar.currentConsumptionSelf =  Number($rootScope.s4gVar.currentPV);
        }

        $rootScope.s4gVar.currentConsumption = Math.round(($rootScope.s4gVar.currentConsumption/1000)*100)/100;
        $rootScope.s4gVar.currentConsumptionFromGrid = Math.round(($rootScope.s4gVar.currentConsumptionFromGrid/1000)*100)/100;
        $rootScope.s4gVar.currentPowerToGrid = Math.round(($rootScope.s4gVar.currentPowerToGrid/1000)*100)/100;
        $rootScope.s4gVar.currentConsumptionSelf = Math.round(($rootScope.s4gVar.currentConsumptionSelf/1000)*100)/100;
    }

    //initialize everything to receive updates from MQTT Broker
    var mqttClientIdRandom = "storage4Grid" + UUIDGenerator.prototype.generateUUID();


    if ($rootScope.s4gVar.mqttTopicAgg != null && $rootScope.s4gVar.mqttTopicAgg != undefined && $rootScope.s4gVar.mqttTopicAgg != '') {
        MqttFactory.init($rootScope.s4gVar.mqttBrokerIp, $rootScope.s4gVar.mqttBrokerPort, mqttClientIdRandom);
        MqttFactory.mqttSubscribeToNewTopic($rootScope.s4gVar.mqttTopicAgg, $rootScope.s4gVar.mqttOnMessageArrived);
    }

    if ($rootScope.s4gVar.mqttTopicGUI != null && $rootScope.s4gVar.mqttTopicGUI != undefined && $rootScope.s4gVar.mqttTopicGUI != '') {
        MqttFactory.init($rootScope.s4gVar.mqttBrokerIp, $rootScope.s4gVar.mqttBrokerPort, mqttClientIdRandom);
        MqttFactory.mqttSubscribeToNewTopic($rootScope.s4gVar.mqttTopicGUI, $rootScope.s4gVar.mqttOnMessageArrived);
    }
    //FRONIUS/Data/v1.0/Datastreams(136)/Observations Payload [125] -> InstallationHouse27 ESS-status="CHARGING",SOC=73.0,P-Akku=-2491.8,P-Grid=-93.88,P-Load=153.12,P-PV=2758.1 1570528518452000000
    if ($rootScope.s4gVar.mqttTopicFronius != null && $rootScope.s4gVar.mqttTopicFronius != undefined && $rootScope.s4gVar.mqttTopicFronius != '') {
        MqttFactory.init($rootScope.s4gVar.mqttBrokerIp, $rootScope.s4gVar.mqttBrokerPort, mqttClientIdRandom);
        MqttFactory.mqttSubscribeToNewTopic($rootScope.s4gVar.mqttTopicFronius, $rootScope.s4gVar.mqttOnMessageArrived);
    }

    $rootScope.s4gVar.updateStatuses();
    //set a timer to update all variables every 5 seconds
    var angularInterval = $interval($rootScope.s4gVar.updateStatuses, 5000);


}]);


/*
This is the controller that manages the footer containing the operational mode commands
 */

'use strict';
var dashFooter = angular.module('dashFooter', []);

dashFooter.controller("dashFooterController", ['$scope', '$rootScope', '$firebaseAuth', '$location', '$http' ,function($scope, $rootScope, $firebaseAuth, $location, $http) {

    // knownOpmode = {0:"maximizeSelfConsumption",1:"maximizeSelfProduction",2:"minimizeCosts",3:"MaximizeBatteryHealth",4:"None"}

    $scope.operationModeArray = [false, false, false, false];
    $scope.operationalModeVar = 4;
    $scope.operationalMode = "None";
    $scope.s4gLocalVar = {};
    $scope.s4gLocalVar.sentAlertsFooter = 0;

    /*
    $scope.getOperationalModeBoolean = function(opMode)
    {
        if ($scope.operationalModeVar!=undefined && $scope.operationalModeVar!=null && ($scope.operationalModeVar == opMode || $scope.operationalModeVar == opMode.toString(10))) {
            return true;
        }
        else {
            return false;
        }
    }

     */

    $scope.sendAlertsFooter = function(message)
    {
        if ($scope.s4gLocalVar.sentAlertsFooter<=0) {
            $scope.s4gLocalVar.sentAlertsFooter++;
            alert(message);
        }

    }

    $scope.updateOperationMode = function() {
        // called when $scope.operationalMode changes
        for (var i=0;i<=4;i++)
        {
            if ($scope.operationalModeVar == i || $scope.operationalModeVar == i.toString())
            {
                $scope.operationModeArray[i] = true;
            }
            else
            {
                $scope.operationModeArray[i] = false;
            }
        }
    };


    $scope.changeOperationalMode = function(newOperationalMode)
    {
        var backupOperationalMode = $scope.operationalModeVar;
        //knownOpmode = {0:"maximizeSelfConsumption",1:"maximizeSelfProduction",2:"minimizeCosts",3:"MaximizeBatteryHealth",4:"None"}
        if (newOperationalMode == $scope.operationalModeVar)
        {
            //it means that we have to deselect all the options by pushing 4 as operationalMode ("None")
            newOperationalMode = 4;
        }
        //set the operationalMode with the last received one before receiving actual feedback from the server
        $scope.changeOperationalModeIndicator(newOperationalMode, false, false);
        $http({
            method: 'POST',
            url: $rootScope.s4gVar.backendURL+'/OPMODE',
            data: newOperationalMode,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            //console.log(response.data)
            // this callback will be called asynchronously
            // when the response is available
            $scope.changeOperationalModeIndicator(response.data, true, false);
        }, function errorCallback(response) {
            $scope.changeOperationalModeIndicator(backupOperationalMode, true, false);
            //$scope.updateOperationMode();
            alert("It was not possibile to contact the Profess server to set the NEW Operation Mode");
            //console.log(response)
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        /*
        $http.post($rootScope.s4gVar.backendURL+'/OPMODE',
            newOperationalMode).then(function successCallback(response) {
            //console.log(response.data)
            // this callback will be called asynchronously
            // when the response is available
            $scope.changeOperationalModeIndicator(response.data);
        }, function errorCallback(response) {

            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert("Error in contacting the server: try again");
            //console.log(response)
            //$scope.changeOperationalModeIndicator($scope.operationalModeVar);
        });

         */
    }



    $scope.changeOperationalModeIndicator = function(newOperationalMode, isReceivedByPost, isStartup)
    {
        //if (isReceivedByPost && (!isNaN(newOperationalMode) || !(newOperationalMode.toLowerCase().includes("fail"))))
        //{
        $scope.operationalModeVar = newOperationalMode;
        $scope.s4gLocalVar.sentAlertsFooter = 0;
        //}
        if (isNaN(newOperationalMode) && newOperationalMode.toLowerCase().includes("fail"))
        {
            newOperationalMode = $scope.operationalModeVar;
            if (!isStartup) {
                $scope.sendAlertsFooter("It was not possibile to contact the Profess server to set the NEW Operation Mode");
            }
        }
        switch(newOperationalMode) {
            case '0':
            case 0:
                $scope.operationalMode = 'Maximize self-consumption';
                //console.log($scope.operationalMode);
                break;
            case '1':
            case 1:
                $scope.operationalMode = 'Minimize Power-exchange with the grid';
                break;
            case '2':
            case 2:
                $scope.operationalMode = 'Minimize bill costs';
                break;
            case '3':
            case 3:
                $scope.operationalMode = 'Maximize Battery Health';
                break;
            case '4':
            case 4:
                $scope.operationalMode = 'None';
                break;
            default:
            //nothing
        }

        $scope.updateOperationMode();
    }

    $scope.getOperationalModeFromServer = function()
    {
        $http({
            method: 'GET',
            url: $rootScope.s4gVar.backendURL+'/OPMODE'
        }).then(function successCallback(response) {
            //console.log(response.data)
            // this callback will be called asynchronously
            // when the response is available
            $scope.changeOperationalModeIndicator(response.data, true, true);
        }, function errorCallback(response) {
            //console.log(response)
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $scope.getOperationalModeFromServer();

}]);

// define the switch component
dashFooter.component('dashFooter', {
    // the component template
    templateUrl : 'templates/dash-foot.html',
    controller: 'dashFooterController'
});


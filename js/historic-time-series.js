/*
 * Dash.js - Historic Time Series Widget
 * 
 * Copyright (c) 2016 Dario Bonino - Istituto Superiore Mario Boella
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

// declare the angula module
var dashHistoricTimeSeries = angular.module('dashHistoricTimeSeries', [ 'nvd3',
		'ui.bootstrap' ]);


// define the switch component
dashHistoricTimeSeries.directive('dashHistoricTimeSeries', function(){
    return {
        scope: true,
        // the component template
        templateUrl : 'templates/dash-historic-time-series.html',
        bindToController: {
            // the x axis label
            dashXLabel : "=",
            // the y axis label
            dashY1Label: "=",
            dashY2Label: "=",
            // the graph data
            dashData : "=",
            // the min Y
            dashMinY : "<",
            // the max Y
            dashMaxY : "<",
            // sensor name
            dashSensorName : "<",
            startDate: "=",
			endDate: "=",
			s4gLocalVar: "="
        },
        controller: dashHistoricTimeSeriesController,
        controllerAs: "ctrl"

    }
});

// the component controller
function dashHistoricTimeSeriesController($scope, $element, $attrs) {
	// debug only
	// console.log(this.dashOptions);

	// store this controller in an easier to use variable to avoid scope
	// confusion
	// as a default value
	var sensor = 'sensor_meter_mains';
    // end fixed at the current moment
    var tempEndDate = new Date();
    // start date: today at midnight
    var todayMidNight = new Date();
    todayMidNight.setHours(0);
    todayMidNight.setMinutes(0);
    todayMidNight.setSeconds(0);
    $scope.startDate = todayMidNight;
    $scope.endDate = tempEndDate;

    var tempFullYear = $scope.startDate.getFullYear();
    $scope.startYear = tempFullYear;

	/**
	 * Sets the chart options by mixing fixed settings with settings inherited
	 * through bindings
	 */
	$scope.dashOptions = {
		chart : {
			type : 'multiChart',
            yDomain2:[0, 100],
			useInteractiveGuideline: true,
            showValues: true,
			// chart height: this shall be customizable...
			height : ($scope.dashHeight != undefined) ? $scope.dashHeight : 550,
			// the margins around the chart area
			margin : {
				top : 20,
				right : 75,
				bottom : 120,
				left : 70
			},
			// functions to get x and y from data
			x : function(d) {
				if (d != undefined)
					return d.x;
			},
			y : function(d) {
				if (d != undefined)
					return d.y;
			},
			// x-axis settings
			xAxis : {
				// set ticks
                /*
				tickFormat : function(d) {
					return d3.time.format("%Y-%m-%dT%H:%M:%S")(new Date(d))
				},
				// set type of scale
				scale : d3.time.scale(),
                */

                dispatch:{

                },
                axisLabelDistance:0,
                staggerLabels:false,
                // rotate the dates
                rotateLabels : -45,
                rotateYLabel:true,
                showMaxMin:true,
                // set the label
                axisLabel : "Date",
                height:60,
                ticks:null,
                width:75,
                margin:{
                    "top":0,
                    "right":0,
                    "bottom":0,
                    "left":0
                },
                duration:250,
                orient:"bottom",
                tickValues:null,
                tickSubdivide:0,
                tickSize:6,
                tickPadding:5,
                domain:[
                    0,
                    1
                ],
                range:[
                    0,
                    1
                ],
                tickFormat : function(d){
                    return d3.time.format('%d-%m-%y')(new Date(d));
                }

            },
			yAxis1 : {
				// set ticks
				tickFormat : function(d) {
					return d3.format('.02f')(d);
				},
                dispatch:{

                },
                axisLabelDistance:0,
                staggerLabels:false,
                rotateLabels:0,
                rotateYLabel:true,
                showMaxMin:true,
                // set the label
                axisLabel:'W',
                height:60,
                ticks:null,
                width:75,
                margin:{
                    "top":0,
                    "right":0,
                    "bottom":0,
                    "left":0
                },
                duration:250,
                orient:"left",
                tickValues:null,
                tickSubdivide:0,
                tickSize:6,
                tickPadding:3,
                domain:[
                    0,
                    1
                ],
                range:[
                    0,
                    1
                ]
			},
            yAxis2 : {
                // set ticks
                tickFormat : function(d) {
                    return d3.format('.02f')(d);
                },
                dispatch:{

                },
                axisLabelDistance:0,
                staggerLabels:false,
                rotateLabels:0,
                rotateYLabel:true,
                showMaxMin:true,
                // set the label
                axisLabel : '%',
                height:60,
                ticks:null,
                width:75,
                margin:{
                    "top":0,
                    "right":0,
                    "bottom":0,
                    "left":0
                },
                duration:250,
                orient:"right",
                tickValues:null,
                tickSubdivide:0,
                tickSize:6,
                tickPadding:3,
                domain:[
                    0,
                    1
                ],
                range:[
                    0,
                    1
                ]
            },
            bars1:{
                dispatch:{

                },
                width:960,
                height:500,
                forceY:[$scope.dashMinY, $scope.dashMaxY
                ],
                stacked:true,
                stackOffset:"zero",
                clipEdge:true,
                id:5431,
                hideable:false,
                groupSpacing:0.3,
                margin:{
                    "top":0,
                    "right":0,
                    "bottom":0,
                    "left":0
                },
                duration:500,
                barColor:null
            },
            bars2:{
                dispatch:{

                },
                width:960,
                height:500,
                forceY:[$scope.dashMinY, $scope.dashMaxY
                ],
                stacked:false,
                stackOffset:"zero",
                clipEdge:true,
                id:1093,
                hideable:false,
                groupSpacing:0.1,
                margin:{
                    "top":0,
                    "right":0,
                    "bottom":0,
                    "left":0
                },
                duration:500,
                barColor:null
            },
            duration: 500,
			// enable zoom functions
			zoom : {
				enabled : true,
                translate: [0, 0],
				scaleExtent : [ 0, 10 ],
				useFixedDomain : false,
				useNiceScale : true,
                horizontalOff: false,
                verticalOff: false,
				// set the event for zoom reset
				unzoomEventType : "dblclick.zoom"
			},
            dispatch:{

            },
            legend:{
                dispatch:{

                },
                width:400,
                height:30,
                align:false,
                maxKeyLength:20,
                rightAlign:true,
                padding:32,
                updateState:true,
                radioButtonMode:false,
                expanded:false,
                vers:"classic",
                margin:{
                    "top":5,
                    "right":0,
                    "bottom":5,
                    "left":0
                }
            },
            noData : 'No Data Available.',
            //interpolate : ($scope.dashInterpolate != undefined) ? $scope.dashInterpolate: 'basis',
			//forceY : [ $scope.dashMinY, $scope.dashMaxY ]
		// call back for chart changes, not needed
		/*
		 * dispatch : { stateChange : function(e) { console.log('stateChange') }
		 */
		}
	}

	/**
	 * Date pickers configurations and business logic
	 */

	/**
	 * Simple function to find data series extremes over X TODO: check if it can
	 * be done better, e.g., by using d3 functions...
	 *
	 * MUST be defines before using it, do not move this function declaration
	 *
	 * @param data
	 *            The data from which extracting the extremes
	 * @param min
	 *            A boolean value that if true triggers minimum search,
	 *            otherwise a maximum search
	 */
	$scope.findMinMaxDate = function(data, min) {

        if (min!=true)
        {

            $scope.endDate.setHours(23);
            $scope.endDate.setMinutes(59);
            $scope.endDate.setSeconds(59);

            return $scope.endDate;
        }
        else
        {

            $scope.startDate.setHours(0);
            $scope.startDate.setMinutes(0);
            $scope.startDate.setSeconds(0);

            return $scope.startDate;
        }

	};

    $scope.findMinMaxY = function(data) {

        $scope.dashMinY = 0;
        $scope.dashMaxY = 0;
        if (data != undefined && data!=[]) {
            var calculateSum = false;
            //we want to calculate min and max only if all the series has the same dimension
            var dimension = 0;
            var continueWithCalculation = true;
            // iterate over series in data to understand if at least one data is bar. In that case the max is the sum of all the series
            for (var dataSeries2 in data) {
                /*
                if (data[dataSeries2].hasOwnProperty("values")) {
                    if (dimension === 0) {
                        dimension = data[dataSeries2].values.length;
                    }
                    if (dimension != data[dataSeries2].values.length) {
                        continueWithCalculation = false;
                    }
                }

                 */
                if (data[dataSeries2].hasOwnProperty("type") && data[dataSeries2].type == "bar") {
                    calculateSum = true;
                }
            }
            var totalMin = 0;
            var totalMax = 0;
            if (continueWithCalculation) {
                // iterate over series in data
                for (var dataSeries in data) {
                    if (data[dataSeries].hasOwnProperty("key") && data[dataSeries].key != "no data") {
                        // iterate over values in a single series
                        var maxInSerie = Number($scope.dashMaxY);
                        var minInSerie = Number($scope.dashMinY);
                        for (var value in data[dataSeries].values) {
                            if (data[dataSeries].values[value].y != undefined && !isNaN(data[dataSeries].values[value].y)) {
                                if (isNaN(minInSerie)) {
                                    minInSerie = data[dataSeries].values[value].y;
                                }
                                if (isNaN(maxInSerie)) {
                                    maxInSerie = data[dataSeries].values[value].y;
                                }
                                // search for min/max
                                if (data[dataSeries].values[value].y < minInSerie) {
                                    minInSerie = data[dataSeries].values[value].y;
                                } else if (data[dataSeries].values[value].y > maxInSerie) {
                                    maxInSerie = data[dataSeries].values[value].y;
                                }
                            }
                        }
                        if (calculateSum) {
                            if (minInSerie < totalMin) {
                                totalMin = minInSerie;
                            }
                            totalMax += maxInSerie;
                        } else {
                            if (minInSerie < totalMin) {
                                totalMin = minInSerie;
                            }

                            if (maxInSerie > totalMax) {
                                totalMax = maxInSerie;
                            }
                        }
                    }
                }
                $scope.dashMinY = Number(totalMin);
                $scope.dashMaxY = Number(totalMax) + 10;
                //if (calculateSum) {
                    $scope.dashOptions.chart.yDomain1 = [$scope.dashMinY, $scope.dashMaxY];
                /*}
                else
                {
                    $scope.dashOptions.chart.yDomain1 = [];
                }*/
            }
        }
    };
	/**
	 * Component output, signals changes in the visualized data range through
	 * calls to the on-update callback
	 */
    $scope.updateRange = function() {
        if (($scope.startDate != undefined) && ($scope.endDate != undefined)) {
            var tempFullYear = $scope.startDate.getFullYear();
            if ($scope.s4gLocalVar.currentSelection === "month")
            {
                var month = $scope.startDate.getMonth();

                var nextStartDate = new Date($scope.startDate);
                nextStartDate.setHours(0);
                nextStartDate.setMinutes(0);
                nextStartDate.setSeconds(0);
                nextStartDate.setMonth(month);
                nextStartDate.setDate(1);

                var nextEndDate = new Date($scope.startDate);
                //set the last day of the month
                var nextMonth = month + 1;
                if (nextMonth>11)
                {
                    nextMonth = 0;
                }
                nextEndDate.setMonth(month+1);
                //0 will result in the last day of the previous month
                nextEndDate.setDate(0);
                nextEndDate.setHours(23);
                nextEndDate.setMinutes(59);
                nextEndDate.setSeconds(59);
                $scope.startDate = nextStartDate;
                $scope.endDate = nextEndDate;
            }
            else
            {
                if ($scope.s4gLocalVar.currentSelection === "year")
                {
                    var year = $scope.startDate.getFullYear();
                    var nextStartDate = new Date($scope.startDate);
                    nextStartDate.setHours(0);
                    nextStartDate.setMinutes(0);
                    nextStartDate.setSeconds(0);
                    nextStartDate.setMonth(0);
                    nextStartDate.setDate(1);
                    nextStartDate.setFullYear(year);

                    var nextEndDate = new Date($scope.startDate);
                    nextEndDate.setHours(23);
                    nextEndDate.setMinutes(59);
                    nextEndDate.setSeconds(59);
                    nextEndDate.setMonth(11);
                    nextEndDate.setDate(31);
                    nextEndDate.setFullYear(year);
                    $scope.startDate = nextStartDate;
                    $scope.endDate = nextEndDate;
                }
            }
            $scope.startYear = tempFullYear;
            if ($scope.startDate<=$scope.endDate) {
                $scope.setStartDate($scope.startDate);
                $scope.setEndDate($scope.endDate);
            }
            else
            {
                //if the endData < startDate we set it to startDate
                $scope.endDate=$scope.startDate;
                $scope.setStartDate($scope.startDate);
                $scope.setEndDate($scope.endDate);
                //TODO: warning, but only the first time
            }

        }
    }


    $scope.updateYear = function() {
        var year = $scope.startYear;
        var nextStartDate = new Date($scope.startDate);
        nextStartDate.setHours(0);
        nextStartDate.setMinutes(0);
        nextStartDate.setSeconds(0);
        nextStartDate.setMonth(0);
        nextStartDate.setDate(1);
        nextStartDate.setFullYear(year);

        var nextEndDate = new Date($scope.startDate);
        nextEndDate.setHours(23);
        nextEndDate.setMinutes(59);
        nextEndDate.setSeconds(59);
        nextEndDate.setMonth(11);
        nextEndDate.setDate(31);
        nextEndDate.setFullYear(year);
        $scope.startDate = nextStartDate;
        $scope.endDate = nextEndDate;
    }

	/**
	 * Handler for the "Last week" button
	 */
	$scope.lastWeek = function() {
		// debug only
		// console.log("Last week!!");


        if (!$scope.s4gLocalVar.disableUpdateButton()) {
            $scope.s4gLocalVar.currentSelection = "week";//possible values: day, month, year
            // end date is now
            $scope.endDate = new Date();

            // start date is one week ago
            var millisecondsToSubstruct = 7 * 24 * 60 * 60 * 1000;
            //we should start one day after the current day of the last month
            millisecondsToSubstruct -= 1 * 24 * 60 * 60 * 1000;
            var oneWeekAgo = new Date(new Date().setTime(new Date().getTime() - millisecondsToSubstruct));
            //we should start one day after the current day of the last month
            $scope.startDate = oneWeekAgo;
            $scope.startYear = $scope.startDate.getFullYear();
            // trigger range update handler
            $scope.updateRange();
        }
	}

	/**
	 * Handler for the "Last day" button
	 */
	$scope.lastDay = function() {
		// debug only
		// console.log("Last month!!");
        if (!$scope.s4gLocalVar.disableUpdateButton()) {
            $scope.s4gLocalVar.currentSelection = "day";//possible values: day, month, year
            // end date is now
            $scope.endDate = new Date();

            // start date is one day ago
            //$scope.startDate = new Date(new Date().setDate(new Date().getDate() - 1));

            // start date today at midnight
            var todayMidNight = new Date();
            todayMidNight.setHours(0);
            todayMidNight.setMinutes(0);
            todayMidNight.setSeconds(0);

            $scope.startDate = todayMidNight;
            $scope.startYear = $scope.startDate.getFullYear();
            // trigger range update handler
            $scope.updateRange();
        }
	}

    $scope.lastMonth = function() {
        // debug only
        // console.log("Last month!!");

        if (!$scope.s4gLocalVar.disableUpdateButton()) {
            $scope.s4gLocalVar.currentSelection = "month";//possible values: day, month, year
            // end date is now
            $scope.endDate = new Date();
/*
            // start date is one month ago
            var oneMonthAgo = new Date(new Date()
                .setTime(new Date().getTime() - 28*24*60*60*1000));
            //we should start one day after the current day of the last month
            oneMonthAgo.setDate(oneMonthAgo.getDate() + 1);
            $scope.startDate = new Date(oneMonthAgo);

 */
            $scope.startYear = $scope.startDate.getFullYear();
            // trigger range update handler
            $scope.updateRange();
        }
    }

    // /**
	// * Handler for the "Last year" button
	// */
	$scope.lastYear = function() {
		// debug only
		// console.log("Last year!!");

        if (!$scope.s4gLocalVar.disableUpdateButton()) {

            $scope.s4gLocalVar.currentSelection = "year";//possible values: day, month, year

            // end date is now
            $scope.endDate = new Date();
/*
            this part was used before the changes -> different input types for Day, Month, Year
            // start date is one year ago
            var oneYearAgo = new Date(new Date()
                .setFullYear(new Date().getFullYear() - 1));

            //we should start one day after the current day of the last year
            oneYearAgo.setDate(oneYearAgo.getDate() + 1);
            $scope.startDate = new Date(oneYearAgo);

 */
            $scope.startYear = $scope.startDate.getFullYear();
            // trigger range update handler
            $scope.updateRange();
        }
	}

    $scope.$on('startLoading', function(e) {
        $scope.dashOptions.chart.noData = 'Loading ...';
    });

    //$scope.$watch('dashData', function(newValue, oldValue) {
        $scope.$on('endLoading', function(e) {
            //$scope.$parent.msg = $scope.get();
        //console.log(newValue);
        //if (newValue != undefined) {
            $scope.findMinMaxY($scope.dashData);

            // update start and stop date for date pickers
            $scope.startDate = $scope.findMinMaxDate($scope.dashData, true);
            $scope.endDate = $scope.findMinMaxDate($scope.dashData, false);
            // reset the x axis range
            // TODO: check if needed
            $scope.dashOptions.chart.forceX = [ $scope.startDate, $scope.endDate ];
            $scope.dashOptions.chart.forceY = [ $scope.dashMinY, $scope.dashMaxY ];
        //}

            if ($scope.s4gLocalVar.currentSelection === "day")
            {
                $scope.dashOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%d-%m-%Y %H:%M')(new Date(d));
                };
            }
            else
            {
                if ($scope.s4gLocalVar.currentSelection === "week")
                {
                    $scope.dashOptions.chart.xAxis.tickFormat = function (d) {
                        return d3.time.format('%d-%m-%Y')(new Date(d));
                    };
                }
                else
                {
                    if ($scope.s4gLocalVar.currentSelection === "month")
                    {
                        $scope.dashOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%d-%m-%Y')(new Date(d));
                        };
                    }
                    else
                    {
                        $scope.dashOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%B-%Y')(new Date(d));
                        };
                    }
                }
            }
            $scope.dashOptions.chart.noData = 'No data available.'
    });
    //
    // $scope.$watch('startDate', function(newValue, oldValue) {
    //         $scope.setStartDate($scope.startDate);
    // });
    // $scope.$watch('endDate', function(newValue, oldValue) {
    //     $scope.setEndDate($scope.endDate);
    // });

	/**
	 * Handle data series change
	 */
	$scope.onChanges = function(changes) {
		if (changes.dashData.currentValue != undefined) {
			// update start and stop date for date pickers
			$scope.startDate = $scope.findMinMaxDate($scope.dashData, true);
			$scope.endDate = $scope.findMinMaxDate($scope.dashData, false);
			// reset the x axis range
			// TODO: check if needed
			$scope.dashOptions.chart.forceX = [ $scope.startDate, $scope.endDate ];
		}
	}


    $scope.getSelectedInterval = function () {
        return $scope.s4gLocalVar.currentSelection;
    }

    $scope.resetCurrentSelection = function () {
        //get difference in seconds
        var diffSeconds = ($scope.endDate.getTime() - $scope.startDate.getTime());
        var diffMonth = ($scope.endDate.getMonth() - $scope.startDate.getMonth());
        var diffYear = ($scope.endDate.getFullYear() - $scope.startDate.getFullYear());
        if (diffSeconds<=(2*24*60*60*1000))
        {
            $scope.s4gLocalVar.currentSelection='day';
            $scope.dashOptions.chart.yAxis1.axisLabel = 'W';
        }
        else
        {
            //if (diffSeconds<=((14)*24*60*60)*1000) {
            if (diffSeconds<=((6)*24*60*60)*1000) {
                //$scope.s4gLocalVar.currentSelection='week';
                $scope.s4gLocalVar.currentSelection='day';
                $scope.dashOptions.chart.yAxis1.axisLabel = 'W';
            }
            else
            {

                if (diffSeconds<=((364)*24*60*60)*1000) {
                    $scope.s4gLocalVar.currentSelection='month';
                    $scope.dashOptions.chart.yAxis1.axisLabel = 'KWh';
                }
                else
                {
                    $scope.s4gLocalVar.currentSelection= 'year';
                    $scope.dashOptions.chart.yAxis1.axisLabel = 'KWh';
                }
            }
        }
    }


	$scope.printClassIf = function(currentSelect)
	{
	    var result = "";
        if ($scope.s4gLocalVar.disableUpdateButton())
        {
            result += "disabledButton ";
        }

        if ($scope.getSelectedInterval()==currentSelect )
            result += "selectedCell";
        else
            result += "";

        /*
	    //get difference in seconds
        var diffSeconds = ($scope.endDate.getTime() - $scope.startDate.getTime());
	    var diffMonth = ($scope.endDate.getMonth() - $scope.startDate.getMonth());
        var diffYear = ($scope.endDate.getFullYear() - $scope.startDate.getFullYear());
	    if (diffSeconds<=(2*24*60*60*1000))
        {
            if (currentSelect=='day')
            {
                result += "selectedCell";
            }
            else
            {
                result += "";
            }
        }
	    else
        {
            if (diffSeconds<=((7+1)*24*60*60)*1000) {
                if (currentSelect == 'week') {
                    result += "selectedCell";
                } else {

                    result += "";
                }
            }
            else
            {

                if (diffSeconds<=((364)*24*60*60)*1000) {
                    if (currentSelect == 'month') {
                        result += "selectedCell";
                    } else {

                        result += "";
                    }
                }
                else
                {
                    if (currentSelect == 'year') {
                        result += "selectedCell";
                    } else {

                        result += "";
                    }
                }
            }
        }*/
	    return result;
	}

    $scope.printFrequency = function()
    {
	    var result = "";
        if ($scope.s4gLocalVar.frequencyInMinutesForChart<60) {
            result = ($scope.s4gLocalVar.frequencyInMinutesForChart).toString()+" minutes";
        }
        else {
            if ($scope.s4gLocalVar.frequencyInMinutesForChart>=60 && $scope.s4gLocalVar.frequencyInMinutesForChart<7*24*60) {
                result = ($scope.s4gLocalVar.frequencyInMinutesForChart/(24*60)).toString()+" days";
            }
            else
            {
                if ($scope.s4gLocalVar.frequencyInMinutesForChart>=7*24*60 && $scope.s4gLocalVar.frequencyInMinutesForChart<28*24*60) {
                    result = ($scope.s4gLocalVar.frequencyInMinutesForChart/(7*24*60)).toString()+" weeks";
                }
                else
                {
                    if ($scope.s4gLocalVar.frequencyInMinutesForChart>=31*24*60) {
                        result = ($scope.s4gLocalVar.frequencyInMinutesForChart/(31*24*60)).toString()+" months";
                    }
                }
            }
        }
        return result;
    }


    $scope.printDisplayNone = function (firstCondition, secondCondition)
    {
        if ($scope.getSelectedInterval()==firstCondition || $scope.getSelectedInterval()==secondCondition)
            return '';
        else
            return 'display: none';
    }
};

'use strict';

// create the account module
var accountModule = angular.module('accountModule', []);
// the module controller

accountModule
		.controller(
				'accountController',
				[
					'$scope',
					'$rootScope',
					'$element',
					'$attrs',
					'$timeout',
					'MqttFactory',
					'Auth',
					function($scope, $rootScope, $element, $attrs, $timeout, MqttFactory, Auth)
                    {

						$rootScope.s4gVar.currentPositionPage = "account";
						$rootScope.s4gVar.currentView = "Account";
						$scope.auth = Auth; //acquires authentication from app.js (if it was done)
						$scope.authUser = $scope.auth.$getAuth();
						$scope.user = {};
						$scope.user.originalEmail = $scope.authUser.email;
						$scope.user.email = $scope.authUser.email;
						$scope.successfulMessage = '';

                        $scope.getBlockSizeForInput = function(divider)
                        {
                            return ((document.getElementsByClassName("row").item(0).offsetWidth)/divider).toFixed(0);
                        }

                        $scope.changeEmail = function()
						{
							$scope.error = undefined;
							$scope.successfulMessage = undefined;
							if ($scope.user.email!='' && $scope.user.email!=undefined) {
								if ($scope.user.email != $scope.user.originalEmail) {
									$scope.auth.$updateEmail($scope.user.email).then(function () {
										$scope.error = undefined;
										$scope.successfulMessage = 'The email was successfully updated';
										$scope.user.originalEmail = $scope.authUser.email
									}).catch(function (error) {
										$scope.successfulMessage = '';
										$scope.error = error;
									});
								}
							}
							else {
								$scope.error = {};
								$scope.error.message = "You forgot to insert the new email";
								$log.error("You forgot to insert the new email");
							}
						}


						$scope.changePassword = function()
						{
							$scope.error = undefined;
							$scope.successfulMessage = undefined;
							if ($scope.user.oldPassword!='' && $scope.user.oldPassword!=undefined && $scope.user.newPassword!='' && $scope.user.newPassword!=undefined && $scope.user.newPassword2!='' && $scope.user.newPassword2!=undefined)
							{
								$scope.auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.oldPassword).then(function(firebaseUser)
								{
									if ($scope.user.newPassword==$scope.user.newPassword2) {
										$scope.auth.$updatePassword($scope.user.newPassword).then(function () {
											$scope.error = undefined;
											$scope.successfulMessage = 'The password was successfully updated';
											$scope.user.oldPassword = undefined;
											$scope.user.newPassword = undefined;
											$scope.user.newPassword2 = undefined;
										}).catch(function (error) {
											$scope.successfulMessage = undefined;
											$scope.error = error;
											$scope.user.oldPassword = undefined;
											$scope.user.newPassword = undefined;
											$scope.user.newPassword2 = undefined;
										});
									}
									else {
											$scope.error = {};
											$scope.error.message = "Password 1 is not equal to password 2";
											$log.error("Password 1 is not equal to password 2");
										}
								})
								.catch(function(err) {
									$scope.error = {};
									$scope.error.message = "The old password is not correct";
								});
							}
							else {
								$scope.error = {};
								$scope.error.message = "You forgot to fill one of the fields";
								$log.error("You forgot to fill one of the fields");
							}
						}
                    } ]);

// define the text-measure component
accountModule.component('accountModule', {
	bindings : {
	},
	controller : accountController
});


// the widget controller, actually does nothing as no data can be changed /
// modified
function accountController($scope, $element, $attrs) {
	// sensor = $attrs.dashLabel;

}

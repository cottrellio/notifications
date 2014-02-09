/**
*  Module
*
* Description
*/

// Inject App dependancies.
angular.module('MyApp', ['notifications', 'ngAnimate']);

// Controller.
function MainCtrl($scope, $timeout, $notification) {
	$timeout(function(){
		var message = {
			type: 'success',
			title: 'It Works!',
			content: 'The Notification Service is <strong>online</strong> :)'
		};
		$notification.notify(message);
	}, 500);

	$scope.newNote = function(type) {
		var message = {
			type: type,
			content: 'Notification content goes here.',
			duration: 5000
		};
		$notification.notify(message);
	};
};
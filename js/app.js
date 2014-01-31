/**
*  Module
*
* Description
*/

// Inject App dependancies.
angular.module('MyApp', ['notifications', 'ngAnimate']);

// Controller.
function MainCtrl($scope, $notification, $timeout) {
	$timeout(function(){
		$notification.notify('success', '', '', 'It Works!', 'Notifications service successfully installed and running!');
	}, 500);

	$scope.newNote = function(type) {
		var title = type.charAt(0).toUpperCase() + type.slice(1);
		$notification.notify(type, '', '', title, title + ' message.');
	};
};
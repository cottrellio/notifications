notifications
=============

AngularJS Notification Service.

Dependancies
====

* AngularJS v-1.2.*
* Uses Font Awesome icons (but you can make your own icon font at IcoMoon)
* The demo uses ngAnimate (optional)

Installation
====

1) Include the script, css, FontAwesome in the head.

	<script type="text/javascript" src="js/notifications.js"></script>
	<link href="http://netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.css" rel="stylesheet">
	<link rel="stylesheet" href="css/notifications.css">

2) Inject the notifications service into your ngApp. (along with other dependancies suchas ngAnimate)

	angular.module('MyApp', ['notifications', 'ngAnimate']);

3) Pass the service into your controller as an argument. (must pass in $notification as well as $timeout)

	function MainCtrl($scope, $notification, $timeout) {

4) place an element in your html where you want the notifications to populate and specify the corner you want them to be positioned in. (Choices: top, bottom, left, right)

	<div notifications="bottom right"></div>

5) Create a method within your controller to handle the notification creation! Here's an example:

	$scope.newNote = function(type) {
		var title = type.charAt(0).toUpperCase() + type.slice(1);
		$notification.notify(type, '', '', title, title + ' message.');
	};

6) Great, finally just add some html in your controller to invoke your newNote() method:

	<div ng-controller="MainCtrl">
		<button ng-click="newNote('success')">Success!</button>
	</div>

All done! Click the button and watch your notifications populate.

'use strict';

/**
* notifications Module
*
* Handles notification delivery.
*/
angular.module('notifications', []).
    factory('$notification', ['$timeout', '$sce', function($timeout, $sce) {

        var notifications = JSON.parse(localStorage.getItem('$notifications')) || [],
            queue = [];

        /* ------------------------------------------------------------------------------------------------
            Config Settings (types, timeout duration, etc.)
        ------------------------------------------------------------------------------------------------ */

        var settings = {
            info: { icon: 'info-sign', duration: 5000, enabled: true },
            warning: { icon: 'warning-sign', duration: 5000, enabled: true },
            error: { icon: 'exclamation-sign', duration: 5000, enabled: true },
            success: { icon: 'check-sign', duration: 5000, enabled: true },
            custom: { icon: 'trophy', duration: 35000, enabled: true },
            localStorage: false,
            debugMode: false
        };

        if (settings.debugMode) {
            console.log('Notification service online. :)');
            console.log('$sce enabled: ' + $sce.isEnabled());
        }

        return {

            /* ------------------------------------------------------------------------------------------------
                Query Methods
            ------------------------------------------------------------------------------------------------ */

            // Returns ALL notifications.
            getAll: function() {
                return notifications;
            },

            // Returns queued notifications.
            getQueue: function() {
                return queue;
            },

            /* ------------------------------------------------------------------------------------------------
                Notification Methods
            ------------------------------------------------------------------------------------------------ */

            // Overwrite defaults if provided.
            notify: function(messageObj) {

                // Validate required fields.
                if (!this.validate(messageObj)) {
                    return false;
                }

                var type = (messageObj.type && messageObj.type !== '') ? messageObj.type : '';
                var image = (messageObj.image && messageObj.image !== '') ? messageObj.image : false;
                var icon = (messageObj.icon && messageObj.icon !== '') ? messageObj.icon : settings[type].icon;
                var title = (messageObj.title && messageObj.title !== '') ? messageObj.title : type.charAt(0).toUpperCase() + type.slice(1);
                var content = (messageObj.content && messageObj.content !== '') ? messageObj.content : '';
                var duration = (messageObj.duration && messageObj.duration !== '') ? messageObj.duration : settings[type].duration;
                var userData = (messageObj.userData && messageObj.userData !== '') ? messageObj.userData : '';

                return this.makeNotification(type, image, icon, title, content, duration, userData);
            },

            // Instantiate timer.
            setTimer: function(notification) {
                var timer = (notification.duration == 0) ? null : $timeout(function removeFromQueueTimeout() {
                    queue.splice(queue.indexOf(notification), 1);
                }, notification.duration);

                return timer;
            },

            // Create notification, add to queue.
            makeNotification: function(type, image, icon, title, content, duration, userData) {
                // Create notification.
                var notification = {
                    type: type,
                    image: image,
                    icon: icon,
                    title: title,
                    content: $sce.trustAsHtml(content),
                    duration: duration,
                    timestamp: +new Date(),
                    userData: userData
                };

                // Set Timer.
                notification.timeout = this.setTimer(notification);

                // Add to notifications.
                notifications.push(notification);

                // Add to queue.
                queue.push(notification);

                // Timeout and remove from queue.
                if (notification.timeout && notification.timeout !== null)
                    notification.timeout;

                // Save to local storage.
                this.save();

                return notification;
            },

            // Validate messageObj for required fields and valid obj.
            validate: function(messageObj) {
                // required fields.
                var requireds = [
                    'type',
                    'content'
                ];

                // Check if messageObj exists.
                if (!messageObj) {
                    return false;
                }

                // Check if reuireds exist, not undefined, not null.
                for (var i = 0; i < requireds.length; i++) {
                    if (!requireds[i] || requireds[i] == undefined || requireds[i] == null || requireds[i] == '') {
                        // Alert
                        if (settings.debugMode) {
                            console.log('DEBUG - Invalid messageObj: Please check that `type` and `content` were provided.');
                        }

                        return false;
                    }
                }

                return true;

            },

            /* ------------------------------------------------------------------------------------------------
                Storage Methods
            ------------------------------------------------------------------------------------------------ */

            // Saves notifications to local storage.
            save: function() {
                // Save all the notifications into localStorage
                // console.log(JSON);
                if(settings.localStorage){
                    localStorage.setItem('$notifications', JSON.stringify(notifications));
                }
                // console.log(localStorage.getItem('$notifications'));
            },

            // Restores notifications from local storage.
            restore: function() {
                // Load all notifications from localStorage
            },

            // Clears notifications.
            clear: function(){
                notifications = [];
                this.save();
            }

        };

    }]).
    directive('dcNotifications', ['$notification', '$compile', function($notification, $compile) {

        function link(scope, element, attrs){
            var position = attrs.dcNotifications;
            position = position.split(' ');
            element.addClass('dc-notification-container');
            for(var i = 0; i < position.length ; i++){
                element.addClass(position[i]);
            }
        }

        return {
            restrict: 'A',
            scope: {},
            templateUrl: function(elem, attrs) {
                return (attrs.templateUrl) ? attrs.templateUrl : 'tmpl/default.html';
            },
            link: link,
            controller: ['$scope', '$timeout', function NotificationsCtrl($scope, $timeout) {
                if ($notification.settings.debugMode) {
                    console.log('Notifications directive instantiated.');
                }

                $scope.queue = $notification.getQueue();

                $scope.pauseTimer = function(noti) {
                    if (noti.timeout && noti.timeout !== null) {
                        $timeout.cancel(noti.timeout);
                        delete noti.timeout;

                        if ($notification.settings.debugMode) {
                            console.log('Timer paused!');
                        }
                    }
                };

                $scope.resumeTimer = function(noti) {
                    if (!noti.timeout && noti.timeout !== null) {
                        noti.timeout = $notification.setTimer(noti);
                        noti.timeout;
                        // console.log(noti);

                        if ($notification.settings.debugMode) {
                            console.log('Resumed Timer!');
                        }
                    }
                };

                $scope.removeNotification = function(noti) {
                    $scope.queue.splice($scope.queue.indexOf(noti), 1);

                    if ($notification.settings.debugMode) {
                        console.log('Notification removed.');
                    }
                };
            }
        ]};

    }]);
'use strict';

/**
* notifications Module
*
* Handles notification delivery.
*/
angular.module('notifications', []).
    factory('$notification', ['$timeout', function($timeout) {

        console.log('Notification service online. :)');
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
            localStorage: true,
            defaultIco: 'icon.png'
        };

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

            notify: function(type, image, icon, title, content, userData) {
                return this.makeNotification(type, image, icon, title, content, userData);
            },

            makeNotification: function(type, image, icon, title, content, userData) {
                // Overerite default icon if provided. Else, use default.
                image = ( image !== '' ) ? image : false;
                icon = ( icon !== '' ) ? icon : settings[type].icon || settings['defaultIco'];

                // Create notification.
                var notification = {
                    'type': type,
                    'image': image,
                    'icon': icon,
                    'title': title,
                    'content': content,
                    'timestamp': +new Date(),
                    'userData': userData
                };

                // Add to notifications.
                notifications.push(notification);

                // Add to queue.
                queue.push(notification);

                // Timeout and remove from queue.
                $timeout(function removeFromQueueTimeout(){
                    queue.splice(queue.indexOf(notification), 1);
                }, settings[type].duration);

                // Save to local storage.
                this.save();

                return notification;
            },

            /* ------------------------------------------------------------------------------------------------
                Storage Methods
            ------------------------------------------------------------------------------------------------ */

            save: function() {
                // Save all the notifications into localStorage
                // console.log(JSON);
                if(settings.localStorage){
                    localStorage.setItem('$notifications', JSON.stringify(notifications));
                }
                // console.log(localStorage.getItem('$notifications'));
            },

            restore: function() {
                // Load all notifications from localStorage
            },

            clear: function(){
                notifications = [];
                this.save();
            }

        };

    }]).
    directive('notifications', ['$notification', '$compile', function($notification, $compile) {

        console.log('Notifications directive instantiated.');

        var html =
            '<div class="dc-notification-wrapper" ng-repeat="notification in queue">' +
                '<div class="dc-notification-close-btn" ng-click="removeNotification(notification)">' +
                    '<i class="icon-remove"></i>' +
                '</div>' +
                '<div class="dc-notification dc-notification-{{ notification.type }}">' +
                    '<div class="dc-notification-image dc-notification-type-{{ notification.type }}" ng-switch on="notification.image">' +
                        '<i class="icon-{{ notification.icon }}" ng-switch-when="false"></i>' +
                        '<img ng-src="{{ notification.image }}" ng-switch-default />' +
                    '</div>' +
                    '<div class="dc-notification-content dc-notification-content-{{ notification.type }}">' +
                        '<h3 class="dc-notification-title">{{ notification.title }}</h3>' +
                        '<p class="dc-notification-text">{{ notification.content }}</p>' +
                    '</div>' +
                '</div>' +
            '</div>';

        function link(scope, element, attrs){
            var position = attrs.notifications;
            position = position.split(' ');
            element.addClass('dc-notification-container');
            for(var i = 0; i < position.length ; i++){
                element.addClass(position[i]);
            }
        }


        return {
            restrict: 'A',
            scope: {},
            template: html,
            link: link,
            controller: ['$scope', function NotificationsCtrl( $scope ) {
                $scope.queue = $notification.getQueue();

                $scope.removeNotification = function(noti) {
                    $scope.queue.splice($scope.queue.indexOf(noti), 1);
                };
            }
        ]};

    }]);
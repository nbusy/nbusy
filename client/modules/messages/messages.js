'use strict';

angular
    .module('nbusy.messages', [
      'ngRoute',
      'nbusy.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/messages', {
            title: 'Messages',
            templateUrl: 'modules/messages/messages.html',
            controller: 'MessagesCtrl'
          });
    });
'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('nbusy.home', [
      'ngRoute',
      'monospaced.elastic',
      'nbusy.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            title: 'NBusy',
            templateUrl: 'modules/home/home.html',
            controller: 'HomeCtrl'
          });
    });
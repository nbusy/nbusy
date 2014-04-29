'use strict';

describe('Messages controller', function () {

  var ctrl, scope;

  beforeEach(module('nbusy.messages'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('MessagesCtrl', {$scope: scope});
  }));

  it('should be defined', function () {
    expect(ctrl).toBeDefined();
  });

});

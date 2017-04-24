angular.module('whale.services')
.factory('EndpointProvider', ['LocalStorage', function EndpointProviderFactory(LocalStorage) {
  'use strict';
  var endpoint = {};
  var service = {};
  service.initialize = function() {
    var endpointID = LocalStorage.getEndpointID();
    if (endpointID) {
      endpoint.ID = endpointID;
    }
  };
  service.clean = function() {
    endpoint = {};
  };
  service.endpointID = function() {
    return endpoint.ID;
  };
  service.setEndpointID = function(id) {
    endpoint.ID = id;
    LocalStorage.storeEndpointID(id);
  };
  return service;
}]);

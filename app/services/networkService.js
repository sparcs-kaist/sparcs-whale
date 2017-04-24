angular.module('whale.services')
.factory('NetworkService', ['$q', 'Network', function NetworkServiceFactory($q, Network) {
  'use strict';
  var service = {};

  service.getNetworks = function() {
    return Network.query({}).$promise;
  };

  service.filterGlobalNetworks = function(networks) {
    return networks.filter(function (network) {
      if (network.Scope === 'global') {
        return network;
      }
    });
  };

  service.filterSwarmModeAttachableNetworks = function(networks) {
    return networks.filter(function (network) {
      if (network.Scope === 'swarm' && network.Attachable === true) {
        return network;
      }
    });
  };

  service.addPredefinedLocalNetworks = function(networks) {
    networks.push({Scope: "local", Name: "bridge"});
    networks.push({Scope: "local", Name: "host"});
    networks.push({Scope: "local", Name: "none"});
  };

  return service;
}]);

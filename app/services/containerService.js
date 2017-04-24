angular.module('whale.services')
.factory('ContainerService', ['$q', 'Container', 'ContainerHelper', function ContainerServiceFactory($q, Container, ContainerHelper) {
  'use strict';
  var service = {};

  service.getContainers = function (all, hiddenLabels) {
    var deferred = $q.defer();
    Container.query({ all: all }).$promise
    .then(function success(data) {
      var containers = data;
      if (hiddenLabels) {
        containers = ContainerHelper.hideContainers(data, hiddenLabels);
      }
      deferred.resolve(data);
    })
    .catch(function error(err) {
      deferred.reject({ msg: 'Unable to retriever containers', err: err });
    });
    return deferred.promise;
  };

  service.createContainer = function(configuration) {
    var deferred = $q.defer();
    Container.create(configuration).$promise
    .then(function success(data) {
      if (data.message) {
        deferred.reject({ msg: data.message });
      } else {
        deferred.resolve(data);
      }
    })
    .catch(function error(err) {
      deferred.reject({ msg: 'Unable to create container', err: err });
    });
    return deferred.promise;
  };

  service.startContainer = function(containerID) {
    var deferred = $q.defer();
    Container.start({ id: containerID }, {}).$promise
    .then(function success(data) {
      if (data.message) {
        deferred.reject({ msg: data.message });
      } else {
        deferred.resolve(data);
      }
    })
    .catch(function error(err) {
      deferred.reject({ msg: 'Unable to start container', err: err });
    });
    return deferred.promise;
  };

  service.createAndStartContainer = function(configuration) {
    var deferred = $q.defer();
    var containerID;
    service.createContainer(configuration)
    .then(function success(data) {
      containerID = data.Id;
      return service.startContainer(containerID);
    })
    .then(function success() {
      deferred.resolve({ Id: containerID });
    })
    .catch(function error(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  return service;
}]);

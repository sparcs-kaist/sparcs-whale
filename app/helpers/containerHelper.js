angular.module('whale.helpers')
.factory('ContainerHelper', [function ContainerHelperFactory() {
  'use strict';
  var helper = {};

  helper.commandStringToArray = function(command) {
    return splitargs(command);
  };

  helper.hideContainers = function(containers, containersToHideLabels) {
    return containers.filter(function (container) {
      var filterContainer = false;
      containersToHideLabels.forEach(function(label, index) {
        if (_.has(container.Labels, label.name) &&
        container.Labels[label.name] === label.value) {
          filterContainer = true;
        }
      });
      if (!filterContainer) {
        return container;
      }
    });
  };

  return helper;
}]);

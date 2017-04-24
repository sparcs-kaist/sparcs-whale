angular.module('whale.helpers')
.factory('TemplateHelper', ['$filter', function TemplateHelperFactory($filter) {
  'use strict';
  var helper = {};

  helper.getDefaultContainerConfiguration = function() {
    return {
      Env: [],
      OpenStdin: false,
      Tty: false,
      ExposedPorts: {},
      HostConfig: {
        RestartPolicy: {
          Name: 'no'
        },
        PortBindings: {},
        Binds: [],
        Privileged: false
      },
      Volumes: {}
    };
  };

  helper.portArrayToPortConfiguration = function(ports) {
    var portConfiguration = {
      bindings: {},
      exposedPorts: {}
    };
    ports.forEach(function (p) {
      if (p.containerPort) {
        var key = p.containerPort + "/" + p.protocol;
        var binding = {};
        if (p.hostPort) {
          binding.HostPort = p.hostPort;
          if (p.hostPort.indexOf(':') > -1) {
            var hostAndPort = p.hostPort.split(':');
            binding.HostIp = hostAndPort[0];
            binding.HostPort = hostAndPort[1];
          }
        }
        portConfiguration.bindings[key] = [binding];
        portConfiguration.exposedPorts[key] = {};
      }
    });
    return portConfiguration;
  };

  helper.EnvToStringArray = function(templateEnvironment, containerMapping) {
    var env = [];
    templateEnvironment.forEach(function(envvar) {
      if (envvar.value || envvar.set) {
        var value = envvar.set ? envvar.set : envvar.value;
        if (envvar.type && envvar.type === 'container') {
          if (containerMapping === 'BY_CONTAINER_IP') {
            var container = envvar.value;
            value = container.NetworkSettings.Networks[Object.keys(container.NetworkSettings.Networks)[0]].IPAddress;
          } else if (containerMapping === 'BY_CONTAINER_NAME') {
            value = $filter('containername')(envvar.value);
          } else if (containerMapping === 'BY_SWARM_CONTAINER_NAME') {
            value = $filter('swarmcontainername')(envvar.value);
          }
        }
        env.push(envvar.name + "=" + value);
      }
    });
    return env;
  };

  helper.createVolumeBindings = function(volumes, generatedVolumesPile) {
    volumes.forEach(function (volume) {
      if (volume.containerPath) {
        var binding;
        if (volume.type === 'auto') {
          binding = generatedVolumesPile.pop().Name + ':' + volume.containerPath;
        } else if (volume.type !== 'auto' && volume.name) {
          binding = volume.name + ':' + volume.containerPath;
        }
        if (volume.readOnly) {
          binding += ':ro';
        }
        volume.binding = binding;
      }
    });
  };

  helper.determineRequiredGeneratedVolumeCount = function(volumes) {
    var count = 0;
    volumes.forEach(function (volume) {
      if (volume.type === 'auto') {
        ++count;
      }
    });
    return count;
  };

  helper.filterLinuxServerIOTemplates = function(templates) {
    return templates.filter(function f(template) {
      var valid = false;
      if (template.Category) {
        angular.forEach(template.Category, function(category) {
          if (_.startsWith(category, 'Network')) {
            valid = true;
          }
        });
      }
      return valid;
    }).map(function(template, idx) {
      template.index = idx;
      return template;
    });
  };

  return helper;
}]);

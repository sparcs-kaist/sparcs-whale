angular.module('whale.services')
.factory('ModalService', [function ModalServiceFactory() {
  'use strict';
  var service = {};

  service.confirm = function(options){
    var box = bootbox.confirm({
      title: options.title,
      message: options.message,
      buttons: {
        confirm: {
          label: options.buttons.confirm.label,
          className: options.buttons.confirm.className
        },
        cancel: {
          label: options.buttons.cancel && options.buttons.cancel.label ? options.buttons.cancel.label : 'Cancel'
        }
      },
      callback: options.callback
    });
    box.css({
      'top': '50%',
      'margin-top': function () {
        return -(box.height() / 2);
      }
    });
  };

  service.confirmOwnershipChange = function(callback, msg) {
    service.confirm({
      title: 'Are you sure ?',
      message: msg,
      buttons: {
        confirm: {
          label: 'Change ownership',
          className: 'btn-primary'
        }
      },
      callback: callback,
    });
  };

  service.confirmContainerOwnershipChange = function(callback) {
    var msg = 'You can change the ownership of a container one way only. You will not be able to make this container private again. <b>Changing ownership on this container will also change the ownership on any attached volume.</b>';
    service.confirmOwnershipChange(callback, msg);
  };

  service.confirmServiceOwnershipChange = function(callback) {
    var msg = 'You can change the ownership of a service one way only. You will not be able to make this service private again. <b>Changing ownership on this service will also change the ownership on any attached volume.</b>';
    service.confirmOwnershipChange(callback, msg);
  };

  service.confirmVolumeOwnershipChange = function(callback) {
    var msg = 'You can change the ownership of a volume one way only. You will not be able to make this volume private again.';
    service.confirmOwnershipChange(callback, msg);
  };

  service.confirmImageForceRemoval = function(callback) {
    service.confirm({
      title: "Are you sure?",
      message: "Forcing the removal of the image will remove the image even if it has multiple tags or if it is used by stopped containers.",
      buttons: {
        confirm: {
          label: 'Remove the image',
          className: 'btn-danger'
        }
      },
      callback: callback,
    });
  };

  service.confirmDeletion = function(message, callback) {
    service.confirm({
      title: 'Are you sure ?',
      message: message,
      buttons: {
        confirm: {
          label: 'Delete',
          className: 'btn-danger'
        }
      },
      callback: callback,
    });
  };
  return service;
}]);

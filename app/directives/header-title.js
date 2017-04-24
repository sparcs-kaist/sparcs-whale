angular
.module('whale')
.directive('rdHeaderTitle', ['Authentication', function rdHeaderTitle(Authentication) {
  var directive = {
    requires: '^rdHeader',
    scope: {
      title: '@'
    },
    link: function (scope, iElement, iAttrs) {
      scope.username = Authentication.getUserDetails().username;
    },
    transclude: true,
    template: '<div class="page white-space-normal">{{title}}<span class="header_title_content" ng-transclude></span><span class="pull-right user-box" ng-if="username"><i class="fa fa-user-circle-o" aria-hidden="true"></i> {{username}}</span></div>',
    restrict: 'E'
  };
  return directive;
}]);

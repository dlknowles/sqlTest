angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, Database) {
  //$scope.data = "nothing yet";
  
  $scope.data = Database.getAll() || 'nothing';
});
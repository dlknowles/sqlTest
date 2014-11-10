angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, Database) {
  //$scope.data = "nothing yet";
  
  $scope.data = Database.getAll();
  console.log('getAll: ', Database.getAll());
  
  $scope.newData = {};
//    date: (new Date()).toLocaleDateString(),
//    miles: '0',
//    notes: 'Test 2'
//  };
  
  $scope.insertData = function() {
    console.log('MainCtrl.insertData()...', $scope.newData);
    
    console.log(Database.insert($scope.newData.date, $scope.newData.miles, $scope.newData.notes));
  };
});
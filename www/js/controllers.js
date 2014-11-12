angular.module('starter.controllers', [])

.controller('ItemsCtrl', function($scope, $state, $ionicActionSheet, Database) {
  $scope.items = [];
  $scope.showDelete = false;
  
  function init() {
    //console.log('init...');
    
    Database.getAllItems()
      .then(function(result) {
        $scope.items = [];
        var len = result.length;

        for (var i = 0; i < len; ++i) {
          $scope.items.push(result.item(i));
        }
        
        //console.log($scope.items);
      });    
  }
  
  $scope.deleteItem = function(id) {
    console.log('deleting item ' + id);
    
    Database.deleteItem(id)
      .then(function(result) { init(); });
  };
  
  var toggleLikeStatus = function(item) {
    if (item.like == 'true') {
      item.like = false;
    } else {
      item.like = true;
    }
    
    Database.updateItem(item.id, item.name, item.notes, item.like)
      .then(init);
  };
  
  $scope.toggleDelete = function() {
    $scope.showDelete = !$scope.showDelete;
  };
  
  $scope.showActions = function(item) {
    var likeText = item.like == 'true' ? 'Don\'t Like' : 'Like';
    
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Edit' },
        { text: likeText }
      ],
      destructiveText: 'Delete',
      titleText: 'Modify ' + item.name,
      cancelText: 'Cancel',
      cancel: function() {
        return true;
      },
      buttonClicked: function(index) {
        switch (index) {
          case 0:
            $state.go('item-detail', {itemId: item.id});
          case 1:
            toggleLikeStatus(item);
          default:
            return true;
        }
        
        return true;
      },
      destructiveButtonClicked: function() {
        $scope.deleteItem(item.id);
        return true;
      }
    });
  };
    
  init();
})

.controller('NewItemCtrl', function($scope, $state, Database) {
  $scope.pagetitle = "New Item";
  
  $scope.item = {
    id: 0,
    name: '',
    like: false,
    notes: ''
  };
  
  $scope.saveItem = function() {
    if ($scope.item.like == 1) $scope.item.like = true;
    if ($scope.item.like == 0) $scope.item.like = false;
    
    Database.insertItem($scope.item.name, $scope.item.like, $scope.item.notes)
      .then(function(result) {
        console.log('Saved ', result.rows);
        $state.go('items');
      });
  };
})

.controller('ItemDetailCtrl', function($scope, $state, $stateParams, Database) {
  $scope.pagetitle = "Edit Item";
  
  var itemId = $stateParams.itemId || 0;
  
  $scope.item = {
    id: itemId,
    name: null,
    like: false,
    notes: null
  };
  
  function init() {
    if (itemId > 0) {
      Database.getItemById($stateParams.itemId)
        .then(function(result) {
  //        $scope.item = result.item(0);
          $scope.item.name = result.item(0).name;
          $scope.item.like = result.item(0).like == "true" ? true : false;
          $scope.item.notes = result.item(0).notes;

          console.log($scope.item);
        });
    }
    else {
      $state.go('newitem');
    }
  }
  
  $scope.updateItem = function() {
    if ($scope.item.like == 1) $scope.item.like = true;
    if ($scope.item.like == 0) $scope.item.like = false;
    
    Database.updateItem(itemId, $scope.item.name, $scope.item.like, $scope.item.notes)
      .then(function(result) {
        $state.go('items');
//        console.log('Updated ', result.rows);
//        console.log($scope.item);
      });
  };
  
  $scope.deleteItem = function() {
    Database.deleteItem(itemId)
      .then(function(result) {
        console.log('deleted', result);
        $state.go('items');
      });
  };
  
  init();
});
angular.module('starter.services', [])

.factory('Database', function($q) {
  var theDB,
      dbName = 'bwdb',
      dbDisplayName = 'BW DB',
      dbSize = 10 * 1024 * 1024,
      dbVersion = '1.0';
      
  function openDatabase(callback) {
    if (!theDB) {
      theDB = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
//      console.log(theDB);

      theDB.transaction(createTables, onTxError, function() { onTxSuccess(callback); });
    } else {
      if (callback) callback();
    }
  }
    
  function createTables(tx) {
    //console.log(tx);
    var sqlStr = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, notes TEXT, like BIT)';
    
    //console.log(sqlStr);
    tx.executeSql(sqlStr, [], onSqlSuccess, onSqlError);
  }
  
  function onSqlSuccess(tx, res) {
    if (res) {
      //console.log('Insert ID: ' + res.insertID);
      //console.log('Row affected: ' + res.rowAffected);
      
      if (res.rows) {
        var len = res.rows.length;
        
        if (len > 0) {
          for (var i = 0; i < len; ++i) {
            console.log('row ' + i + ': ', res.rows[i]);
          }
        } else {
          console.log('No records processed.');
        }
      } 
    } else {
      console.log('No results returned');
    }
  }
  
  function onSqlError(tx, err) {
    var msgText;
    
    if (err) {
      msgText = 'SQL: ' + err.message + ' (' + err.code + ')';
    } else {
      msgText = 'SQL: Unknown error';
    }
    
    console.error(msgText);
    alert(msgText);
  }
  
  function onTxError(tx, err) {
    var msgText;
    
    if (err) {
      msgText = 'TX: ' + err.message + ' (' + err.code + ')';
    } else {
      msgText = 'TX: Unknown error';
    }
    
    console.error(msgText, tx, err);
    alert(msgText);
  }
  
  function onTxSuccess(callback) {
    //console.log('TX: success');
    
    if (callback) callback();
  }
  
  function onQuerySuccess(tx, result) {
    console.log('onQuerySuccess: ', result);
  }
    
  var getAllItems = function() {
//    console.log('getAllItems...');
//    console.log(theDB);
    var deferred = $q.defer();
    
    deferred.notify('Executing getAll()');
     
    openDatabase(function() {
      var sqlStr = "SELECT * FROM items ORDER BY name ASC";

      theDB.transaction(function(tx) {
        tx.executeSql(sqlStr, [], function(tx, result) {
          //console.log('success! ', result.rows); 
          
          deferred.resolve(result.rows);
        }, onSqlError);
      }, onTxError, onTxSuccess);      
    });
    
    return deferred.promise;
  };
  
  var getItemById = function(id) {
    console.log('getItemById(' + id + ')');
    
    var deferred = $q.defer();
    deferred.notify('Getting record with id ' + id);
        
    openDatabase(function() {
      console.log('db open, executing select...');
      var sqlStr = "SELECT * FROM items WHERE id = ?";
    
      theDB.transaction(function(tx) {
        tx.executeSql(sqlStr, [id], function(tx, result) {
          onQuerySuccess(tx, result);
          deferred.resolve(result.rows);
        }, onSqlError);
      }, onTxError, onTxSuccess);
    });
    
    return deferred.promise;
  };
  
  var insertItem = function(name, like, notes) {
    var deferred = $q.defer();
    
    deferred.notify('Executing insert()...');
    
    openDatabase(function() {
      var sqlStr = "INSERT INTO items (name, like, notes) VALUES (?, ?, ?)"; //'" + date + "', " + numberOfMiles + ", '" + notes + "')";

      theDB.transaction(function(tx) {
        tx.executeSql(sqlStr, [name, like, notes], function(tx, result) {
          onQuerySuccess(tx, result);
          deferred.resolve(result);
        }, onSqlError);
      }, onTxError, onTxSuccess);
    });
    
    return deferred.promise;
  };
  
  var updateItem = function(id, name, like, notes) {
    var deferred = $q.defer(),
        sqlStr = "UPDATE items SET name = ?, like = ?, notes = ? WHERE id = ?";
    
    deferred.notify('Executing update item() for ' + id);
    
    openDatabase(function() {
      theDB.transaction(function(tx) {
        tx.executeSql(sqlStr, [name, like, notes, id], function(tx, result) {
          onQuerySuccess(tx, result);
          deferred.resolve(result);
        }, onSqlError);
      }, onTxError, onTxSuccess);
    });
    
    return deferred.promise;
  };
  
  var deleteItem = function(id) {
    var deferred = $q.defer(),
        sqlStr = "DELETE FROM items WHERE id = ?";

    deferred.notify('Deleting ' + id);
    console.log('Deleting ' + id);
    
    openDatabase(function() {
      theDB.transaction(function(tx) {
        tx.executeSql(sqlStr, [id], function(tx, result) {
          onQuerySuccess(tx, result);
          deferred.resolve(result);
        }, onSqlError);
      }, onTxError, onTxSuccess);
    });
    
    return deferred.promise;
  };
  
  return {
    getAllItems: getAllItems,
    getItemById: getItemById,
    insertItem: insertItem,
    updateItem: updateItem,
    deleteItem: deleteItem
  };  
});
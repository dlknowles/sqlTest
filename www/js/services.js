angular.module('starter.services', [])

.factory('Database', function() {
  var theDB,
      dbName = 'mtDB',
      dbDisplayName = 'Mileage Tracker',
      dbSize = 3 * 1024 * 1024,
      dbVersion = '1.0';
      
  function openDatabase(callback) {
    if (!theDB) {
      theDB = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
      //console.log(theDB);

      theDB.transaction(createTable, onTxError, function() { onTxSuccess(callback); });
    }
  }
    
  function createTable(tx) {
    console.log(tx);
    var sqlStr = 'CREATE TABLE IF NOT EXISTS MILEAGE (tripDate INT, miles INT, notes TEXT)';
    
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
    
    console.error(msgText);
    alert(msgText);
  }
  
  function onTxSuccess(callback) {
    //console.log('TX: success');
    
    if (callback) callback();
  }
  
  function onQuerySuccess(tx, result) {
    console.log('onQuerySuccess: ', result);
    return result;
  }
    
  var getAll = function() {
    var retVal;
    
    (function() {
      openDatabase(function() {
        var sqlStr = "SELECT * FROM MILEAGE ORDER BY tripDate ASC";

        theDB.transaction(function(tx) {
          tx.executeSql(sqlStr, [], function(tx, result) {
            console.log('success! ', result.rows);
            retVal = result.rows;

            //return result; 
          }, onSqlError);
        }, onTxError, onTxSuccess);      
      });
    })();
    
    return retVal;
  };
  
  var getById = function(id) {
    
  };
  
  var save = function(id, date, numberOfMiles, notes) {
    
  };
  
  var insert = function(date, numberOfMiles, notes) {
    console.log('inserting');
    console.log('date: ' + date);
    console.log('numberOfMiles: ' + numberOfMiles);
    console.log('notes: ' + notes);
    var sqlStr = "INSERT INTO MILEAGE (tripDate, miles, notes) VALUES ('" + date + "', " + numberOfMiles + ", '" + notes + "')";

    theDB.transaction(function(tx) {
      tx.executeSql(sqlStr, [], function(tx, result) {
        return onQuerySuccess(tx, result);
      }, onSqlError);
    }, onTxError, onTxSuccess);
  };
  
  return {
    getAll: getAll,
    getById: getById,
    save: save,
    insert: insert
  };
  
});
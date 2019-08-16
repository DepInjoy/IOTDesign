var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/iot';

function MongoPersistence(){
}

MongoPersistence.prototype.insert = function(payload){
    "use strict";
    MongoClient.connect(url, { useNewUrlParser : true }, function (error, db) {
        console.log("Connect to server successfully!");
        var dbo = db.db("iot");
        var insertDocument = function(db, callback){
            var colName = "document";
            dbo.createCollection(colName, function (error, res) {
               if(error) throw error;
                var collection = dbo.collection(colName);
                collection.insertOne(payload, function (error, result) {
                    callback(result);
                });
            });
        };
        insertDocument(db, function () {
            db.close();
        });
    });
};

MongoPersistence.prototype.find = function(queryOptions, queryCB){
    'use strict';
    MongoClient.connect(url, { useNewUrlParser : true }, function (error, db) {
        if(error){
            console.error("Error: connect to MongoDB URL(" + url);
        }
        var findDocuments = function (db ,query, callback) {
            var colName = "document";
            var dbo = db.db("iot");
            var collection = dbo.collection(colName);
            if(collection){
                collection.find(query).toArray(function (mongoError, objects) {
                    if(mongoError){
                        console.error("Error: find(" + query);
                    }
                    callback(objects);
                });
            }
        };
        findDocuments(db, queryOptions, function (result) {
            db.close();
            queryCB(result);
        });
    });
};

MongoPersistence.prototype.update = function(payload){
    'use strict';
    MongoClient.connect(url, { useNewUrlParser : true }, function (error, db){
        if(error){
            console.error("Error: connect to MongoDB URL(" + url);
        }
        var updateDocument = function (db, callback) {
            var colName = "document";
            var dbo = db.db("iot");
            var collection = dbo.collection(colName);
            collection.updateOne({user: payload.user}, {$set: {led: payload.led}}, function (error, result) {
                if(error){
                    console.error("Error: Update " + "in collection(" + collection + " with " + payload + " failed");
                }
                callback();
            });
        };
        updateDocument(db, function () {
            db.close();
        })
    });
};

MongoPersistence.prototype.findOrder = function(queryOptions, order, queryCB){
    'use strict';
    MongoClient.connect(url, { useNewUrlParser : true }, function (error, db) {
        if (error) {
            console.error("Error: connect to MongoDB URL(" + url);
        }
        var findDocuments = function (db, query, callback) {
            var dbo = db.db("iot");
            var collection = dbo.collection("document");
            collection.find(query).limit(1).skip(order).toArray(function (mongoError, result) {
                if(mongoError){
                    console.error("Error: findOrder with query(" + query +
                        + ") and order(" + order + " failed, " + mongoError);
                }
                callback(result);
            });
        };
        findDocuments(db, queryOptions, function (result) {
            db.close();
            queryCB(result);
        });
    });
};
module.exports = MongoPersistence;
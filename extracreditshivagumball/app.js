#!/bin/env node
//  OpenShift sample Node application
// var express = require('express');
// var fs      = require('fs');
//var mongoose= require('mongoose');

var express=require("express");
var crypto=require("crypto");
var fs=require("fs");

var handlebars  = require('express3-handlebars');
var hbs = handlebars.create();
var MongoClient = require('mongodb').MongoClient;
//var DB=require("mongodb").Db;
// var DB_Connection=require("mongodb").Connection;
// var DB_Server=require("mongodb").Server;
// var async=require('async');

/**
 *  Define the sample application.
 */
var SampleApp = function() {
    var body;
    var ts;
    var state,text,hmac,hash;
    var secretKey = "kwRg54x2Go9iEdl49jFENRM12Mp711QI" ;
    
    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */
    
   
    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' ,'gumball.html':''};
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
         self.zcache['gumball.html'] = fs.readFileSync('./views/gumball.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };
    


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };
        
        self.routes['/hello'] = function(req,res){
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello OpenShift world!');
        };
        
        self.routes['/gumball'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('./views/gumball.html') );
        };
  
        self.routes['/'] = function(req, res) {
            self.handle_get(req,res);
        };
        
        self.routes['/InsertQuarter'] = function(req, res) {
         //   self.handle_post(req,res);
         self.handle_post(req,res);
        };
    };

self.get_hash = function( state, ts ) {

    // http://nodejs.org/api/crypto.html#crypto_crypto_createhmac_algorithm_key
    text = state + "|" + ts + "|" + secretKey ;
    hmac = crypto.createHmac("sha256", secretKey);
    hmac.setEncoding('base64');
    hmac.write(text);
    hmac.end() ;
    hash = hmac.read();
    //console.log( "HASH: " + hash )
    return hash ;

};


self.error = function( req, res, msg, ts ) {

    var result = {} ;
    state = "error" ;
    hash = self.get_hash( state, ts ) ;

    result.msg = msg ;
    result.ts = ts ;
    result.hash = hash ;
    result.state = state ;

    res.render('gumball', {
        state: result.state,
        ts: result.ts,
        hash: result.hash,
        message: result.msg
    });

};




self.page=function(req,res,state,ts){
   console.log("i ma here in page function");
  var db_user="shivadeepthi";
  var db_pwd="ND1109$$";
  var db_host="ds043210.mongolab.com";
  var db_port="43210";
  var db_name="cmpelab281";
  MongoClient.connect("mongodb://"+db_user+":"+db_pwd+"@"+db_host+":"+db_port+"/"+db_name, function(err, db) {
  if(err) { 
      return console.dir(err); 
      
  }else{
           console.log("connected");
           db.collection('gumball',function(err,collection){
           collection.find({serialNumber:'1234998871109'}).toArray(function(err,results){
            var data=results[0];
            console.log("data"+data);
            var rec_id=data.id;
            console.log("record feteched"+rec_id);
            var result={};
            hash=self.get_hash(state,ts);
            console.log(state);
            
            console.log(data);
            var count=data.countGumballs;
            console.log("count"+count);
            var msg="\n\nMighty Gumball, Inc.\n\nNodeJS-Enabled Standing Gumball\nModel# " + 
                                data.modelNumber + "\n" +
                                "Serial# " + data.serialNumber + "\n" +
                                "\n" + state +"\n" ;
            result.msg=msg;
            result.ts=ts;
            result.hash=hash;
            result.state=state;
            
            res.render("gumball",{
                state:result.state,
                ts:result.ts,
                hash:result.hash,
                message:result.msg
            });
        });
    });
  
}
      
  });
};

self.order=function(req,res,state,ts){
  console.log("i ma here in order function");
  var db_user="shivadeepthi";
  var db_pwd="ND1109$$";
  var db_host="ds043210.mongolab.com";
  var db_port="43210";
  var db_name="cmpelab281";
  MongoClient.connect("mongodb://"+db_user+":"+db_pwd+"@"+db_host+":"+db_port+"/"+db_name, function(err, db) {
  if(err) { 
      return console.dir(err); 
      
  }else{
            console.log("connected to db");
            db.collection('gumball',function (err,collection) {
            collection.find({serialNumber:'1234998871109'}).toArray(function(err,results){
            var data=results[0];
            var rec_id=data.id;
            console.log("record feteched"+rec_id);
            var count=data.countGumballs;
            if(count>0){
                count--;
                collection.update({id:rec_id},{$set:{countGumballs:count}},function(err,result){
                    console.log("count after"+count);
                    //self.page(req,req,state,ts);
                var result1={};
            hash=self.get_hash(state,ts);
            console.log(state);
            console.log(data);
            var count=data.countGumballs;
            console.log("count"+count);
            var msg="\n\nMighty Gumball, Inc.\n\nNodeJS-Enabled Standing Gumball\nModel# " + 
                                data.modelNumber + "\n" +
                                "Serial# " + data.serialNumber + "\n" +
                                "\n" + state +"\n" ;
            result1.msg=msg;
            result1.ts=ts;
            result1.hash=hash;
            result1.state=state;
            
            res.render("gumball",{
                state:result1.state,
                ts:result1.ts,
                hash:result1.hash,
                message:result1.msg
            });
                });
            }else{
                self.error(req,res,"out of inventory");
            }
       });
    });
  }
});
};

self.handle_post = function (req, res, next) {

    console.log( "Post: " + "Action: " +  req.body.event + " State: " + req.body.state + "\n" ) ;
    var hash1 = "" + req.body.hash ;
    var state = "" + req.body.state ;
    var action = "" + req.body.event ;
    var ts = parseInt(req.body.ts,10) ;
    var now = new Date().getTime() ;
    var diff = ((now - ts)/1000) ;
    var hash2 = self.get_hash ( state, ts ) ;
    console.log( "DIFF:  " +  diff ) ;
    console.log( "HASH1: " + hash1 ) ;
    console.log( "HASH2: " + hash2 ) ;

    if ( diff > 120 || hash1 != hash2 ) {
        self.error( req, res, "*** SESSION INVALID ***", ts ) ;
    }
    else if ( action == "Insert Quarter" ) {
        if ( state == "no-coin" )
            self.page( req, res, "has-coin", ts ) ;
        else
            self.page( req, res, state, ts ) ;
            
    }
    else if ( action == "Turn Crank" ) {
        if ( state == "has-coin" ) {
            hash = self.get_hash ( "no-coin", ts ) ;
            self.order(req, res, "no-coin", ts ) ;
        }
        else
            self.page( req, res, state, ts ) ;
    }  
  
};
 self.handle_get = function (req, res) {
     console.log( "Get: ..." ) ;
     ts = new Date().getTime();
     console.log( ts );
     state = "no-coin" ;
     console.log("request"+req+"response"+res+"state"+state+"ts"+ts);
     self.page( req, res, state, ts ) ;
 };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
         self.createRoutes();
        self.app = express.createServer();
        self.app.use(express.bodyParser());
       self.app.use("/images", express.static(__dirname + '/images'));
      self.app.post("*", self.handle_post);
      self.app.engine('handlebars', hbs.engine);
     self.app.set('view engine', 'handlebars');
        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        var port=process.env.OPENSHIFT_NODEJS_PORT||8080;
        var ip=process.env.OPENSHIFT_NODEJS_IP||"127.0.0.1";
        self.app.listen(port, ip, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ip, port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();


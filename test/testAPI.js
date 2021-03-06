"use strict";
/**
 * Suite of API tests. 
 *
 * Create by sdiemert on 2016-05-01
 */

var assert = require('assert');
var st  = require("supertest");
var util = require('util');

describe("API Tests", function () {

    var api = null;
    var obj = null;
    var server = null;

    beforeEach(function(done){

        obj = {
            last : {x: 1, y: 1, c: 1, pass: false},
            board: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
            size : 3
        };

        server = require('../app.js')(true);
        api = st('http://localhost:3000');
        done(); 

    });
    
    afterEach(function(done){
        api = null;
        obj = null; 
        server.close(done); 
    });

    describe("/", function () {

        it("should echo the input", function (done) {
            api.post("/")
                .send(obj)
                .expect(200)
                .end(function(err, res){
                    assert.equal(err, null);
                    assert.deepEqual(res.body, {x : 1, y : 1, c : 1, pass : false});
                    done(err);
                });
        });

        it("should fail on incorrect input", function (done) {

            delete obj.last.x;
            
            api.post("/")
                .send(obj)
                .expect(400)
                .end(function(err, res){
                    done(); 
                });
        });
        
    });
    
    describe("/ai/random", function(){
        
         it("should return a valid move", function (done) {
            api.post("/ai/random")
                .send(obj)
                .expect(200)
                .end(function(err, res){
                    assert.equal(err, null);
                    assert(res.body.x < obj.size);
                    assert(res.body.x >= 0);
                    assert(res.body.y < obj.size);
                    assert(res.body.y >= 0);
                    assert.equal(res.body.c, 2);
                    assert.equal(res.body.pass, false);
                    done(err);
                });
        });
        
        it("should fail on incorrect input", function(done){
            
            obj.board = [[0,0,0]];

            api.post("/ai/random")
                .send(obj)
                .expect(400)
                .end(function(err, res){
                    done(); 
            });
            
        });
        
    });

    describe("/ai/maxLibs", function(){
        
         it("should return a valid move", function (done) {
            api.post("/ai/maxLibs")
                .send(obj)
                .expect(200)
                .end(function(err, res){
                    assert.equal(err, null);
                    assert(res.body.x < obj.size);
                    assert(res.body.x >= 0);
                    assert(res.body.y < obj.size);
                    assert(res.body.y >= 0);
                    assert.equal(res.body.c, 2);
                    assert.equal(res.body.pass, false);
                    done(err);
                });
        });
        
        it("should fail on incorrect input", function(done){
            
            obj.board = [[0,0,0]];

            api.post("/ai/maxLibs")
                .send(obj)
                .expect(400)
                .end(function(err, res){
                    done(); 
            });
            
        });
        
    });
    
    describe("/util/findArmies", function(){
        
         it("should return a valid output", function (done) {
            api.post("/util/findArmies")
                .send(obj)
                .expect(200)
                .end(function(err, res){
                    var armies = res.body.armies;
                    assert.equal(err, null);
                    assert(armies.length == 1);
                    assert(armies[0].colour == 1);
                    assert(armies[0].size == 1);
                    assert(armies[0].liberties.length == 4);
                    assert(armies[0].tokens[0].colour == 1);  
                    assert.deepEqual(armies[0].tokens[0].position, [1,1]);
                    assert(armies[0].tokens[0].liberties.length == 4);
                    done(err);
                });
        });
        
        it("should fail on incorrect input", function(done){
            
            obj.board = [[0,0,0]];

            api.post("/util/findArmies")
                .send(obj)
                .expect(400)
                .end(function(err, res){
                    done(); 
            });
            
        });
        
    });

});
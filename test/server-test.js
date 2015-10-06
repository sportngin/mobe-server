'use strict';

// import the moongoose helper utilities to fix race condition
var request = require('supertest');
var should = require('should')
var server = require('../server')
var api = server.server;


describe("POST /mobe/response/register", function () {
  it('responds with JSON', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({'status': 'success', 'message': 'response registered at: GET:/test/path'})
      .end(done)
  });

  it('the body gets put in registerdMocks', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .end()

    server.registeredMocks['GET:/test/path'].response.should.equal('{"word":"test"}')
    server.registeredMocks['GET:/test/path'].path.should.equal('/test/path')
    server.registeredMocks['GET:/test/path'].method.should.equal('GET')
    server.registeredMocks['GET:/test/path'].statusCode.should.equal('200')
    done();
  });

  it('should respond correctly with the registered url', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .end( function () {
        request(api)
          .get('/test/path')
          .set('Accept', 'application/json')
          .end( function (err, res) {
            res.text.should.equal('{"word":"test"}')
            res.statusCode.should.equal(200)
            done()
          })
      })

  });

});


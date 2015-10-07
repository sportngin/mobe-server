'use strict';

var request = require('supertest');
require('should')
var server = require('../server')
var api = server.server;


describe("POST /mobe/response/register", function () {

  it('the body gets put in registerdMocks', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        server.registeredMocks['GET:/test/path'].response.should.equal('{"word":"test"}');
        server.registeredMocks['GET:/test/path'].path.should.equal('/test/path');
        server.registeredMocks['GET:/test/path'].method.should.equal('GET');
        server.registeredMocks['GET:/test/path'].statusCode.should.equal('200');
        done();
      });
  });

  it('should respond correctly with the registered url', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .get('/test/path')
          .set('Accept', 'application/json')
          .expect('{"word":"test"}')
          .expect(200)
          .end(done)
      });
  });
});

describe("POST /mobe/response/unregister", function () {
  it('the body gets removed from unregisterMocks', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/mobe/response/unregister')
          .send({'method': 'GET', 'path': '/test/path'})
          .end(function () {
            server.registeredIntercepts.hasOwnProperty('GET:/test/path').should.be.false();
            done();
          });
      });
  });

  it('should not respond with the unregistered url', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/mobe/response/unregister')
          .send({'method': 'GET', 'path': '/test/path'})
          .end(function () {
            request(api)
              .get('/test/path')
              .set('Accept', 'application/json')
              .expect(404)
              .end(done);
          });
      });
  });
});

describe("POST /mobe/intercept/register", function () {

  it('the body gets put in interceptedMocks', function (done) {
    request(api)
      .post('/mobe/intercept/register')
      .send({'method': 'POST', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        server.registeredIntercepts['POST:/test/path'].response.should.equal('{"word":"test"}');
        server.registeredIntercepts['POST:/test/path'].path.should.equal('/test/path');
        server.registeredIntercepts['POST:/test/path'].method.should.equal('POST');
        server.registeredIntercepts['POST:/test/path'].statusCode.should.equal('200');
        done();
      });

  });

  it('should respond correctly with the registered url', function (done) {
    request(api)
      .post('/mobe/intercept/register')
      .send({'method': 'POST', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/test/path')
          .set('Accept', 'application/json')
          .expect('{"word":"test"}')
          .expect(200)
          .end(done);
      });
  });
});

describe("POST /mobe/intercept/unregister", function () {

  it('the body gets removed from unregisterMocks', function (done) {
    request(api)
      .post('/mobe/intercept/register')
      .send({'method': 'POST', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/mobe/intercept/unregister')
          .send({'method': 'POST', 'path': '/test/path'})
          .end(function () {
            server.registeredIntercepts.hasOwnProperty('POST:/test/path').should.be.false();
            done();
          });
      });
  });

  it('should not respond with the unregistered url', function (done) {
    request(api)
      .post('/mobe/intercept/register')
      .send({'method': 'POST', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/mobe/intercept/unregister')
          .send({'method': 'POST', 'path': '/test/path'})
          .end(function () {
            request(api)
              .post('/test/path')
              .set('Accept', 'application/json')
              .expect(404)
              .end(done)
          });
      });
  });
});

describe("POST /mobe/intercept/get", function () {
  it("receives a response after registered", function (done) {
    request(api)
      .post('/mobe/intercept/register')
      .send({'method': 'POST', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/test/path')
          .send({'getIntercept': 'test'})
          .set('Accept', 'application/json')
          .end(function () {
            request(api)
              .post('/mobe/intercept/get')
              .send({'method': 'POST', 'path': '/test/path'})
              .set('Accept', 'application/json')
              .expect(
              {
                '1': {
                  'response': {
                    'getIntercept': 'test'
                  },
                  'statusCode': 200,
                  'method': 'POST',
                  'path': '/test/path'
                }
              }
            )
              .end(function () {
                server.interceptedRequests.hasOwnProperty('POST:/test/path').should.be.false();
                done();
              });
          });
      });
  });
  it("is added to interceptedRequests", function (done) {
    request(api)
      .post('/mobe/intercept/register')
      .send({'method': 'POST', 'path': '/test/path', 'statusCode': '200', 'response': '{"word":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/test/path')
          .send({'getIntercept': 'test'})
          .set('Accept', 'application/json')
          .end(function () {
            server.interceptedRequests['POST:/test/path'].length.should.equal(1);
            done();
          })
      });
  });
});

describe('POST /mobe/response/unregister_all', function () {
  it('removes all registered mocks', function (done) {
    request(api)
      .post('/mobe/response/register')
      .send({'method': 'GET', 'path': '/test/one', 'statusCode': '200', 'response': '{"one":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/mobe/response/register')
          .send({'method': 'GET', 'path': '/test/two', 'statusCode': '200', 'response': '{"two":"test"}'})
          .set('Accept', 'application/json')
          .end(function () {
            request(api)
              .post('/mobe/response/unregister_all')
              .set('Accept', 'application/json')
              .end(function () {
                setTimeout(function () {
                  Object.keys(server.registeredMocks).length.should.equal(0)
                }, 2000)
                done();
              });
          });
      });
  });
});

describe('POST /mobe/intercepts/unregister_all', function () {
  it('removes all registered intercepts', function (done) {
    request(api)
      .post('/mobe/intercept/register')
      .send({'method': 'POST', 'path': '/test/one', 'statusCode': '200', 'response': '{"one":"test"}'})
      .set('Accept', 'application/json')
      .end(function () {
        request(api)
          .post('/mobe/intercept/register')
          .send({'method': 'POST', 'path': '/test/two', 'statusCode': '200', 'response': '{"two":"test"}'})
          .set('Accept', 'application/json')
          .end(function () {
            request(api)
              .post('/mobe/intercept/unregister_all')
              .set('Accept', 'application/json')
              .end(function () {
                setTimeout(function () {
                  Object.keys(server.registeredMocks).length.should.equal(0)
                }, 2000)
                done();
              });
          });
      });
  });
});

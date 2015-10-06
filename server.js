var express = require('express');
var log = require('log-util');
var argv = require('minimist')(process.argv.slice(2));

var server = express();


var main = function (argv) {
  var port = Number(argv.port) || 8000;
  log.setLevel(argv.log || 'info');
  log.info('MOBE launced on port:', port)
};


var mockAPI = function (req, res, next) {
  if (req.path == '/mock/response/register') {
    registerMockResponse(req.body)
    log.info('Registered Mock Response: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'response registered at: ' + methodPath(req.body)})

  } else if (req.path == '/mock/intercept/set') {
    registerIntercept(req.body)
    log.info('Registered Intercept: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'intercept registered at: ' + methodPath(req.body)})

  } else if (req.path == '/mock/intercept/get') {
    getIntercept(req.body)
    log.info('Returned Intercept: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'intercept returned at: ' + methodPath(req.body)})

  } else if (req.path == '/mock/response/unregister') {
    unregisterMockResponse(req.body)
    log.info('Unregistered Mock Response: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'response unregistered at: ' + methodPath(req.body)})

  } else if (req.path == '/mock/intercept/unregister') {
    unregisterIntercept(req.body)
    log.info('Unregistered Intercept: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'intercept unregistered at: ' + methodPath(req.body)})

  } else if (isIntercept(req.body)) {
    //Push to interceptedRequests
  } else if (isMockResponse(req.body)) {
    //Return status code and response
  } else {
    log.info('Missing Path: ' + req.method + ' ' + req.path)
    return next();
  }
};

function isMockResponse(body) {
  return registeredMocks.hasOwnProperty(methodPath(body))
};

function isIntercept(body) {
  return registeredIntercepts.hasOwnProperty(methodPath(body))
};

function registerMockResponse(body) {
  registeredMocks[methodPath(body)] = body
};

function unregisterMockResponse(body) {
  delete registeredMocks[methodPath(body)];
};

function getIntercept(body) {
};

function unregisterIntercept(body) {
};

function registerIntercept(body) {

};

function methodPath(body) {
  return body.method + ':' + body.url;
}

var registeredIntercepts = {};
var registeredMocks = {};
var interceptedRequests = {};

server.use(mockAPI);

main(argv);

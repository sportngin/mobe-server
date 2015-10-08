var express = require('express');
var log = require('log-util');
var argv = require('minimist')(process.argv.slice(2));
var bodyParser = require('body-parser');

var server = exports.server = express();

var main = function (argv) {
  var port = Number(argv.port) || 8000;
  server.listen(port);
  log.setLevel(argv.log || 'info');
  log.info('MOBE launched on port:', port)
};

var mockAPI = function (req, res, next) {
  if (req.path == '/mobe/response/register') {
    registerMockResponse(req.body);
    res.send({'status': 'success', 'message': 'response registered at: ' + methodPath(req.body)});
    log.info('Registered Mock Response: ' + methodPath(req.body));

  } else if (req.path == '/mobe/intercept/register') {
    registerIntercept(req.body);
    res.send({'status': 'success', 'message': 'intercept registered at: ' + methodPath(req.body)});
    log.info('Registered Intercept: ' + methodPath(req.body));

  } else if (req.path == '/mobe/intercept/get') {
    res.send(getIntercept(req.body));
    log.info('Returned Intercept: ' + methodPath(req.body));

  } else if (req.path == '/mobe/response/unregister') {
    unregisterMockResponse(req.body);
    res.send({'status': 'success', 'message': 'response unregistered at: ' + methodPath(req.body)});
    log.info('Unregistered Mock Response: ' + methodPath(req.body));

  } else if (req.path == '/mobe/intercept/unregister') {
    unregisterIntercept(req.body);
    res.send({'status': 'success', 'message': 'intercept unregistered at: ' + methodPath(req.body)});
    log.info('Unregistered Intercept: ' + methodPath(req.body));

  } else if (req.path == '/mobe/intercept/unregister_all') {
    registeredIntercepts = {};
    interceptedRequests = {};
    res.send({'status': 'success', 'message': 'all intercepts unregistered'});
    log.info('Unregistered All Intercepts');

  } else if (req.path == '/mobe/response/unregister_all') {
    registeredMocks = {};
    res.send({'status': 'success', 'message': 'all mock responses unregistered'});
    log.info('Unregistered All Mock Responses');

  } else if (isIntercept(req)) {
    addInterceptedRequest(req);

    var mockData = registeredIntercepts[methodPath(req)];
    res.statusCode = mockData.statusCode;
    res.send(mockData.response);
    log.info('Intercepted Path: ' + methodPath(req));

  } else if (isMockResponse(req)) {
    var mockData = registeredMocks[methodPath(req)];
    res.statusCode = mockData.statusCode;
    res.send(mockData.response);
    log.info('Responded With Body for Path: ' + methodPath(req));

  } else {
    res.statusCode = 404
    res.send();
    log.warn('Missing Path: ' + methodPath(req));
    return next();
  }
};

function isMockResponse(body) {
  if (body) {
    return registeredMocks.hasOwnProperty(methodPath(body));
  } else {
    return false
  }
}

function isIntercept(body) {
  if (body) {
    return registeredIntercepts.hasOwnProperty(methodPath(body));
  } else {
    return false;
  }
}

function registerMockResponse(body) {
  registeredMocks[methodPath(body)] = body;
}

function unregisterMockResponse(body) {
  delete registeredMocks[methodPath(body)];
}

function getIntercept(body) {
  var intercept = interceptedRequests[methodPath(body)];
  delete interceptedRequests[methodPath(body)];
  return intercept;
}

function unregisterIntercept(body) {
  delete registeredIntercepts[methodPath(body)];
  delete interceptedRequests[methodPath(body)];
}

function registerIntercept(body) {
  registeredIntercepts[methodPath(body)] = body;
}

function addInterceptedRequest(req) {
  var size;
  if (interceptedRequests.hasOwnProperty(methodPath(req))) {
    size = interceptedRequests[methodPath(req)].length + 1;
  } else {
    interceptedRequests[methodPath(req)] = [];
    size = 1;
  }
  interceptedRequests[methodPath(req)].push({
    'index': size,
    'method': req.method,
    'path': req.url,
    'result': req.body
  })
}

function methodPath(body) {
  return body.method + ':' + (body.originalUrl === undefined ? body.path : body.originalUrl);
}

var registeredIntercepts = exports.registeredIntercepts = {};
var registeredMocks = exports.registeredMocks = {};
var interceptedRequests = exports.interceptedRequests = {};

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
server.use(mockAPI);

main(argv);

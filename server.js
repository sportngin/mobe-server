var express = require('express');
var log = require('log-util');
var argv = require('minimist')(process.argv.slice(2));
var bodyParser = require('body-parser');

var server = express();

var main = function (argv) {
  var port = Number(argv.port) || 8000;
  server.listen(port);
  log.setLevel(argv.log || 'info');
  log.info('MOBE launched on port:', port)
};

var mockAPI = function (req, res, next) {
  if (req.path == '/mock/response/register') {
    registerMockResponse(req.body)
    log.info('Registered Mock Response: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'response registered at: ' + methodPath(req.body)});

  } else if (req.path == '/mock/intercept/set') {
    registerIntercept(req.body)
    log.info('Registered Intercept: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'intercept registered at: ' + methodPath(req.body)});

  } else if (req.path == '/mock/intercept/get') {
    getIntercept(req.body)
    log.info('Returned Intercept: ' + methodPath(req.body))
    res.send(getIntercept(req.body));

  } else if (req.path == '/mock/response/unregister') {
    unregisterMockResponse(req.body)
    log.info('Unregistered Mock Response: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'response unregistered at: ' + methodPath(req.body)});

  } else if (req.path == '/mock/intercept/unregister') {
    unregisterIntercept(req.body)
    log.info('Unregistered Intercept: ' + methodPath(req.body))
    res.send({'status': 'success', 'message': 'intercept unregistered at: ' + methodPath(req.body)});

  } else if (isIntercept(req)) {
    //Push to interceptedRequests
    addInterceptedRequest(req);

    var mockData = registeredIntercepts[methodPath(req)]
    res.statusCode = mockData.statusCode;
    res.send(mockData.response);

  } else if (isMockResponse(req)) {
    //Return status code and response
    var mockData = registeredMocks[methodPath(req)]
    res.statusCode = mockData.statusCode;
    res.send(mockData.response);
  } else {
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
};

function isIntercept(body) {
  if (body) {
    return registeredIntercepts.hasOwnProperty(methodPath(body));
  } else {
    return false
  }
};

function registerMockResponse(body) {
  registeredMocks[methodPath(body)] = body;
};

function unregisterMockResponse(body) {
  delete registeredMocks[methodPath(body)];
};

function getIntercept(body) {
  return interceptedRequests[methodPath(body)];
};

function unregisterIntercept(body) {
  delete registeredIntercepts[methodPath(body)];
};

function registerIntercept(body) {
  registeredIntercepts[methodPath(body)] = body;
};

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
    'statusCode': req.statusCode,
    'result': req.body
  })
};

function methodPath(body) {
  return body.method + ':' + body.path;
};

var registeredIntercepts = {};
var registeredMocks = {};
var interceptedRequests = {};

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
server.use(mockAPI);

main(argv);

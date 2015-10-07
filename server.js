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
    log.info('Registered Mock Response: ' + methodPath(req.body));
    res.send({'status': 'success', 'message': 'response registered at: ' + methodPath(req.body)});

  } else if (req.path == '/mobe/intercept/register') {
    registerIntercept(req.body);
    log.info('Registered Intercept: ' + methodPath(req.body));
    res.send({'status': 'success', 'message': 'intercept registered at: ' + methodPath(req.body)});

  } else if (req.path == '/mobe/intercept/get') {
    getIntercept(req.body);
    log.info('Returned Intercept: ' + methodPath(req.body));
    res.send(getIntercept(req.body));

  } else if (req.path == '/mobe/response/unregister') {
    unregisterMockResponse(req.body);
    log.info('Unregistered Mock Response: ' + methodPath(req.body));
    res.send({'status': 'success', 'message': 'response unregistered at: ' + methodPath(req.body)});

  } else if (req.path == '/mobe/intercept/unregister') {
    unregisterIntercept(req.body);
    log.info('Unregistered Intercept: ' + methodPath(req.body));
    res.send({'status': 'success', 'message': 'intercept unregistered at: ' + methodPath(req.body)});

  } else if (req.path == '/mobe/intercept/unregister_all') {
    registeredIntercepts = {};
    log.info('Unregistered All Intercepts');
    res.send({'status': 'success', 'message': 'all intercepts unregistered'});


  }else if (req.path == '/mobe/response/unregister_all') {
    registeredMocks = {};
    log.info('Unregistered All Mock Responses');
    res.send({'status': 'success', 'message': 'all mock responses unregistered'});


  } else if (isIntercept(req)) {
    addInterceptedRequest(req);

    var mockData = registeredIntercepts[methodPath(req)];
    log.info('Intercepted Path: ' + methodPath(req));
    res.statusCode = mockData.statusCode;
    res.send(mockData.response);

  } else if (isMockResponse(req)) {
    var mockData = registeredMocks[methodPath(req)];
    log.info('Responded With Body for Path: ' + methodPath(req));
    res.statusCode = mockData.statusCode;
    res.send(mockData.response);

  } else {
    log.warn('Missing Path: ' + methodPath(req));
    res.statusCode = 404
    res.send();
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
  if (body) {
    delete registeredMocks[methodPath(body)];
  } else {
    registeredMocks = {};
  }
}

function getIntercept(body) {
  var intercept = interceptedRequests[methodPath(body)];
  delete interceptedRequests[methodPath(body)];
  return intercept;
}

function unregisterIntercept(body) {
  if (body) {
    delete registeredIntercepts[methodPath(body)];
  } else {
    registeredIntercepts = {};
  }
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
    'statusCode': req.statusCode,
    'result': req.body
  })
}

function methodPath(body) {
  return body.method + ':' + body.path;
}

var registeredIntercepts = exports.registeredIntercepts = {};
var registeredMocks = exports.registeredMocks = {};
var interceptedRequests = exports.interceptedRequests = {};

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
server.use(mockAPI);

main(argv);

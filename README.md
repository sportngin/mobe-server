MOBE [![Build Status](https://travis-ci.org/TIMBERings/mobe-server.svg)](http://travis-ci.org/TIMBERings/mobe-server)
=====

MOBE (/mō-bē /) stands for **M**ock **O**ut **B**ack **E**nd.  It is inspired by [MSL](http://finraos.github.io/MSL/).  This tool allows a user to unit test the front end without relying on a back end, making tests faster and more reliable.  It also allows to test API contracts.


Releases
==========
[Release 0.0.7](https://www.npmjs.com/package/mobe-server)

Contributing
==============
Thank you for taking the time to contribute. 

MOBE follows the [Contributer Code of Conduct](http://contributor-covenant.org/version/1/2/0/).  By creating a pull request, an issue, or commenting in the mobe-server repository, you agree to those terms.

If you want to contribute, here's how:

* Create a GitHub account
* Submit a ticket in GitHub project
  * I will assign you to the ticket once the ticket is approved.
* Fork the repository in GitHub
* Make your changes
* Test your code
  * npm test
* Make a pull request
* Include reference to the ticket
* After review, the pull request will be merged to the master

All communication will happen within GitHub.  Please log defects or enhancements as issues.

Installing MOBE Server
========================
Local install

```bash
npm install mobe-server
```

Global install

```bash
npm install -g mobe-server
```

Starting MOBE Server
======================
If you installed it locally:

```bash
./node_modules/msl-server/src/bin/mobe [options]
```

If you installed it globally:

```bash
mobe [options]
```

Options for MOBE Server:

* --port =>  the port that server will be listening on local host, default is 8000.
* --log =>  what log level to output to the console, default is info.  
  * Options include 'verbose', 'debug', 'info', 'warn', and 'error'.
 
Example:
```bash
mobe --port=8001 --log=warn
```

API
====================
Mock Response - Structure to respond to a request with mock data

Intercept - Structure to intercept a request to view the request body.  Sends a response after the intercept.

**Actions**
* Register Mock Response
  * /mobe/response/register
  * Params:
    * host - String
    * port - Integer
    * configuration - JSON with keys:
      * method - String
      * path - String
      * response - String
      * statusCode - String
* Unregister Mock Response
  * mobe/response/unregister
  * Params:
    * host - String
    * port - Integer
    * configuration - JSON with keys:
      * method - String
      * path - String
* Unregister all responses
  * /mobe/response/unregister_all
  * Params:
    * host - String
    * port - Integer
* Register an Intercept
  * /mobe/intercept/register
  * Params:
    * host - String
    * port - Integer
    * configuration - JSON with keys:
      * method - String
      * path - String
      * response - String
      * statusCode - String
* Get a Request Interception
  * /mobe/intercept/get
  * Params:
    * host - String
    * port - Integer
    * configuration - JSON with keys:
      * method - String
      * path - String
* Unregister an Intercept
  * /mobe/intercept/unregister
  * Params:
    * host - String
    * port - Integer
    * configuration - JSON with keys:
      * method - String
      * path - String
* Unregister all Intercepts
  * /mobe/intercept/unregister_all
  * Params:
    * host - String
    * port - Integer



Ruby Client
=============
Include 'mobe-client' in your Gemfile, `gem mobe-client`, or `gem install mobe-client`.


License Type
==============
MOBE project is licensed under [The MIT License](https://raw.githubusercontent.com/TIMBERings/mobe-server/master/LICENSE).

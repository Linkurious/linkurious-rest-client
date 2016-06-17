# linkurious-rest-client

**A javascript library to simplify interactions with Linkurious server.**

The library is used by Linkurious SAS in the Linkurious Entreprise v2 for all the communication
with the Linkurious server.

## Installing linkurious-rest-client

* If it's not already done, install node (>4.0.0) following this link : https://nodejs.org/en/download/
* Clone the project : `git clone git@github.com:Linkurious/linkurious-rest-client.git`
* Run the `install` command : `npm install`

This command will download all the dependencies and typescripts definitions necessary to
use or build the library.

## Technical requirements
All modern web browsers are supported.

In node environment, use Node.js 4.0.0+.

## Build and use the library

> Linkurious-rest-client is compatible with **typescript**, **ES6** or **ES5** environments.

To compile the library, use the following command :
```
npm run build
```
* A folder called `dist-es6` will be produced to use the library in an ES6 environment.
* A file called `linkurious-rest-client-es5.js` will be produced for use directly in the browser.

**_1) Typescript environment_**

Linkurious-rest-client library is develop using [typescript](http://www.typescriptlang.org/). You
 can use it directly in your typescript project :

```javascript
import Linkurious = require('linkurious-rest-client');
```

**_2) ES6 environment_**

The ES6 generated code use **commonjs**. So you can use it with node or in the browser using a
module bundler like [webpack](https://webpack.github.io/) or [browserify](http://browserify.org/) :

```javascript
const Linkurious = require('linkurious-rest-client');
```

**_3) ES5 environment_**

The library is also compilated to be used directly in the browser :

```html
<script src="./linkurious-rest-client-es5.js"/>
```

## First steps

For every environments, you can interact with the linkurious-server by invoking the
rest-client and use its methods :

The Linkurious class takes 4 parameters :
* The linkurious server host (ex: 'http://127.0.0.1:8080')
* The log level ('quiet', 'error' or 'debug')
* The logger methods (optional) if you want to use your proper logger library
* the HTTP methods (optional) if you want to use your proper HTTP library

The `state` object will return the current user connected and the current dataSource connected.

*example :*
> For this exemple we use [Bunyan logging module](https://github.com/trentm/node-bunyan) to show
how to use another logging library.

```javascript
let linkurious = new Linkurious('127.0.0.1:8080', 'debug', {debug:bunyan.debug, error:bunyan.error});

// log the user to linkurious server and set the default datasource (the first datasource connected)
linkurious.init({
  usernameOrEmail : 'user_id',
  password : 'user_password'
}).then(() => {
  console.log(linkurious.state); // state : user info + first connected datasource infos
});

```

## Generate the documentation

To view the documentation, run this command line :
```
npm run doc
```
Open the `index.html` file (located in the newly created `docs` folder) in your favorite browser.

## Run tests

To run tests, use this command line :

```
npm test
```

## Getting help / submit an issue

The easiest way is to [file an issue](https://github
.com/Linkurious/linkurious-rest-client/issues) with the following informations :

* A step-by-step process to reproduce the bug or hurdle
* A screenshot / console output
* The version of your web browser, or version of Node.js

## External dependencies

Linkurious-rest-client use two dependencies to work properly in all environment :

* [es6-promise polyfill](https://github.com/stefanpenner/es6-promise)
* [superagent](https://github.com/visionmedia/superagent)

## License
[MIT](https://opensource.org/licenses/MIT)


## Authors
* Maxime Allex([maxime@linkurio.us](maxime@linkurio.us))
* David Rapin([david@linkurio.us](david@linkurio.us))

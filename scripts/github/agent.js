const request = require('request');

function GitHubAgent(ownerName, repoName, apiKey, host, port) {
  this.ownerName = ownerName;
  this.repoName = repoName;
  this.apiKey = apiKey;
  this.host = host || 'api.github.com';
  this.port = port || 443;
}

GitHubAgent.prototype = {
  /**
   * Get an URL relative to the current repo
   *
   * @param {string} [path]
   * @returns {string} an URL
   */
  repoUrl: function(path) {
    var prefix = `https://${this.host}/repos/${this.ownerName}/${this.repoName}/`;

    if (path.indexOf(prefix) === 0) {
      return path;
    } else {
      return prefix + path;
    }
  },

  req: function(method, url, query, body) {
    var options = {
      url: this.repoUrl(url),
      method: method,
      query: query,
      body: body,
    };

    var self = this;

    return self._request(options);
  },

  get: function(url, parameters) {
    return this.req('get', url, parameters);
  },

  post: function(url, parameters) {
    return this.req('post', url, undefined, parameters);
  },

  put: function(url, parameters) {
    return this.req('put', url, undefined, parameters);
  },

  patch: function(url, parameters) {
    return this.req('patch', url, undefined, parameters);
  },

  /**
   * @param {object} options
   * @param {string} [options.url] expected response status
   * @param {string} [options.method] used HTTP request method
   * @param {object} [options.body] the post/put body, send as JSON
   * @param {object} [options.query] the query string arguments
   * @returns {Promise.<object|Error>}
   */
  _request: function(options) {
    var self = this;
    return new Promise(function(resolve, reject) {
      var requestOptions = {
        method: options.method,
        uri: options.url,
        body: options.body,
        qs: options.query,
        json: true,
        headers: {
          'User-Agent': 'Github-Agent',
          Accept: 'application/vnd.github.v3+json',
        },
      };
      if (self.apiKey) {
        requestOptions.auth = {
          pass: 'x-oauth-basic',
          user: self.apiKey,
        };
      }

      self._getPage(requestOptions, resolve, reject);
    });
  },

  _getPage: function(options, resolve, reject, bodyAcc) {
    var self = this;

    request(options, function(err, res) {
      if (err) {
        console.error(err);
        reject(err);
      }

      let body = res.body;
      let code = res.statusCode;
      let url = res.headers.link && res.headers.link.match(/^<([^>]+)>; rel="next"/);

      if (code >= 500 && code <= 599) {
        throw new Error(`HTTP code 500 returned`);
      }

      if (url) {
        var nextUrl = url[1];
        options.uri = nextUrl;

        if (!bodyAcc) bodyAcc = [];

        if (body instanceof Array) {
          bodyAcc = bodyAcc.concat(body);
        } else {
          bodyAcc.push(body);
        }

        self._getPage(options, resolve, reject, bodyAcc);
      } else {
        if (bodyAcc) {
          if (body instanceof Array) {
            body = bodyAcc.concat(body);
          } else {
            bodyAcc.push(body);
            body = bodyAcc;
          }
        }

        resolve({ body, code });
      }
    });
  },
};

module.exports = GitHubAgent;

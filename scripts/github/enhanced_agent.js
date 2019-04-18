const path = require('path');
const fs = require('fs');
const request = require('request');

const GitHubAgent = require('./agent');
const STATIC_INFO = require('./static_info');

const API_KEY = STATIC_INFO.apiKey;
const OWNER = STATIC_INFO.owner;
const HOST = 'api.github.com';
const PORT = 443;

class EnhancedGitHubAgent extends GitHubAgent {
  constructor(repository) {
    super(OWNER, repository, API_KEY, HOST, PORT);

    this._logsEnabled = false;
  }

  _createBranch(name) {
    this._log(`Creating branch "${name}"...`);

    return this.get('git/refs/heads/master')
      .then(({ code, body }) => {
        return body.object.sha;
      })
      .then((sha) => {
        return this.post('git/refs', {
          ref: `refs/heads/${name}`,
          sha: sha,
        });
      });
  }

  setLogsEnabled(value) {
    this._logsEnabled = value;
  }

  _log(msg) {
    if (this._logsEnabled) {
      console.log(msg);
    }
  }

  /**
   * http://www.levibotelho.com/development/commit-a-file-with-the-github-api
   */
  pushFiles(parameters) {
    let { branch = 'master', message = 'Automated commit.', files = [] } = parameters;

    let fileTree = files.map(({ path, content }) => ({
      path: path,
      content: content,
      mode: '100644',
      type: 'blob',
    }));

    this._log(`Checking branch "${branch}"...`);
    return this.get(`git/refs/heads/${branch}`)
      .then(({ code, body }) => {
        if (code === 404) {
          return this._createBranch(branch);
        } else {
          return { code, body };
        }
      })
      .then((result) => {
        this._log(`Retrieving last commit...`);

        return this.get(result.body.object.url);
      })
      .then((result) => {
        let commit = result.body;
        let treeSha = commit.tree.sha;
        let commitSha = commit.sha;

        this._log(`Creating new tree...`);

        let tree = this.post('git/trees', {
          base_tree: treeSha,
          tree: fileTree,
        });

        return Promise.all([commitSha, tree]);
      })
      .then(([commitSha, result]) => {
        let tree = result.body;

        this._log('Committing tree...');

        return this.post('git/commits', {
          message: message,
          tree: tree.sha,
          parents: [commitSha],
        });
      })
      .then((result) => {
        let commit = result.body;

        this._log('Pushing...');

        return this.patch(`git/refs/heads/${branch}`, {
          sha: commit.sha,
          force: true,
        });
      })
      .then(() => {
        this._log('Done!');
      });
  }

  uploadRelease({ tag_name, name, body, prerelease, zipName, zipPath }) {
    return this.post('releases', { tag_name, name, body, prerelease }).then(({ body, code }) => {
      if (code === 422) {
        throw new Error(`release "${tag_name}" already exists`);
      }

      const release = body;
      const stats = fs.statSync(zipPath);
      const options = {
        port: PORT,
        url: release['upload_url'].replace('{?name,label}', ''),
        qs: { name: zipName },

        auth: {
          pass: 'x-oauth-basic',
          user: API_KEY,
        },
        headers: {
          'User-Agent': `${OWNER}-Release-Agent`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/zip',
          'Content-Length': stats.size,
        },
      };

      return new Promise((resolve) => {
        fs.createReadStream(zipPath).pipe(
          request.post(options, function(err, res) {
            if (err) {
              throw err;
            } else if (res.statusCode !== 201) {
              throw new Error(`Upload failed with HTTP code ${res.statusCode}`);
            } else {
              resolve();
            }
          })
        );
      });
    });
  }

  getMilestones({ state } = {}) {
    this._log('Retrieving milestones...');

    return this.get('milestones', { state }).then(({ body }) => body);
  }

  getIssues({ state, milestone } = {}) {
    this._log('Retrieving issues...');

    return this.get('issues', { state, milestone }).then(({ body }) => body);
  }

  getReleases() {
    return this.get('releases').then(({ body }) => body);
  }
}

module.exports = EnhancedGitHubAgent;

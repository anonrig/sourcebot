'use strict';

const request = require('request-promise');
const SlackWebSocket = require('./ws.js');
const debug = require('debug')('slack:core');

class SlackCore {
  /**
   * @constructor
   */
  constructor(opts) {
    debug('Initialize');
    this.domain = 'https://slack.com/api/';
    this.token = opts && opts.token;
  }


  /**
   * Connects to Slack Web API.
   *
   * @returns {Promise}
   */
  connect() {
    const url = this.domain + 'rtm.start';

    if (!this.token)
      return new Promise((resolve, reject) => reject('Token is missing.'))

    debug('Connect request sent');

    return request({
        method: 'POST',
        uri: url,
        form: {
          token: this.token
        },
        json: true
      })
      .then((response) => {
        if (!response.ok) {
          debug('Connect request failed due to', response.error.message);
          throw new Error(response.error.message)
        }

        return new SlackWebSocket(response.url);
      })
  }
}

module.exports = SlackCore;

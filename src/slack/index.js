'use strict';

const Request = require('./request');
const SlackWebSocket = require('./ws.js');
const Promise = require('bluebird');
const debug = require('debug')('slack:core');

class SlackCore {
  /**
   * @constructor
   */
  constructor(opts) {
    if (opts.debug) process.env.DEBUG = 'slack:*';

    debug('Initialize');
    
    this.request = new Request(opts && opts.token);
    this.token = opts && opts.token;
  }


  /**
   * Connects to Slack Web API.
   *
   * @returns {Promise}
   */
  connect() {
    let that = this;
    const url = this.domain + 'rtm.start';

    if (!this.token)
      return new Promise((resolve, reject) => reject('Token is missing.'))

    debug('Connect request sent');

    return this
      .request.rtmStart()
      .then((response) => {
        if (!response.ok) {
          debug('Connect request failed due to', response.error.message);
          throw new Error(response.error.message)
        }

        return new SlackWebSocket(response.url, that.request);
      })
  }

  /**
   * Returns Request object to query Slack's API.
   *
   * @returns {Request}
   */
  requestSlack() {
    return this.request;
  }
}

module.exports = SlackCore;

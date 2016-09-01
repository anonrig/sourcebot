'use strict';


const request = require('request-promise');
const _ = require('lodash');


class Request {
  /**
   * @constructor
   */
  constructor(token) {
    this.token = token;
    this.apiUrl = 'https://slack.com/api/'
  }


  /**
   * Requests Slack Web API.
   * @private
   */
  request_(opts) {
    opts = _.merge(opts, {
      form: {
        token: this.token
      },
      json: true
    })

    return request(opts)
  }


  /**
   * @param {string} channel Channel ID.
   * @returns {Promise}
   */
  getChannelInfo(channel) {
    return this.request_({
      method: 'POST',
      uri: this.apiUrl + '/channels.info',
      form: {
        channel: channel
      }
    });
  }


  /**
   * @param {string} user User ID.
   * @returns {Promise}
   */
  getUserInfo(user) {
    return this.request_({
      method: 'POST',
      uri: this.apiUrl + '/users.info',
      form: {
        user: user
      }
    });
  }


  /**
   * @returns {Promise}
   */
  rtmStart() {
    return this.request_({
      method: 'POST',
      uri: this.apiUrl + '/rtm.start'
    });
  }


  /**
   * Post a message to a channel, even DM.
   */
  openDirectMessageChannel(user) {
    return this.request_({
      method: 'POST',
      uri: this.apiUrl + '/im.open',
      form: {
        user: user
      }
    });
  }
}

module.exports = Request;

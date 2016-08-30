'use strict';

const WebSocket = require('ws');
const debug = require('debug')('slack:websocket');
const EventEmitter = require('events');

class SlackWebSocket {
  /**
   * @constructor
   */
  constructor(url) {
    debug('Initialize');

    this.url = url;
    this.messageCount = 1;
    this.eventEmitter = new EventEmitter();

    return this.connect()
      .then((response) => {
        debug('Established connection');

        this.listenAllEvents_();

        return new Promise(resolve => resolve(this));
      });
  }


  /**
   * @private
   */
  listenAllEvents_() {
    let that = this;

    this.websocket.on('message', (raw) => {
      let response = JSON.parse(raw);

      that.eventEmitter.emit(response.type, response);
    });
  }


  /**
   * Listens Slack's Real Time Messaging API for specific message.
   */
  listen(message, callback) {
    if (!message) return reject(new Error('Message is missing to listen.'));

    debug('Listening for message ' + message);

    this.eventEmitter.on('message', (response) => {
      if ((new RegExp(response.text, 'i')).test(message)) {
        callback(response);
      }
    })
  }


  /**
   * Sends a message to specific channel.
   *
   * @returns {Promise}
   */
  send(opts) {
    let that = this;

    opts.id = this.messageCount;
    opts.type = 'message';

    return new Promise((resolve, reject) => {
      debug('Send message initialize');
      this.websocket.send(JSON.stringify(opts), (err) => {
        if (err) {
          debug('Send message failed due to', err.message);
          return reject(err);
        }

        that.messageCount += 1;

        debug('Send message successful');
        resolve();
      });
    })
  }


  /**
   * Returns socket instance.
   *
   * @returns {Object}
   */
  getSocketInstance() {
    return this.websocket;
  }


  /**
   * Connects to Slack's Real Time Messaging API.
   *
   * @returns {Promise}
   */
  connect() {
    this.websocket = new WebSocket(this.url);

    return new Promise((resolve, reject) => {
      this.websocket.on('open', (response) => {
        resolve();
      });
    });
  }


  /**
   * Disconnects from server.
   *
   * @returns {Promise}
   */
  disconnect() {
    let that = this;

    return new Promise((resolve, reject) => {
      this.websocket.close((err) => {
        if (err) {
          debug('Connection close failed due to', err.message);
          return reject(err);
        }

        that.eventEmitter.removeAllListeners();

        debug('Connection closed.');
        resolve();
      });
    });
  }
}

module.exports = SlackWebSocket;

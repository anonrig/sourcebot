'use strict';

const WebSocket = require('ws');
const debug = require('debug')('slack:websocket');
const EventEmitter = require('events');
const Promise = require('bluebird');
const _ = require('lodash');
const Conversation = require('./conversation');

class SlackWebSocket {
  /**
   * @constructor
   */
  constructor(url) {
    debug('Initialize');

    this.url = url;
    this.messageCount = 1;
    this.eventEmitter = new EventEmitter();
    this.conversations = [];

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
    if (!message) return (new Error('Message is missing to listen.'));

    debug('Listening for message ' + message);

    this.eventEmitter.on('message', (response) => {
      debug('Message received');

      //Used 2 if-else if statement to increase readability.
      if (typeof message == 'string' && (response.text).match(new RegExp('.*\\b' + message + '\\b.*', 'i'))) {
        //Searches for the word inside the string/sentence.
        callback(response);
      } else if (message instanceof RegExp && message.test(response.text)) {
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


  startConversation(user, channel) {
    const conversationExist = _.findIndex(this.conversations, (item) => {
      return item.user == user && item.channel == channel;
    });

    if (conversationExist != -1) return Promise.reject(new Error('Conversation exist'));

    this.conversations.push({
      user: user,
      channel: channel,
      conversation: new Conversation(this.websocket, user, channel)
    });

    return Promise.resolve(_.last(this.conversations).conversation);
  }
}

module.exports = SlackWebSocket;

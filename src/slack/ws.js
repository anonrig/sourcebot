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
   *
   * @params {String} url
   * @params {Request} request class instance.
   */
  constructor(url, request, retryCount) {
    debug('Initialize');

    this.request = request;
    this.url = url;
    this.messageCount = 1;
    this.eventEmitter = new EventEmitter();
    this.conversations = [];
    this.retryCount = retryCount;

    return this.connect()
      .then(() => {
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
    that.retriedCount = 0;

    this.websocket.on('message', (raw) => {
      debug('Listening for incoming messages.');
      let response = JSON.parse(raw);

      if (response.type == 'reconnectUrl')
        return that.url = response.url;

      that.eventEmitter.emit(response.type, response);
    });

    this.websocket.on('ping', (data, flags) => {
      this.eventEmitter.emit('ping', data, flags);
    });

    this.websocket.on('pong', (data, flags) => {
      this.eventEmitter.emit('pong', data, flags);
    });
    this.websocket.on('close', (err) => {
      debug('Connection lost initiating reconnect.');
      that.eventEmitter.emit('disconnect');

      if (that.retryCount > that.retriedCount) {
        debug('Trying to reconnect.');
        that.connect();
        that.retriedCount += 1;
      } else {
        debug('Cannot reconnect after ', that.retriedCount, 'trials.');
        that.eventEmitter.emit('reconnectFailed');
      }
    });
  }


  onDisconnect(cb) {
    this.eventEmitter.on('disconnect', () => {
      cb();
    });
  }


  onReconnectFailed(cb) {
    this.eventEmitter.on('reconnectFailed', () => {
      cb();
    })
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
      this.websocket.on('open', () => {
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


  /**
   * Starts a conversation, if not-exist.
   *
   * @returns {Promise}
   */
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


  /**
   * Creates a private conversation between a user.
   *
   * @returns {Promise}
   */
  startPrivateConversation(user) {
    return this.request
      .openDirectMessageChannel(user)
      .then((response) => {
        if (!response.ok) return Promise.reject(new Error('Failed to create a private conversation.'));

        const channel = response.channel.id;

        return this.startConversation(user, channel);
      });
  }


  /**
   * Fires on incoming ping.
   * @param {Function} callback
   */
  onPing(callback) {
    let that = this;
    this.eventEmitter.on('ping', (data, flags) => {
      that.pong(data, flags);
      callback(data, flags);
    });
  }


  /**
   * Fires on incoming pong
   * @param {Function} callback
   */
  onPong(callback) {
    this.eventEmitter.on('pong', callback);
  }


  /**
   * Sends a ping. data is sent, options is an object with members mask and binary.
   * @param data
   * @param {Object} options
   */
  ping(data, options) {
    this.websocket.ping(data || null, options || null);
  }


  /**
   * Sends a pong. data is sent, options is an object with members; mask and binary.
   * @param data
   * @param {Object} options
   */
  pong(data, options) {
    this.websocket.pong(data || null, options || null);
  }
}

module.exports = SlackWebSocket;

'use strict';

const request = require('request-promise');
const Promise = require('bluebird');
const EventEmitter = require('events');
const debug = require('debug')('slack:conversation');
const _ = require('lodash');

class Conversation {

  /**
   * @Constructor
   */
  constructor (websocket, user, channel) {
    debug('Initialize conversation.');
    this.websocket = websocket;
    this.eventEmitter = new EventEmitter();
    this.messageCount = 1;
    this.user = user;
    this.channel = channel;
    this.listen_()
  }


  destroy () {
    this.eventEmitter.removeAllListeners();
  }


  /**
   * @private
   * Listens the channel for user message.
   */
  listen_ () {
    let that = this;

    debug('Listening for user message.');
    this.websocket.on('message', (raw) => {
      let response = JSON.parse(raw);

      if (response.user == that.user)
        that.eventEmitter.emit(response.type, response);
    });
  }


  say (message) {
    let that = this;

    const opts = {
      id: this.messageCount,
      type: 'message',
      channel: this.channel,
      text: message
    };

    return new Promise((resolve, reject) => {
      debug('Send message initialize');
      that.websocket.send(JSON.stringify(opts), (err) => {
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
   * Asks the question and waits for the answer
   * @returns {Promise}
   */
  ask(question) {
    let that = this;

    debug('Ask question to the user.');
    return this
      .say(question)
      .then(() => {
        return new Promise((resolve) => {
          debug('Wait for a response.');
          that.eventEmitter.once('message', (response) => {
            debug('Response received');
            resolve(response);
          });
        })
      });
  }


  /**
   * Asks an array of questions while waiting for the answer of each.
   * @returns {Promise}
   */
  askSerial(questions) {
    let that = this;
    return Promise.mapSeries(questions, (question) => {
      return that.ask(question)
        .then((response) => {
          return response;
        });
    });
  }

}

module.exports = Conversation;

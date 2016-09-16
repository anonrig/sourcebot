'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();

chai.use(sinonChai);
chai.use(chaiAsPromised);

const Promise = require('bluebird');
const EventEmitter = require('events');
const WSInstance = require('../../src/slack/ws');
const Request = require('../../src/slack/request');

let MockSocket = WSInstance;
MockSocket.prototype.connect = () => {
  return Promise.resolve(this);
};
MockSocket.prototype.listenAllEvents_ = () => {};

describe('Websocket', () => {
  beforeEach(() => {
    this.request = new Request('https://slack.com/api/');
  });

  it('should throw error on missing url or request instance', () => {
    const instance = new WSInstance();

    instance.should.be.rejected;
  });

  it('should throw error on missing request instance', () => {
    const instance = new WSInstance('https://github.com/sourcebot/sourcebot');

    instance.should.be.rejected;
  });

  it('should call connect once', () => {
    let instance = new MockSocket('ws://echo.websocket.org/', this.request);

    return instance.then((bot) => {
      sinon.spy(bot);
    })
  });
});

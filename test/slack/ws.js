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

describe('Websocket Properties', () => {
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
});

describe('Websocket Connection', () => {
  beforeEach(() => {
    this.request = new Request('https://slack.com/api/');
    this.instance = new WSInstance('ws://echo.websocket.org/', this.request);
  });

  it('should have a valid ws instance', () => {
    return this.instance
      .connect()
      .then((bot) => {
        bot.websocket.should.exist;
      });
  });
});

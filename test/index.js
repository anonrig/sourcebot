'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();

chai.use(sinonChai);
chai.use(chaiAsPromised);

const mainClass = require('../index');
const slackCore = require('../src/slack/index.js');

describe('SourceBot', () => {
  it('should offer slack class', () => {
    mainClass.Slack.should.exist;
    mainClass.Slack.should.deep.equal(slackCore);
  });
});

'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const SlackCore = require('../../src/slack/index');

describe('Core', () => {
  it('should enable debug mode', () => {
    let core = new SlackCore({debug: true});

    process.env.DEBUG.should.be.an('string');
    process.env.DEBUG.should.equal('slack:*');
  });

  it('should throw error on missing opts', () => {
    let core = new SlackCore();

    core.should.be.rejected;
  })

  it('should throw error on missing token', () => {
    let core = new SlackCore({});

    core.connect().should.be.rejected;
  });
});

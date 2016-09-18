'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const SlackCore = require('../../src/slack/index');
const Request = require('../../src/slack/request');

describe('Core', () => {
  beforeEach(() => {
    this.request = new Request('EXAMPLE_TOKEN');
  });

  it('should enable debug mode', () => {
    let core = new SlackCore({debug: true});

    process.env.DEBUG.should.be.an('string');
    process.env.DEBUG.should.equal('slack:*');
  });

  it('should throw error on missing opts', () => {
    const instance = () => {
      let core = new SlackCore();
    }

    instance.should.Throw(Error);
  })

  it('should throw error on missing token', () => {
    let core = new SlackCore({});

    core.connect().should.be.rejected;
  });

  it('should return a valid request class', () => {
    let instance = new SlackCore({
      token: 'EXAMPLE_TOKEN'
    });

    return instance.requestSlack().should.deep.equal(this.request);
  });
});

'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const Request = require('../../src/slack/request');

describe('Request', () => {
  beforeEach(() => {
    this.request = new Request('EXAMPLE_TOKEN');
    this.opts = {
      uri: 'https://github.com/sourcebot/sourcebot'
    };
  });

  it('should accept api token', () => {
    this.request.token.should.equal('EXAMPLE_TOKEN');
  });

  it('should have a private request function', () => {
    this.request.request_.should.exist;
  });

  it('should throw error on missing uri', () => {
    this.request.request_().should.be.rejected;
  });

  it('should accept valid uri', () => {
    this.request.request_(this.opts).should.be.resolved;
  });

  it('should merge optional parameters with existing ones', () => {
    this.request.request_(this.opts).uri.href.should.equal(this.opts.uri)
  });
});

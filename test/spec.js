import { expect } from 'chai';
import assert from 'assert';

import { createError, formatError } from '../dist';

const { AssertionError } = assert;

describe('createError', () => {
  context('when properly used', () => {
    it('returns an error that serializes properly', () => {
      const FooError = createError('FooError', {
        message: 'A foo error has occurred',
        data: {
          hello: 'world'
        },
        options: {
          showLocations: false,
          showPath: true,
        },
      });
      const iso = new Date().toISOString();
      const e = new FooError({
        message: 'A foo 2.0 error has occurred',
        data: {
          hello: 'world',
          foo: 'bar'
        },
        options: {
          showLocations: true,
          showPath: false,
        },
      });

      const { message, extensions: { name, time_thrown, data } } = e.serialize();
      expect(message).to.equal('A foo 2.0 error has occurred');
      expect(name).to.equal('FooError');
      expect(time_thrown).to.equal(e.time_thrown);
      expect(data).to.eql({
        hello: 'world',
        foo: 'bar'
      });
    });
  });
  context('when missing a config as the second parameter', () => {
    it('throws an assertion error with a useful message', () => {
      try {
        createError('FooError');
        throw new Error('did not throw as expected');
      } catch (err) {
        expect(err instanceof AssertionError).to.be.true;
        expect(err.message).to.equal('createError requires a config object as the second parameter');
      }
    });
  });
  context('when missing a message from the config object passed as the second parameter', () => {
    it('throws an assertion error with a useful message', () => {
      try {
        createError('FooError', {

        });
        throw new Error('did not throw as expected');
      } catch (err) {
        expect(err instanceof AssertionError).to.be.true;
        expect(err.message).to.equal('createError requires a "message" property on the config object passed as the second parameter')
      }
    });
  });
});

describe('formatError', () => {
  context('second parameter is not truthy', () => {
    context('error is not known', () => {
      it('returns the original error', () => {
        const e = new Error('blah');
        expect(formatError(e, false)).to.equal(e);
      });
    });
    context('error is known', () => {
      it('returns the serialized form of the real error', () => {
        const FooError = createError('FooError', {
          message: 'A foo error has occurred'
        });

        const e = new FooError({
          message: 'A foo 2.0 error has occurred',
          data: {
            oh: 'shit'
          }
        });
        const s = formatError({
          originalError: e
        }, false);

        expect(s).to.eql(e.serialize());
      });
    });
  });
  context('second parameter is truthy', () => {
    context('error is not known', () => {
      it('returns null', () => {
        const e = new Error('blah');
        expect(formatError(e, true)).to.be.null;
      });
    });
    context('error is known', () => {
      it('returns the real error', () => {
        const FooError = createError('FooError', {
          message: 'A foo error has occurred'
        });

        const e = new FooError();

        const s = formatError({
          originalError: e
        }, true);

        expect(s).to.eql(e.serialize());
      });
    });
  });
});

import { expect } from 'chai';

import { createError, formatError } from '../dist';

describe('createError', () => {
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
        foo: 'bar'
      },
      options: {
        showLocations: true,
        showPath: false,
      },
    });

    const { message, name, time_thrown, data } = e.serialize();

    expect(message).to.equal('A foo 2.0 error has occurred');
    expect(name).to.equal('FooError');
    expect(time_thrown).to.equal(e._time_thrown);
    expect(data).to.eql({
      hello: 'world',
      foo: 'bar'
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
          message: e.message
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
          message: e.message
        }, true);

        expect(s).to.eql(e.serialize());
      });
    });
  });
});

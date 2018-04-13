# apollo-errors
Machine-readable custom errors for Apollostack's GraphQL server

[![NPM](https://nodei.co/npm/apollo-errors.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/apollo-errors/)

[![CircleCI](https://circleci.com/gh/thebigredgeek/apollo-errors.svg?style=shield)](https://circleci.com/gh/thebigredgeek/apollo-errors/tree/master)  [![Beerpay](https://beerpay.io/thebigredgeek/apollo-errors/badge.svg?style=beer-square)](https://beerpay.io/thebigredgeek/apollo-errors)  [![Beerpay](https://beerpay.io/thebigredgeek/apollo-errors/make-wish.svg?style=flat-square)](https://beerpay.io/thebigredgeek/apollo-errors?focus=wish)

## Example from Apollo Day

[![Authentication and Error Handling in GraphQL](https://img.youtube.com/vi/xaorvBjCE7A/0.jpg)](https://www.youtube.com/watch?v=xaorvBjCE7A)

## Installation and usage

Install the package:

```bash
npm install apollo-errors
```

Create some errors:

```javascript
import { createError } from 'apollo-errors';

export const FooError = createError('FooError', {
  message: 'A foo error has occurred'
});
```

Hook up formatting:

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import { formatError } from 'apollo-errors';
import { graphqlExpress } from 'apollo-server-express';
import schema from './schema';

const app = express();

app.use('/graphql',
  bodyParser.json(),
  graphqlExpress({
    formatError,
    schema
  })
);

app.listen(8080)
```

Throw some errors:

```javascript
import { FooError } from './errors';

const resolverThatThrowsError = (root, params, context) => {
  throw new FooError({
    data: {
      something: 'important'
    },
    internalData: {
      error: `The SQL server died.`
    }
  });
}
```

Witness glorious simplicity:

`POST /graphql (200)`

```json
{
  "data": {},
  "errors": [
    {
      "message":"A foo error has occurred",
      "name":"FooError",
      "time_thrown":"2016-11-11T00:40:50.954Z",
      "data":{
        "something": "important"
      }
    }
  ]
}
```

The `internalData` property is meant for data you want to store on the error object (e.g. for logging), but not send out to your end users.
You can utilize this data for logging purposes.

```js
import { isInstance as isApolloErrorInstance, formatError as formatApolloError } from 'apollo-errors';

function formatError(error) {
  const { originialError } = error;
  if (isApolloErrorInstance(originalError)) {
    // log internalData to stdout but not include it in the formattedError
    console.log(JSON.stringify({
      type: `error`,
      data: originalError.data,
      internalData: originalError.internalData
    }));
  }
  return formatApolloError(error)
}

``` 

## API

### ApolloError ({ [time_thrown: String, data: Object, internalData: object message: String ]})

Creates a new ApolloError object.  Note that `ApolloError` in this context refers
to an error class created and returned by `createError` documented below.  Error can be
initialized with a custom `time_thrown` ISODate (default is current ISODate), `data` object (which will be merged with data specified through `createError`, if it exists), `internalData` object (which will be merged with internalData specified trough `createError`) and `message` (which will override the message specified through `createError`).


### createError(name, {message: String, [data: Object, internalData: object, options: Object]}): ApolloError

Creates and returns an error class with the given `name` and `message`, optionally initialized with the given `data`, `internalData` and `options`.  `data` and `internalData` passed to `createError` will later be merged with any data passed to the constructor.

#### Options (default):

 - `showPath` *(false)*: Preserve the GraphQLError `path` data.
 - `showLocations` *(false)*:  Preserve the GraphQLError `locations` data.

### formatError (error, strict = false): ApolloError|Error|null
If the error is a known ApolloError, returns the serialized form of said error.

**Otherwise**, *if strict is not truthy*, returns the original error passed into formatError.

**Otherwise**, *if strict is truthy*, returns null.

### isInstance (error): Boolean
Returns true if the error is an instance of an ApolloError.  Otherwise, returns false


1.9.0 / 2018-04-17
==================

  * Feature: Added `internalData` property for non-serialized context data (@n1ru4l, #41)

1.8.0 / 2018-04-10
==================

  * Fix: Wrong and missing data being returned in errors (@thebigredgeek)
  * Fix: Reverted breaking change regarding spec compliance (@thebigredgeek)

1.7.1 / 2018-02-22
==================

  * Fix: less ambiguity around data type (@thebigredgeek)

1.7.0 / 2018-02-22
==================

  * Misc: Refactored in TypeScript (#19, #22, @iamdanthdev, @lakhansamani)
  * Fix: Fix createError interface post-typescript refactor (@thebigredgeek)
  * Fix: Fix showPath option to correctly toggle error path exposure regardless of showLocation state (@thebigredgeek)

1.5.1 / 2017-09-07
==================

  * Package: Added new keywords (@thebigredgeek)
  * Docs: Updated docs to reference [apollo-server](https://dev.apollodata.com/tools/apollo-server/setup.html) (@thebigredgeek) 

1.5.0 / 2017-08-29
==================

  * Fix: fixed syntax error for createError config parameter (@thebigredgeek)

1.4.0 / 2017-03-14
==================
  * Feature: (BREAKING) Rely on error.originalError and fail back to error for formatError rather than serializing body into message
  * Docs: Add docs for `isInstance`

1.3.0 / 2017-02-01
==================
  * Docs: Update README.md (@thebigredgeek)
  * Docs: Add Beerpay's badge (@thebigredgeek)
  * Docs: Added isInstance method

1.2.1 / 2016-12-07
==================
  * Fix: bug with overriding message serialization (@thebigredgeek)

1.2.0 / 2016-12-07
==================
  * Feature: Added option to override message when throwing error (@thebigredgeek)

1.1.0 / 2016-12-01
==================
  * Feature: Added option to show original locations and paths in error (#1, @scf4)

1.0.2 / 2016-11-11
==================
  * Fix: data serialization (@thebigredgeek)

1.0.1 / 2016-11-10
==================
  * Initial release (@thebigredgeek)

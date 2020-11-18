# @zikeji/hypixel

[![npm](https://img.shields.io/npm/v/@zikeji/hypixel)][npm]
[![npm bundle size](https://img.shields.io/bundlephobia/min/@zikeji/hypixel)][npm]
[![visit docs](https://img.shields.io/badge/docs-VuePress-green)][docs]
[![Snyk Vulnerabilities for npm package version](https://img.shields.io/snyk/vulnerabilities/npm/@zikeji/hypixel)][npm]
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@zikeji/hypixel)][npm]
[![GitHub license](https://img.shields.io/github/license/zikeji/node-hypixel)](https://github.com/zikeji/node-hypixel/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/zikeji/node-hypixel)][github]
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/zikeji/node-hypixel)][github]
[![GitHub issues](https://img.shields.io/github/issues/zikeji/node-hypixel)](https://github.com/zikeji/node-hypixel/issues)
[![Coveralls](https://img.shields.io/coveralls/github/zikeji/node-hypixel)](https://coveralls.io/github/zikeji/node-hypixel)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/zikeji/node-hypixel/release)][github]

[npm]: https://www.npmjs.com/package/@zikeji/hypixel
[github]: https://github.com/zikeji/node-hypixel
[docs]: https://node-hypixel.zikeji.com
[hypixel]: https://api.hypixel.net/

An unopinionated async/await API wrapper for [Hypixel's Public API][hypixel] developed in TypeScript complete with [documentation][docs], typed interfaces for all API responses, rate-limit handling, a few helpers, and support for undocumented endpoints.

The library aims to replicate the [Hypixel API][hypixel] as closely as possible, and as such won't alter the results, merely offering intellisense suggestions, rate-limit handling, and helpers.

## 2.0

As I mentioned previously in the readme, 1.X.X is not following semver (due to an oversight with semantic-releases). So breaking changes may only be a minor version change instead of a major version change.

However, for the most part at this time all I'm doing is adding new helpers and refining schema - I have 3 more helpers planned before I bump to 2.0. A SkyWars level & prestige helper, a SkyBlock collections helper, and a SkyBlock skills helper.

## Installation

Use [npm](https://www.npmjs.com) to install this library.

```bash
npm i --save @zikeji/hypixel
```

## Usage

```javascript
const { Client } = require("@zikeji/hypixel");
const client = new Client("API_KEY");
(async () => {
  const status = await client.status.uuid("20934ef9488c465180a78f861586b4cf"); // Minikloon
  console.log(status);
  // {"online": false}
  const stats = await client.watchdogstats();
  console.log(stats);
  // {watchdog_lastMinute: 1, staff_rollingDaily: 2609, watchdog_total: 5591714, watchdog_rollingDaily: 4213, …}
})();
```

## Contributing
If some API result isn't documented / typed out fully, please open an issue and I can add it ASAP. Otherwise, pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

All changes must ensure they pass eslint, tests, and that testing is updated to meet or exceed the previous coverage.

## Licenses

This projected is licensed under the MIT license. For additional details see [LICENSE](LICENSE).

This library contains derivative work based on classes from the [hypixel-php](https://github.com/Plancke/hypixel-php) library. Code that is derivative work of [hypixel-php](https://github.com/Plancke/hypixel-php) will be marked as such with a header comment. See [LICENSE-HYPIXEL-PHP.md](LICENSE-HYPIXEL-PHP.md) for additional details on the original license.
// Required to enable ES6 Modules in NodeJS
// https://www.wisdomgeek.com/development/web-development/javascript/how-to-import-export-es6-modules-in-node/
require = require("esm")(module/*, options*/);
module.exports = require("./semaphore.js");

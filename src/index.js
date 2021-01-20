const data = require("./utils/data.js");
const regex = require("./utils/regex.js");
const env = require("./utils/env.js");
const index = require("./utils/index.js");

module.exports = Object.assign(data, regex, env, index);

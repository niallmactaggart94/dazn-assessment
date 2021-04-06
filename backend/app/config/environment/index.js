
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const all = {

  /* istanbul ignore next */
  env: process.env.NODE_ENV || 'development',

  root: path.normalize(`${__dirname}/../../..`),

  port: process.env.PORT || 2020,

  ip: '0.0.0.0',

};

const envConfig = require(`./${all.env}.js`);

if (envConfig.server) {
  // use .toString() to ensure these are strings, errors happen if using __dirname
  envConfig.server.key = fs.readFileSync(envConfig.server.key.toString());
  envConfig.server.cert = fs.readFileSync(envConfig.server.cert.toString());
}

// Export the config object based on the NODE_ENV
//= =============================================
module.exports = _.merge(all, envConfig);

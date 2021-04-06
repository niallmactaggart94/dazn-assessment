const path = require('path');

module.exports = {
    server: {
        key: path.normalize(`${__dirname}/../../../certs/key.pem`),
        cert: path.normalize(`${__dirname}/../../../certs/cert.pem`),
    },
};

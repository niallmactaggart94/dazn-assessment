
/**
 * @file
 * @module Video Stream controller
 * @description Will return a video
 */

const express = require('express');
const controller = require('./videoStream.controller');
const router = express.Router();

/**
 * @name route GET
 * @function
 * @description Requests to get the contents of a video
 * @param {string} Route that following functions will be applied to
 */
router.get('/',
  controller.getVideo
);

/**
 * @name route GET
 * @function
 * @description Requests to get the list of current streams for a user
 * @param {string} Route that following functions will be applied to
 */
router.get('/streams',
    controller.getStreams
);

/**
 * @name route POST
 * @function
 * @description Requests to remove a clients session
 * @param {string} Route that following functions will be applied to
 */
router.post('/remove',
    controller.removeClientSession
);


/**
 * @name route ALL
 * @function
 * @description Will return a 404 if none of the above URLs are matched
 * @param {string} Route that following functions will be applied to
 */
router.all('/*', (req, res) => res.status(404).send({message: 'API Not Found'}));

module.exports = router;

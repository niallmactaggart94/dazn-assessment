const fs = require("fs");
const _ = require("lodash");
const errorHandler = require('../../helpers/errorHandler');
const sessionHandler = require('../../helpers/sessionHandler');

/**
 * @param app
 * @param userID
 * @description Function that will return the list of streams a current user is using
 * @returns {*} List of streams, or empty array
 */
const getUserSessions = (app, userID) => {
    const storage = app.get('users');
    const user = _.find(storage, (u) => u.id === userID);
    return _.get(user, 'streams', []);
}

/**
 * @param req
 * @param res
 * @description Function that will return the list from the function above
 * @returns {*} List of streams a user is currently using
 */
const getStreams = (req, res) => {
    if (!req.query.userID) {
        return errorHandler.sendError(res, 400, 'Requires user ID');
    }

    const streams = getUserSessions(req.app, req.query.userID);
    res.send(streams);
}

/**
 * @param req
 * @description Function that will return the request headers
 * @returns {*} Request headers
 */
const getRequestHeaders = (req) => {

    const range = req.headers.range;
    const userID = req.query.userID;
    const streamID = req.query.streamID;
    return { range, userID, streamID };

}

/**
 * @param req
 * @param res
 * @description Function that will check the body and then remove the session for that particular streamID
 */
const removeClientSession = async (req, res) => {

    const { userID, streamID } = JSON.parse(req.body);
    if (!userID || !streamID) {
        return errorHandler.sendError(res, 400, 'Requires user ID and the Stream ID');
    }

    sessionHandler.removeSession(req.app, userID, streamID);
    res.send({
        success: true
    })

}

/**
 * @param range
 * @description Function that will return the details for the video to be sent back
 * @returns {*} Video details
 */
const getVideoDetails = (range) => {
    const videoPath = `${__dirname}/bigbuck.mp4`;
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    return { videoPath, start, end, headers }
}

/**
 * @param req
 * @param res
 * @description Function that will return an error if there are two many streams, otherwise send a video back
 * @returns {*} Error or video
 */
const getVideo = (req, res) => {

    const { range, userID, streamID } = getRequestHeaders(req);

    if (!range || !userID || !streamID) {
        const message = !range ? "Requires Range header" : "Requires userID/streamID"
        return errorHandler.sendError(res, 400, message);
    }

    const { videoPath, start, end, headers } = getVideoDetails(range);
    const videoStream = fs.createReadStream(videoPath, {start, end});

    videoStream.on("open", async () => {

        const userSessions = getUserSessions(req.app, userID);
        if (userSessions.length >= 3 && !userSessions.includes(streamID)) {
            const message = `Too many requests for user ${userID}`;
            return res.status(429).send({ message });
        }

        sessionHandler.addSession(req.app, userID, streamID);
        res.writeHead(206, headers);
        videoStream.pipe(res);
    })

};


module.exports = {
    getVideo,
    getStreams,
    removeClientSession,
    getUserSessions,
    getRequestHeaders,
    getVideoDetails
};

function sendError(res, status, message) {
    res.status(status).send({message});
}
module.exports = {
    sendError
};

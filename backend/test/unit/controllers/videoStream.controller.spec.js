"use strict";

const httpMocks = require("node-mocks-http");
const ctrl = require("../../../app/controllers/videoStream/videoStream.controller");
const errorHandler = require('../../../app/helpers/errorHandler');
const sessionHandler = require('../../../app/helpers/sessionHandler');
const fs = require('fs');
let req, res, app;

jest.mock('../../../app/helpers/errorHandler', () => {
    return {
        sendError: jest.fn()
    }
});

jest.mock('../../../app/helpers/sessionHandler', () => {
    return {
        addSession: jest.fn(),
        removeSession: jest.fn()
    }
});

jest.mock('fs');

beforeEach(() => {
    app = {
        get: jest.fn(),
        set: jest.fn()
    }
    req = httpMocks.createRequest({
        query: {
            userID: '',
            streamID: ''
        },
        body: {},
        headers: {
            range: ''
        },
        app
    });

    res = httpMocks.createResponse();
    fs.statSync.mockImplementationOnce(() => {
        return {size: '50'}
    });

    spyOn(res, "send");

});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Controller: videoStream", function () {

    describe("Function: getUserSessions", () => {
        it("Should return an empty list if there are no users stored", () => {

            //Arrange
            app.get.mockImplementationOnce(() => []);

            //Act
            const result = ctrl.getUserSessions(app, '123456');

            //Assert
            expect(result).toEqual([])
        });

        it("Should return an empty list if it find a user but the ID does not match", () => {

            //Arrange
            const mockUser = { id: '123', streams: ['0a2752c1-254d-4326-a851-e54267523734']}
            app.get.mockImplementationOnce(() => [mockUser]);

            //Act
            const result = ctrl.getUserSessions(app, '123456');

            //Assert
            expect(result).toEqual([])
        });

        it("Should return the list of streams for a specific user, if present", () => {

            //Arrange
            const mockUser = { id: '123456', streams: ['0a2752c1-254d-4326-a851-e54267523734']}
            app.get.mockImplementationOnce(() => [mockUser]);

            //Act
            const result = ctrl.getUserSessions(app,'123456');

            //Assert
            expect(result).toEqual(['0a2752c1-254d-4326-a851-e54267523734'])
        });
    });

    describe("Function: getStreams", () => {
        it("Should send an error if there is no userID in the query", () => {

            //Act
            ctrl.getStreams(req, res);

            //Assert
            expect(errorHandler.sendError).toHaveBeenCalled();
        });

        it("Should return the outcome from the getUserSessions function if successful", () => {

            //Arrange
            req.query.userID = '123456'

            //Act
            ctrl.getStreams(req, res);

            //Assert
            expect(errorHandler.sendError).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith([]);
        });
    });

    describe("Function: getRequestHeaders", () => {
       it("Should return the headers in an object", () => {

           //Arrange
           req.headers.range = 'range';
           req.query.userID = '123456';
           req.query.streamID = '0a2752c1-254d-4326-a851-e54267523734';

           //Act
           const result = ctrl.getRequestHeaders(req);

           //Assert
           expect(result.range).toEqual('range');
           expect(result.userID).toEqual('123456');
           expect(result.streamID).toEqual('0a2752c1-254d-4326-a851-e54267523734');

       })
    });

    describe("Function: removeClientSession", () => {

        it ("Should parse the body and if there is no userID or streamID, send an error", () => {

            //Arrange
            req.body = JSON.stringify({});

            //Act
            ctrl.removeClientSession(req, res);

            //Assert
            expect(errorHandler.sendError).toHaveBeenCalled();

        });

        it("Should call the session handler to remove the session and then send a success body back", () => {
            //Arrange
            req.body = JSON.stringify({
                userID: '123456',
                streamID: '0a2752c1-254d-4326-a851-e54267523734'
            });

            //Act
            ctrl.removeClientSession(req, res);

            //Assert
            expect(sessionHandler.removeSession).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({
                success: true
            });
        });
    });

    describe("Function: getVideoDetails", () => {
       it("Should send back the video details in a json object", () => {

           //Arrange
           const range = 'bytes=9458761-';

           //Act
           const result = ctrl.getVideoDetails(range);

           //Assert
           expect(result.start).toBeDefined();
           expect(result.end).toBeDefined();
           expect(result.videoPath).toBeDefined();
           expect(result.headers).toBeDefined();
       });
    });

    describe("Function: getVideo", () => {

        it("Should send an error if no range is supplied", () => {

            //Act
            ctrl.getVideo(req, res);

            //Assert
            expect(errorHandler.sendError).toHaveBeenCalledWith(res, 400, 'Requires Range header');

        });

        it("Should send an error if no userID is supplied", () => {

            //Arrange
            req.headers.range = 'bytes=9458761-';

            //Act
            ctrl.getVideo(req, res);

            //Assert
            expect(errorHandler.sendError).toHaveBeenCalledWith(res, 400, 'Requires userID/streamID');
        });

        it("Should send an error if there are too many streams", async () => {
            //Arrange
            req.headers.range = 'bytes=9458761-';
            req.query.userID = '123456';
            req.query.streamID = '0a2752c1-254d-4326-a851-e54267523799';
            const user = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734', '0a2752c1-254d-4326-a851-e54267523724', '0a2752c1-254d-4326-a851-e54267523712']
            };

            app.get.mockImplementationOnce(() => [user]);

            fs.createReadStream.mockImplementationOnce(() => {
                return {
                    on: jest.fn().mockImplementationOnce(async (id, callback) => await callback())
                }
            })

            //Act
            ctrl.getVideo(req, res);

            //Assert
            expect(res._getStatusCode()).toEqual(429);

        });

        it("Should pipe the video if there are already 3 streams, but the ID is already in the list", () => {

            //Arrange
            req.headers.range = 'bytes=9458761-';
            req.query.userID = '123456';
            req.query.streamID = '0a2752c1-254d-4326-a851-e54267523734';
            const user = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734', '0a2752c1-254d-4326-a851-e54267523724', '0a2752c1-254d-4326-a851-e54267523712']
            };

            app.get.mockImplementationOnce(() => [user]);

            fs.createReadStream.mockImplementationOnce(() => {
                return {
                    on: jest.fn().mockImplementationOnce(async (id, callback) => await callback())
                }
            })

            //Act
            ctrl.getVideo(req, res);

            //Assert
            expect(res._getStatusCode()).toEqual(206);
        });

        it("Should pipe the video if there are enough streams", () => {

            //Arrange
            req.headers.range = 'bytes=9458761-';
            req.query.userID = '123456';
            req.query.streamID = '0a2752c1-254d-4326-a851-e54267523734';
            const user = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523712']
            };

            app.get.mockImplementationOnce(() => [user]);

            fs.createReadStream.mockImplementationOnce(() => {
                return {
                    on: jest.fn().mockImplementationOnce(async (id, callback) => await callback())
                }
            })

            //Act
            ctrl.getVideo(req, res);

            //Assert
            expect(res._getStatusCode()).toEqual(206);
        });

    });


});

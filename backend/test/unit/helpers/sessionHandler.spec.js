"use strict";

const httpMocks = require("node-mocks-http");
const _ = require('lodash');
const sessionHandler = require('../../../app/helpers/sessionHandler');
let app;


beforeEach(() => {
    app = {
        get: jest.fn(),
        set: jest.fn()
    }
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Session Handler", () => {
    describe("Function: addSession", () => {

        it("Should add the user to the storage if one does not exist", () => {

            //Arrange
            app.get.mockImplementationOnce(() => []);
            const newUser = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734']
            }
            const expectedResult = [newUser]

            //Act
            sessionHandler.addSession(app, '123456', '0a2752c1-254d-4326-a851-e54267523734');

            //Assert
            expect(app.set).toHaveBeenCalledWith('users', expectedResult);

        });
        it("Should add the user to the storage if a user exists but not with the same ID", () => {

            //Arrange
            const userOne = {
                id: '789456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734']
            }

            const newUser = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734']
            }
            app.get.mockImplementationOnce(() => [userOne]);


            const expectedResult = [userOne, newUser]

            //Act
            sessionHandler.addSession(app, '123456', '0a2752c1-254d-4326-a851-e54267523734');

            //Assert
            expect(app.set).toHaveBeenCalledWith('users', expectedResult);

        });

        it("Shouldnt add the stream ID if it already exists for a user", () => {

            //Arrange
            const existingUser = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734']
            }
            const expectedResult = [existingUser]
            app.get.mockImplementationOnce(() => expectedResult);


            //Act
            sessionHandler.addSession(app, '123456', '0a2752c1-254d-4326-a851-e54267523734');

            //Assert
            expect(app.set).toHaveBeenCalledWith('users', expectedResult);
        });

        it("Should add a different stream ID to the streams", () => {
            //Arrange
            const existingUser = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734']
            }

            const expectedResult = [{
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734', '0a2752c1-254d-4326-a851-e54267523727']
            }]

            app.get.mockImplementationOnce(() => [existingUser]);


            //Act
            sessionHandler.addSession(app, '123456', '0a2752c1-254d-4326-a851-e54267523727');

            //Assert
            expect(app.set).toHaveBeenCalledWith('users', expectedResult);
        })
    })

    describe("Function: removeSession", () => {
        it("Should store the same object if the user does not exist", () => {

            //Arrange
            const existingUser = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734']
            }

            const expectedResult = [existingUser]
            app.get.mockImplementationOnce(() => [existingUser]);


            //Act
            sessionHandler.removeSession(app, '98765', '0a2752c1-254d-4326-a851-e54267523734');

            //Assert
            expect(app.set).toHaveBeenCalledWith('users', expectedResult);
        });

        it("Should remove the stream if found in the users list", () => {

            //Arrange
            const existingUser = {
                id: '123456',
                streams: ['0a2752c1-254d-4326-a851-e54267523734']
            }

            const expectedUser = {
                id: '123456',
                streams: []
            }

            const expectedResult = [expectedUser]
            app.get.mockImplementationOnce(() => [existingUser]);


            //Act
            sessionHandler.removeSession(app, '123456', '0a2752c1-254d-4326-a851-e54267523734');

            //Assert
            expect(app.set).toHaveBeenCalledWith('users', expectedResult);
        });
    })

});
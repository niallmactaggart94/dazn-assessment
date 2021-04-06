const httpMocks = require("node-mocks-http");
const errorHandler = require('../../../app/helpers/errorHandler');
let res;


beforeEach(() => {

    res = httpMocks.createResponse();
    spyOn(res, "send");

});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Error Handler", () => {
    it("Should send the error message and status provided", () => {

        //Arrange
        const status = 400;
        const message = 'Error';

        //Act
        errorHandler.sendError(res, status, message);

        //Assert
        expect(res._getStatusCode()).toEqual(400);

    })
})

const OLD_ENV = process.env;

jest.mock("winston", () => ({
    format: {
        colorize: jest.fn(),
        combine: jest.fn(),
        label: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn(),
        json: jest.fn(),
        simple: jest.fn()
    },
    createLogger: jest.fn().mockReturnValue({
        debug: jest.fn(),
        log: jest.fn(),
        add: jest.fn()
    }),
    transports: {
        Console: jest.fn(),
        File: jest.fn()
    }
}));

beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
});

afterAll(() => {
    process.env = OLD_ENV;
});

describe("Logger", () => {
    it("Should exist - and add any logs to the console if its not production", () => {

        //Arrange/Act
        const logger = require('../../../app/helpers/logger');

        //Assert
        expect(logger.add).toHaveBeenCalled();
        expect(logger).toBeDefined();

    });

    it("Should exist - and not log to the console if its production", () => {

        //Arrange
        process.env.NODE_ENV = 'production';

        //Act
        const logger = require('../../../app/helpers/logger');

        //Assert
        expect(logger.add).not.toHaveBeenCalled();
        expect(logger).toBeDefined();

    })
})

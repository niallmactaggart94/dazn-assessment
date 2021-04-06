import { defer } from 'rxjs';
import { HttpPostTask } from './http-post.task';

describe('when calling the http post task', () => {

    function mockPostRequest(expectedData) {
        return {post: jest.fn(() => asyncData(expectedData))};
    }

    function asyncData<T>(data: T) {
        return defer(() => Promise.resolve(data));
    }

    it('should call the httpClient and set the cache to DO NOT cache', async () => {
        // Arrange
        const payload = {
            fakeProperty: 'fakeValue',
        };
        const httpPostMock = mockPostRequest(payload);
        const sut = new HttpPostTask(httpPostMock as any);

        // Act
        const result = await sut.post('url', payload);

        // Assert
        expect(httpPostMock.post).toHaveBeenLastCalledWith('url', payload);

        // Assert
        expect(result).toBe(payload);
    });
});

describe('when calling the post task - where the post request throws an error', () => {

    function mockPostRequestRejection(expectedData) {
        return {post: jest.fn(() => asyncData(expectedData))};
    }

    function asyncData<T>(data: T) {
        return defer(() => Promise.reject(data));
    }

    it('should emit an error message when the api call fails', async (done) => {

        // Arrange
        const payload = {
            fakeProperty: 'fakeValue',
        };
        const expectedError = {
            'Error': {
                'message': 'Request error',
            }
        };
        const url = 'myUrl';

        const httpClientMock = mockPostRequestRejection(expectedError);
        const sut = new HttpPostTask(httpClientMock as any);

        // Act
        try {
            await sut.post(url, payload);
        } catch (error) {
            expect(error).toBeDefined();
            done();
        }

    });
});

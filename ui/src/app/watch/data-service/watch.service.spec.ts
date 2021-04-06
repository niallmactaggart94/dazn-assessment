import {defer} from 'rxjs';
import {WatchService} from './watch.service';
import {environment} from '../../../environments/environment';

describe('Watch video data service', () => {
    function mockRequestWithData(expectedData) {
        return {
            get: jest.fn(() => expectedData),
            post: jest.fn(() => expectedData)
        };
    }

    function mockRequestWithException(exceptionToThrow) {
        return {
            get: jest.fn(() => asyncData(exceptionToThrow())),
            post: jest.fn(() => asyncData(exceptionToThrow()))
        };
    }

    function asyncData<T>(data: T) {
        return defer(() => Promise.resolve(data));
    }

    function createSUT(mockHttpGet, mockHttpPost) {
        const mockCriteria = {
            'userID': '12345',
            'streamID': 'e2d04c5c-ee93-4a3c-909d-9ae73e630bd7'
        };

        const sut = new WatchService(mockHttpGet, mockHttpPost);
        return {sut, mockCriteria};
    }

    describe('GET request via the http client', () => {
        it('should map response data - when the response is successful', async () => {
            // Arrange
            const stubReturnData = {'fakeProperty': 'fakeValue'};
            const mockHttpGet = mockRequestWithData(stubReturnData);
            const {sut, mockCriteria} = createSUT(mockHttpGet, null);

            // Act
            await sut.getStreams(mockCriteria.userID);

            // Assert
            expect(mockHttpGet.get).toHaveBeenCalled();
            expect(mockHttpGet.get).toHaveBeenCalledWith(environment.backendUrl + 'video/streams', {
                'params': {'userID': mockCriteria.userID}
            });

        });

        it('should map the error response - when the api call fails', async () => {
            // Arrange
            const mockHttpGet = mockRequestWithException(() => {
                throw new Error('fake error');
            });
            const {sut, mockCriteria} = createSUT(mockHttpGet, null);

            // Act
            return sut.getStreams(mockCriteria.userID).then(() => {
                throw new Error('Test failed - error not thrown correctly in service');
            }).catch((err) => {
                expect(mockHttpGet.get).toHaveBeenCalled();
                expect(err).toBeDefined();
            });
        });
    });

    describe('POST request via the http client: Remove Stream', () => {

        it('should return an object with the response when successful', async () => {
            // Arrange
            const stubReturnData = {'success': true};
            const mockHttpPost = mockRequestWithData(stubReturnData);
            const {sut, mockCriteria} = createSUT(null, mockHttpPost);


            // Act
            await sut.removeStream(mockCriteria.userID, mockCriteria.streamID);

            // Assert
            expect(mockHttpPost.post).toHaveBeenCalled();
            expect(mockHttpPost.post).toHaveBeenCalledWith(environment.backendUrl + 'video/remove', JSON.stringify({ userID: mockCriteria.userID, streamID: mockCriteria.streamID}));


        });


        it('should throw when the call fails', async () => {
            // Arrange
            const mockHttpPost = mockRequestWithException(() => {
                throw new Error('fake error');
            });
            const {sut, mockCriteria} = createSUT(null, mockHttpPost);

            // Act
            return sut.removeStream(mockCriteria.userID, mockCriteria.streamID).then(() => {
                throw new Error('Test failed - error not thrown correctly in service');
            }).catch((err) => {
                expect(mockHttpPost.post).toHaveBeenCalled();
                expect(err).toBeDefined();
            });
        });
    });


});

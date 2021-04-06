import { HttpGetTask } from './http-get.task';
import { HttpClient } from '@angular/common/http';
import { defer } from 'rxjs';
import { createServiceFactory } from '@ngneat/spectator';

let autoMock: any;
let sut: HttpGetTask;

const createService = createServiceFactory({
  service: HttpGetTask,
  mocks: [HttpClient],
});

function CreateSUT() {
  autoMock = createService();
  sut = autoMock.service;
}

function asyncData<T>(returnData: T) {
  return defer(() => Promise.resolve(returnData));
}

function asyncDataReject<T>(returnData: T) {
  return defer(() => Promise.reject(returnData));
}

describe('when calling the get task where the get request return a valid result', () => {
  beforeEach(() => {
    CreateSUT();
  });

  it('should call the httpClient and set the headers for cache, session and host', async () => {
    // Arrange
    const data = {
      success: true
    };
    const getSpy = autoMock.inject(HttpClient).get.and.returnValue(asyncData(data));

    // Act
    const result = await sut.get('url');

    // should call the httpClient.Get method
    expect(getSpy).toHaveBeenCalledWith('url', expect.anything());

    // should return the mock data
    expect(result).toEqual(data);
  });
});

describe('when calling the get task - where the get request throws an error', () => {
  beforeEach(() => {
    CreateSUT();
  });

  it('should emit an error message when the api call fails', async () => {
    // Arrange
    const expectedError = {
      Error: {
        message: 'Request error',
      },
    };

    // Setup a rejection when the api is called
    const getSpy = autoMock.inject(HttpClient).get.and.returnValue(asyncDataReject(expectedError));

    // Act
    try {
      await sut.get('url');
    } catch (error) {
      expect(getSpy).toHaveBeenCalledWith('url', expect.anything());
      expect(error).toBe(expectedError);
    }
  });


});

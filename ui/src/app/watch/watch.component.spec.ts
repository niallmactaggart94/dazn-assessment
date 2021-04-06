import {createServiceFactory} from '@ngneat/spectator';
import {ActivatedRoute, Router} from '@angular/router';
import {ElementRef} from '@angular/core';
import {Location} from '@angular/common';
import {WatchComponent} from './watch.component';
import {WatchService} from './data-service/watch.service';


let autoMock: any;

const createService = createServiceFactory({
    service: WatchComponent,
    mocks: [
        ActivatedRoute,
        WatchService,
        Router,
        ElementRef,
        Location]
});


function createSUT(): WatchComponent {
    autoMock = createService();
    return autoMock.service;
}

describe('Watch Component', () => {

    describe('On init', () => {

        it('should return an error if no stream ID is passed in', async () => {
            // Arrange
            const sut = createSUT();
            sut.getUserID = jest.fn().mockImplementationOnce(() => '123456');
            sut.getStreamID = jest.fn();

            // Act
            await sut.ngOnInit();

            // Assert
            expect(sut.error).toEqual('Incorrect ID used for stream');

        });

        it('should return an error if an invalid stream ID is passed in', async () => {
            // Arrange
            const sut = createSUT();
            sut.getUserID = jest.fn().mockImplementationOnce(() => '123456');
            sut.getStreamID = jest.fn().mockImplementationOnce(() => '123');

            // Act
            await sut.ngOnInit();

            // Assert
            expect(sut.error).toEqual('Incorrect ID used for stream');

        });

        it('should return an error if no user ID is passed in', async () => {
            // Arrange
            const sut = createSUT();
            sut.getUserID = jest.fn();
            sut.getStreamID = jest.fn().mockImplementationOnce(() => '0a2752c1-254d-4326-a851-e54267523734');

            // Act
            await sut.ngOnInit();

            // Assert
            expect(sut.error).toEqual('No User specified');

        });

        it('should not set the error if the correct params are specified', async () => {
            // Arrange
            const sut = createSUT();
            sut.getUserID = jest.fn().mockImplementationOnce(() => '123454');
            sut.getStreamID = jest.fn().mockImplementationOnce(() => '0a2752c1-254d-4326-a851-e54267523734');

            // Act
            await sut.ngOnInit();

            // Assert
            expect(sut.error).not.toBeDefined();

        });

    });

    describe('When calling function: getStreamID', () => {

        it('should return the stream id, when it exists', async () => {

            // Arrange
            const sut = createSUT();
            const routeMock: any = autoMock.inject(ActivatedRoute);
            routeMock.snapshot = {queryParams: {streamID: '1'}};

            // Act
            const result = await sut.getStreamID();

            // Assert
            expect(result).toEqual('1');
        });

        it('should return the empty string , when the id is undefined or empty', async () => {
            // Arrange
            const sut = createSUT();
            const routeMock: any = autoMock.inject(ActivatedRoute);
            routeMock.snapshot = {queryParams: {streamID: undefined}};

            // Act
            const result = await sut.getStreamID();

            // Assert
            expect(result).toEqual('');
        });

    });

    describe('When calling function: getUserID', () => {

        it('should return the user id, when it exists', async () => {

            // Arrange
            const sut = createSUT();
            const routeMock: any = autoMock.inject(ActivatedRoute);
            routeMock.snapshot = {queryParams: {userID: '1'}};

            // Act
            const result = await sut.getUserID();

            // Assert
            expect(result).toEqual('1');
        });

        it('should return the empty string , when the id is undefined or empty', async () => {
            // Arrange
            const sut = createSUT();
            const routeMock: any = autoMock.inject(ActivatedRoute);
            routeMock.snapshot = {queryParams: {userID: undefined}};

            // Act
            const result = await sut.getUserID();

            // Assert
            expect(result).toEqual('');
        });

    });

    describe('Function: onPopState', () => {
        it('Should call the service', async () => {
            // Arrange
            const sut = createSUT();
            const serviceMock = autoMock.inject(WatchService);

            // Act
            await sut.onPopState();

            // Assert
            expect(serviceMock.removeStream).toHaveBeenCalled();
        });
    });

    describe('Function: onBeforeUnload', () => {
        it('Should call navigator.sendBeacon', async () => {

            // Arrange
            const sut = createSUT();
            const globalAny: any = global;
            globalAny.navigator.sendBeacon = jest.fn();

            // Act
            await sut.onBeforeUnload();

            // Assert
            expect(navigator.sendBeacon).toHaveBeenCalled();
        });
    });

    describe('Function: videoErrorHandler', () => {
        it('Should set the error field to a string', () => {

            // Arrange
            const sut = createSUT();

            // Act
            sut.videoErrorHandler();

            // Assert
            expect(sut.error).toEqual('Something has gone wrong loading the video');

        });
    });

});

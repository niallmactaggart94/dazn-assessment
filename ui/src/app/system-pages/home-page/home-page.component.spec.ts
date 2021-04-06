import {createServiceFactory} from '@ngneat/spectator';
import {ActivatedRoute, Router} from '@angular/router';
import {ElementRef} from '@angular/core';
import {Location} from '@angular/common';
import {HomePageComponent} from './home-page.component';
import {WatchService} from '../../watch/data-service/watch.service';


let autoMock: any;

const createService = createServiceFactory({
    service: HomePageComponent,
    mocks: [
        ActivatedRoute,
        WatchService,
        Router,
        ElementRef,
        Location]
});


function createSUT(): HomePageComponent {
    autoMock = createService();
    return autoMock.service;
}

describe('Home Component', () => {

    describe('On init', () => {

        it('should return an error if no stream ID is passed in', async () => {
            // Arrange
            const sut = createSUT();

            // Act
            await sut.ngOnInit();

            // Assert
            expect(sut.loading).toEqual(false);

        });

    });

    describe('When calling function: validUserID', () => {

        it('should return false when the user ID is not present', async () => {

            // Arrange
            const sut = createSUT();
            sut.userID = '';

            // Act
            const result = sut.validUserID();

            // Assert
            expect(result).toEqual(false);
        });

        it('should return false when the user ID is present, but not valid', async () => {

            // Arrange
            const sut = createSUT();
            sut.userID = '12';

            // Act
            const result = sut.validUserID();

            // Assert
            expect(result).toEqual(false);
        });

        it('should return true when the user ID is valid', async () => {

            // Arrange
            const sut = createSUT();

            // Act
            const result = sut.validUserID();

            // Assert
            expect(result).toEqual(true);
        });

    });

    describe('Function: watchVideo', () => {

        it('Should check for a valid userID and if not, present an error', () => {
            // Arrange
            const sut = createSUT();
            const routeMock = autoMock.inject(Router);
            sut.userID = '';


            // Act
            sut.watchVideo();

            // Assert
            expect(routeMock.navigate).not.toHaveBeenCalled();
            expect(sut.validationError).toEqual(true);
        });

        it('Should check for a valid userID and if so, route to the watch screen', () => {
            // Arrange
            const sut = createSUT();
            const routeMock = autoMock.inject(Router);

            // Act
            sut.watchVideo();

            // Assert
            expect(routeMock.navigate).toHaveBeenCalled();
        });
    });

    describe('Function: getCurrentStreams', () => {

        it('Should check for a valid userID and if not, present an error', () => {
            // Arrange
            const sut = createSUT();
            sut.userID = '';
            const serviceMock = autoMock.inject(WatchService);

            // Act
            sut.getCurrentStreams();

            // Assert
            expect(serviceMock.getStreams).not.toHaveBeenCalled();
            expect(sut.validationError).toEqual(true);
        });

        it('Should check for a valid userID and if so, call the data service', () => {

            // Arrange
            const sut = createSUT();
            const serviceMock = autoMock.inject(WatchService);

            // Act
            sut.getCurrentStreams();

            // Assert
            expect(serviceMock.getStreams).toHaveBeenCalled();
        });
    });


});

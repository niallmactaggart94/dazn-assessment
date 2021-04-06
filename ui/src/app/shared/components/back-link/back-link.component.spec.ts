import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {BackLinkComponent} from './back-link.component';

let autoMock: SpectatorService<BackLinkComponent>;

const createService = createServiceFactory({
  service: BackLinkComponent,
  mocks: [
    ActivatedRoute,
    Router,
    Location
  ]
});


function createSUT(): BackLinkComponent {
  autoMock = createService();
  return autoMock.service;
}

describe('Back Link Component', () => {
  describe('When calling function: back', () => {

    it ('Should call event.preventDefault and then go back', async () => {
      // Arrange
      const sut = createSUT();
      const event = {preventDefault: jest.fn()};
      const locationMock: any = autoMock.inject(Location);

      // Act
      sut.back(event);

      // Assert
      expect(event.preventDefault).toHaveBeenCalled();
      expect(locationMock.back).toHaveBeenCalled();

    });

  });


});

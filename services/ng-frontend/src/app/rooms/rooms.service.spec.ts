import { TestBed } from '@angular/core/testing';

import { RoomsService } from './rooms.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('RoomsService', () => {
  let roomsService!: RoomsService;
  let httpMock!: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ RoomsService ],
    });

    roomsService = TestBed.inject(RoomsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('list()', () => {
    it('returns Rooms from the backend', async () => {
      const pRooms = roomsService.list().toPromise();

      const conn = httpMock.expectOne('http://chatter.technology/api/rooms/list');
      expect(conn.request.method).toBe('GET');
      conn.flush([
        {
          id: 1234,
          name: 'foo',
        },
        {
          id: 4321,
          name: 'bar',
        },
      ]);

      const roomsList = await pRooms;

      expect(roomsList).toEqual([
        {
          id: 1234,
          name: 'foo',
        },
        {
          id: 4321,
          name: 'bar',
        },
      ]);
    });

    it('returns empty list when no Rooms are returned by the backend', async () => {
      const pRooms = roomsService.list().toPromise();

      httpMock.expectOne('http://chatter.technology/api/rooms/list').flush([]);

      const roomsList = await pRooms;

      expect(roomsList).toEqual([]);
    });
  });
});

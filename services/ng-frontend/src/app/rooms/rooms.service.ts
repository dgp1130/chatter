import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { deserialize as deserializeRoom, Room } from 'src/app/rooms/room';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  constructor(private http: HttpClient) { }

  /** Lists all rooms currently available on the backend. */
  list(): Observable<Room[]> {
    return this.http.get<unknown>('http://chatter.technology/api/rooms/list').pipe(
      // Validate input is an array.
      map((serial) => {
        if (Array.isArray(serial)) {
          return serial as unknown[];
        } else {
          throw new Error(`/api/rooms/list reponse is not an array:\n${
              JSON.stringify(serial, null /* replacer */, 4 /* spaces */)}`);
        }
      }),
      // Operate on each item individually.
      map((list) => {
        return list.flatMap((item) => {
          // Filter out non-objects.
          if (item instanceof Object) {
            return [item];
          } else {
            // Silently log the error and continue processing rooms.
            console.error('Received Room which is not an object', item);
            return [];
          }
        }).map((item) => deserializeRoom(item));
      }),
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { RoomsService } from 'src/app/rooms/rooms.service';
import { catchError, mergeMap, scan, map } from 'rxjs/operators';
import Room from 'src/app/rooms/room';
import { Observable, combineLatest, concat, of, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
})
export class AppComponent implements OnInit {
  constructor(private roomsService: RoomsService) { }

  /** #template-private */ public readonly createEvents = new Subject<Event>();
  /** #template-private */ public rooms$: Observable<Room[]>;

  public ngOnInit() {
    const createdRooms$ = this.createEvents.asObservable().pipe(
      map(() => Math.floor(Math.random() * 100)),
      mergeMap((value) => this.roomsService.create(`test: ${value}`).pipe(
        catchError((err) => {
          console.error('Failed to create Room.', err);
          return of<Room>();
        }),
      )),
    );

    const fetchedRooms$ = this.roomsService.list().pipe(
      catchError((err) => {
        console.error('Failed to list Rooms.', err);
        return of<Observable<Room>>();
      }),
      mergeMap((rooms$) => rooms$.pipe(
        // Drop any unparseable Rooms but continue listening for others.
        catchError((err, obs) => {
          console.error('Failed to load Room.', err);
          return obs;
        }),
      )),
    );

    // Combine fetched rooms and locally created rooms into the same list.
    this.rooms$ = combineLatest([
      createdRooms$.pipe(
        scanToArray,
        map((rooms) => rooms.reverse()), // Order by most recently created.
      ),
      fetchedRooms$.pipe(scanToArray),
    ]).pipe(
      map(([created, fetched]) => [ ...created, ...fetched ]),
    );
  }
}

function scanToArray<T>(input: Observable<T>): Observable<T[]> {
  return concat(
    of([]), // Emit empty array immediately, becausing subsequent `scan()` won't emit the initial value.
    input.pipe(
      scan((items, value) => [...items, value], []),
    ),
  );
}

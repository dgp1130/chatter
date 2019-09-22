import 'package:chatter/api/rooms.dart' as rooms;
import 'package:chatter/models/room.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/mockito.dart';
import 'package:test/test.dart';

class MockClient extends Mock implements http.Client {}

void main() {
  group('The rooms module', () {
    group('exposes a "fetchRooms" function', () {
      test('which returns a list of Rooms returned from the server', () async {
        final client = MockClient();
        when(client.get(any)).thenAnswer((_) => Future.value(http.Response("""[{
          "id": 0,
          "name": "Kitchen"
        }, {
          "id": 1,
          "name": "Garage"
        }]""", 200 /* HTTP OK */)));

        final roomList = await rooms.fetchRooms(client);

        verify(client.get('/api/rooms/list'));

        expect(roomList, equals(<Room>[
          Room(id: 0, name: 'Kitchen'),
          Room(id: 1, name: 'Garage'),
        ]));
      });

      test('which returns an empty list of Rooms when none are returned', () async {
        final client = MockClient();
        when(client.get(any)).thenAnswer((_) =>
            Future.value(http.Response('[]', 200 /* HTTP OK */)));

        final roomList = await rooms.fetchRooms(client);
        expect(roomList, <Room>[]);
      });

      test('which throws an exception when an invalid status code is given', () async {
        final client = MockClient();
        when(client.get(any)).thenAnswer((_) =>
            Future.value(http.Response('', 500 /* HTTP Internal Error */)));

        await expect(rooms.fetchRooms(client), throwsException);
      });

      test('which throws an exception on connection dropped', () async {
        final client = MockClient();
        final ex = Exception('Oh noes!');
        when(client.get(any)).thenAnswer((_) => Future.error(ex));

        await expect(rooms.fetchRooms(client), throwsA(ex));
      });
    });

    group('exposes a "createRoom" function', () {
      test('which returns the newly created Room from the server', () async {
        final client = MockClient();
        when(client.post(
          any,
          headers: anyNamed('headers'),
          body: anyNamed('body'),
        )).thenAnswer((_) => Future.value(
          http.Response("""{
            "id": 0,
            "name": "Kitchen"
          }""", 201 /* HTTP Created */)),
        );

        final room = await rooms.createRoom('Kitchen', client);

        verify(client.post(
            '/api/rooms/create',
            headers: argThat(equals({
              'Content-Type': 'application/json',
            }), named: 'headers'),
            body: argThat(equals('{"name":"Kitchen"}'), named: 'body'),
        ));

        expect(room, equals(Room(id: 0, name: 'Kitchen')));
      });

      test('which throws an exception when an invalid status code is given', () async {
        final client = MockClient();
        when(client.post(
          any,
          headers: anyNamed('headers'),
          body: anyNamed('body'),
        )).thenAnswer((_) => Future.value(http.Response('', 500 /* HTTP Internal Error */)));

        await expect(rooms.createRoom('Kitchen', client), throwsException);
      });

      test('which throws an exception on connection dropped', () async {
        final client = MockClient();
        final ex = Exception('Oh noes!');
        when(client.post(
          any,
          headers: anyNamed('headers'),
          body: anyNamed('body'),
        )).thenAnswer((_) => Future.error(ex));

        await expect(rooms.createRoom('Kitchen', client), throwsA(ex));
      });
    });
  });
}
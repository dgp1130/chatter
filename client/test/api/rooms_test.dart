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

        verify(client.get('http://localhost:8080/api/rooms/list'));

        expect(Room(id: 0, name: "Foo"), equals(Room(id: 0, name: "Foo")));
        expect(roomList, equals(<Room>[
          Room(id: 0, name: "Kitchen"),
          Room(id: 1, name: "Garage"),
        ]));
      });

      test('which returns an empty list of Rooms when none are returned', () async {
        final client = MockClient();
        when(client.get(any)).thenAnswer((_) =>
            Future.value(http.Response("[]", 200 /* HTTP OK */)));

        final roomList = await rooms.fetchRooms(client);
        expect(roomList, <Room>[]);
      });

      test('which throws an exception when an invalid status code is given', () async {
        final client = MockClient();
        when(client.get(any)).thenAnswer((_) =>
            Future.value(http.Response("", 500 /* HTTP Internal Error */)));

        await expect(rooms.fetchRooms(client), throwsException);
      });

      test('which throws an exception on connection dropped', () async {
        final client = MockClient();
        final ex = Exception('Oh noes!');
        when(client.get(any)).thenAnswer((_) => Future.error(ex));

        await expect(rooms.fetchRooms(client), throwsA(ex));
      });
    });
  });
}
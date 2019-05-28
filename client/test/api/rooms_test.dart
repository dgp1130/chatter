import 'package:chatter/models/room.dart';
import 'package:test/test.dart';
import 'package:chatter/api/rooms.dart' as rooms;

void main() {
  group('The rooms module', () {
    group('exposes a "fetchRooms" function', () {
      test('which returns a list of simulated Room objects', () async {
        final List<Room> roomList = (await rooms.fetchRooms()).toList();
        expect(roomList.length, 100);
      });
    });
  });
}
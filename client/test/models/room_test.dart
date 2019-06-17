import 'package:chatter/models/room.dart';
import 'package:test/test.dart';

void main() {
  group('Room class', () {
    test('exposes all its fields', () {
      final room = Room(
        id: 5,
        name: 'Kitchen',
      );

      expect(room.id, 5);
      expect(room.name, 'Kitchen');
    });

    group('exposes fromJson', () {
      test('which deserializes from JSON', () {
        final room = Room.fromJson(<String, dynamic>{
          'id': 5,
          'name': 'Kitchen',
        });

        expect(room.id, 5);
        expect(room.name, 'Kitchen');
      });
    });

    group('overriddes the equality operator', () {
      test('to return whether or not two Rooms are equivalent', () {
        final r1 = Room(id: 1, name: "Foo");
        final r2 = Room(id: 1, name: "Bar");
        final r3 = Room(id: 2, name: "Foo");
        final r4 = Room(id: 1, name: "Foo");
        
        expect(r1, isNot(equals(r2)));
        expect(r1, isNot(equals(r3)));
        expect(r1, equals(r4));
      });
    });
  });
}
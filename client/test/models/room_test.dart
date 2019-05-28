import 'package:chatter/models/room.dart';
import 'package:test/test.dart';

void main() {
  group('Room class', () {
    test('has a "name" field', () {
      final Room room = Room('Kitchen');
      expect(room.name, 'Kitchen');
    });
  });
}
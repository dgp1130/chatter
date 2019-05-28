import 'package:chatter/models/user.dart';
import 'package:test/test.dart';

void main() {
  group('User', () {
    test('has a name field', () {
      final User user = User('Bob');
      expect(user.name, 'Bob');
    });
  });
}
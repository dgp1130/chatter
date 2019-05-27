import 'package:chatter/models/room.dart';
import 'package:intl/intl.dart';

final NumberFormat roomFormatter = NumberFormat('00');

/// Fetch all rooms from the server.
/// Currently, just simulate some data from the server.
Future<Iterable<Room>> fetchRooms() async {
  await Future.delayed(Duration(seconds: 3));

  Iterable<Room> genRooms() sync* {
    for (int i = 0; i < 100; ++i) {
      yield Room('Room #${roomFormatter.format(i)}');
    }
  }

  return genRooms();
}
import 'package:meta/meta.dart';

/// Represents a single chatroom.
class Room {
  Room({
    @required this.id,
    @required this.name,
  });

  final int id;
  final String name;

  factory Room.fromJson(final Map<String, dynamic> json) {
    return Room(
      id: json['id'],
      name: json['name'],
    );
  }

  bool operator ==(o) {
    if (o is! Room) return false;
    
    final other = o as Room;
    if (this.id != other.id) return false;
    if (this.name != other.name) return false;

    return true;
  }
}
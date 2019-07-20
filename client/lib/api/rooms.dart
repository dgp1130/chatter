import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:chatter/models/room.dart';

/// Fetch all rooms from the server.
/// @param injectedClient Allows the caller to provide an http.Client for dependency injection. Not
///     intended to be used by production code.
Future<List<Room>> fetchRooms([final http.Client injectedClient]) async {
  final client = injectedClient ?? http.Client();
  final res = await client.get('/api/rooms/list');

  if (res.statusCode != 200 /* HTTP OK */) {
    throw Exception('Failed to fetch rooms, received non-OK HTTP status: ${res.statusCode}');
  }

  final List<dynamic> rooms = json.decode(res.body);
  return rooms.map((final dynamic room) => Room.fromJson(room)).toList();
}

/// Create a room on the server with the given name.
/// @param name The name to use for the new room.
/// @param injectedClient Allows the caller to provide an http.Client for dependency injection. Not
///     intended to be used by production code.
Future<Room> createRoom(final String name, [final http.Client injectedClient]) async {
  final client = injectedClient ?? http.Client();
  final res = await client.post('/api/rooms/create', body: json.encode(<String, dynamic>{
    'name': name,
  }));

  if (res.statusCode != 201 /* HTTP Created */) {
    throw Exception('Failed to create room, received non-OK HTTP status: ${res.statusCode}');
  }

  final dynamic room = json.decode(res.body);
  return Room.fromJson(room);
}

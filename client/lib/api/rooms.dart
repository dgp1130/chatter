import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:chatter/models/room.dart';

/// Fetch all rooms from the server.
/// Currently, just simulate some data from the server.
/// @param injectedClient Allows the caller to provide an http.Client for dependency injection. Not
///     intended to be used by production code.
Future<List<Room>> fetchRooms([final http.Client injectedClient]) async {
  final client = injectedClient ?? http.Client();
  final res = await client.get('http://localhost:8080/api/rooms/list');

  if (res.statusCode != 200 /* HTTP OK */) {
    throw Exception('Failed to fetch rooms, received non-OK HTTP status: ${res.statusCode}');
  }

  final List<dynamic> rooms = json.decode(res.body);
  return rooms.map((final dynamic room) => Room.fromJson(room)).toList();
}
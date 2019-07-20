import 'package:chatter/models/room.dart';
import 'package:chatter/models/user.dart';
import 'package:chatter/widgets/login.dart';
import 'package:chatter/widgets/room_list.dart';
import 'package:flutter_web/material.dart';
import 'package:quiver/core.dart';
import 'package:chatter/api/rooms.dart' as rooms;

/// Widget representing the entire Chatter application.
class App extends StatefulWidget {
  @override
  _AppState createState() => _AppState();
}

class _AppState extends State<App> {
  Optional<User> _user = const Optional.absent();
  Optional<Future<List<Room>>> _rooms = Optional.absent();
  Optional<Room> _currentRoom = const Optional.absent();

  @override
  void initState() {
    super.initState();

    // Pre-fetch the list of rooms while the user is logging in.
    this._fetchRooms();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Chatter',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: <String, WidgetBuilder>{
        '/': (ctx) => Login(
          onSubmitUsername: (username) {
            setState(() => _user = Optional.of(User(username)));
            Navigator.pushNamed(ctx, '/room-list');
          },
        ),
        '/room-list': (ctx) => RoomList(
          rooms: _rooms.value, // Must have started requesting rooms to get here.
          onSelectRoom: (room) => setState(() {
            _currentRoom = Optional.of(room);
          }),
          onReloadRooms: this._fetchRooms,
          onAddRoom: (room) {
            setState(() {
              // Prepend the new room to the rooms list.
              this._rooms = this._rooms.transform((futureRooms) async {
                final rooms = await futureRooms;
                return [room, ...rooms];
              });
            });
          },
        ),
      },
    );
  }

  void _fetchRooms() {
    this.setState(() {
      this._rooms = Optional.of(rooms.fetchRooms());
    });
  }
}
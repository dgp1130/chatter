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
  Optional<List<Room>> _rooms = const Optional.absent();
  Optional<Room> _currentRoom = const Optional.absent();

  @override
  void initState() {
    super.initState();

    // Pre-fetch the list of rooms while the user is logging in.
    rooms.fetchRooms().then((rooms) => setState(() {
      this._rooms = Optional.of(rooms.toList());
    }));
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
          rooms: _rooms,
          onSelectRoom: (room) => setState(() {
            _currentRoom = Optional.of(room);
          }),
        ),
      },
    );
  }
}
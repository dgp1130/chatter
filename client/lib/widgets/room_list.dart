import 'package:chatter/api/rooms.dart' as rooms;
import 'package:chatter/models/room.dart';
import 'package:chatter/utils/show_blocking_dialog.dart';
import 'package:flutter_web/material.dart';
import 'package:flutter_web/widgets.dart';
import 'package:quiver/core.dart';

class RoomList extends StatefulWidget {
  RoomList({
    Key key,
    @required this.rooms,
    void Function(Room) onSelectRoom,
    void Function() onReloadRooms,
    void Function(Room) onAddRoom,
  }) :
    this.onSelectRoom = Optional.fromNullable(onSelectRoom),
    this.onReloadRooms = Optional.fromNullable(onReloadRooms),
    this.onAddRoom = Optional.fromNullable(onAddRoom),
    super(key: key);

  final Future<List<Room>> rooms;
  final Optional<void Function(Room)> onSelectRoom;
  final Optional<void Function()> onReloadRooms;
  final Optional<void Function(Room)> onAddRoom;

  @override
  _RoomListState createState() => _RoomListState();
}

class _RoomListState extends State<RoomList> {
  String _roomName = '';

  @override
  Widget build(final BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Room List'),
      ),
      body: FutureBuilder(
        future: widget.rooms,
        builder: (final BuildContext context, AsyncSnapshot<List<Room>> snapshot) {
          switch (snapshot.connectionState) {
            case ConnectionState.none:
              throw new AssertionError('List rooms request not started.');
            case ConnectionState.active:
            case ConnectionState.waiting:
              return _Loading();
            case ConnectionState.done:
              if (snapshot.hasError) {
                return _RoomListError(onReloadRooms: widget.onReloadRooms);
              } else {
                return _RoomList(
                  rooms: snapshot.data,
                  onSelectRoom: widget.onSelectRoom,
                );
              }
          }
        }
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () => showDialog(
          context: context,
          builder: (final context) => AlertDialog(
            title: Text('Enter a name for the chatroom.'),
            content: TextField(
              onChanged: (str) => this._roomName = str,
            ),
            actions: <Widget>[
              FlatButton(
                child: Text('ABORT'),
                onPressed: () => Navigator.of(context).pop(), // Dismiss dialog.
              ),
              FlatButton(
                child: Text('CREATE'),
                onPressed: () async {
                  try {
                    final room = await _createRoom(this._roomName);
                    try {
                      widget.onAddRoom.ifPresent((cb) => cb(room));
                    } catch (err) {
                      // onAddRoom() callback should handle its own errors.
                      print('onAddRoom() threw an unexpected error: ${err}');
                    }
                  } catch (err) {
                    await showDialog(
                      context: context,
                      builder: (final context) => AlertDialog(
                        title: Text('Failed to create room.'),
                        content: Text('Oh noes! Looks like we couldn\'t make the room. Maybe you'
                            + ' should hire a contractor?'),
                        actions: <Widget>[
                          FlatButton(
                            child: Text('OK'),
                            onPressed: () => Navigator.of(context).pop(), // Dismiss error dialog.
                          ),
                        ],
                      ),
                    );
                  } finally {
                    Navigator.of(context).pop(); // Dimiss text input dialog.
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<Room> _createRoom(final String name) async {
    // Show blocking load icon.
    return await showBlockingDialog<Room>(
      context: context,
      future: rooms.createRoom(name),
      builder: (final BuildContext context) => Dialog(
        // Dialog has a minimum width, much wider than needed for a progress ring.
        // Must used two sized boxes with a center to get the progress ring square.
        child: SizedBox.fromSize(
          size: Size.square(50),
          child: Center(
            child: SizedBox.fromSize(
              child: CircularProgressIndicator(),
              size: Size.square(25),
            ),
          ),
        ),
      ),
    );
  }
}

class _RoomList extends StatelessWidget {
  const _RoomList({
    Key key,
    @required this.onSelectRoom,
    @required this.rooms,
  }) : super(key: key);

  final Optional<void Function(Room)> onSelectRoom;
  final List<Room> rooms;

  @override
  Widget build(final BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          minWidth: 300,
          maxWidth: 300,
          maxHeight: 500,
        ),
        child: Card(
          child: Column(
            children: <Widget>[
              Center(
                child: Padding(
                  padding: EdgeInsets.all(10),
                  child: Text('Choose a room to join.',
                    style: Theme.of(context).textTheme.headline,
                  ),
                ),
              ),
              rooms.isEmpty ? Text('No rooms.') : Expanded(
                child: ListView(
                  children: ListTile.divideTiles(
                    context: context,
                    tiles: rooms.map((room) => ListTile(
                      title: Text(room.name),
                      onTap: () => onSelectRoom.ifPresent((cb) => cb(room)),
                    )).toList(),
                  ).toList(),
                ),
              ),
            ]
          ),
        ),
      ),
    );
  }
}

class _Loading extends StatelessWidget {
  const _Loading({
    Key key,
  }) : super(key: key);

  @override
  Widget build(final BuildContext context) {
    return Center(
      child: CircularProgressIndicator(),
    );
  }
}

class _RoomListError extends StatelessWidget {
  const _RoomListError({
    Key key,
    @required this.onReloadRooms,
  }) : super(key: key);

  final Optional<void Function()> onReloadRooms;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Center(
        child: Text('Oh noes!')
      ),
      content: Text('We couldn\'t connect to the server! Maybe it\'s on fire? 🔥💻🔥'),
      actions: <Widget>[
        FlatButton(
          child: Text('RETRY'),
          onPressed: () => this.onReloadRooms.ifPresent((cb) => cb()),
        ),
      ],
    );
  }
}

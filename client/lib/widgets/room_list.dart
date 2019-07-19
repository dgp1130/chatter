import 'package:chatter/models/room.dart';
import 'package:flutter_web/material.dart';
import 'package:flutter_web/widgets.dart';
import 'package:quiver/core.dart';

class RoomList extends StatelessWidget {
  RoomList({
    Key key,
    @required this.rooms,
    void Function(Room) onSelectRoom,
    void Function() onReloadRooms,
  }) :
    this.onSelectRoom = Optional.fromNullable(onSelectRoom),
    this.onReloadRooms = Optional.fromNullable(onReloadRooms),
    super(key: key);

  final Future<List<Room>> rooms;
  final Optional<void Function(Room)> onSelectRoom;
  final Optional<void Function()> onReloadRooms;

  @override
  Widget build(final BuildContext ctx) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Room List'),
      ),
      body: FutureBuilder(
        future: rooms,
        builder: (final BuildContext context, AsyncSnapshot<List<Room>> snapshot) {
          switch (snapshot.connectionState) {
            case ConnectionState.none:
              throw new AssertionError('List rooms request not started.');
            case ConnectionState.active:
            case ConnectionState.waiting:
              return _Loading();
            case ConnectionState.done:
              if (snapshot.hasError) {
                return _Error(onReloadRooms: onReloadRooms);
              } else {
                return _RoomList(
                  rooms: snapshot.data,
                  onSelectRoom: onSelectRoom,
                );
              }
          }
        }
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

class _Error extends StatelessWidget {
  const _Error({
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
        GestureDetector(
          onTap: () => this.onReloadRooms.ifPresent((cb) => cb()),
          child: Text('Retry', style: TextStyle(color: Colors.lightBlue, fontSize: 18)),
        ),
      ],
    );
  }
}

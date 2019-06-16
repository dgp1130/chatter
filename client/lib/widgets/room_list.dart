import 'package:chatter/models/room.dart';
import 'package:flutter_web/material.dart';
import 'package:flutter_web/widgets.dart';
import 'package:quiver/core.dart';

class RoomList extends StatelessWidget {
  RoomList({
    Key key,
    @required this.rooms,
    void Function(Room) onSelectRoom,
  }) :
    this.onSelectRoom = Optional.fromNullable(onSelectRoom),
    super(key: key);

  final Optional<List<Room>> rooms;
  final Optional<void Function(Room)> onSelectRoom;

  @override
  Widget build(final BuildContext ctx) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Room List'),
      ),
      body: !this.rooms.isPresent ? _Loading() : _RoomList(
        rooms: this.rooms.first,
        onSelectRoom: onSelectRoom,
      ),
    );
  }
}

class _Loading extends StatelessWidget {
  const _Loading({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: CircularProgressIndicator(),
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
              Expanded(
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
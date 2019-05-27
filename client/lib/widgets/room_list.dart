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
      body: this.rooms.isPresent ? this._buildRoomList(ctx, this.rooms.first) : this._buildLoadingIcon(),
    );
  }

  Widget _buildRoomList(final BuildContext ctx, final List<Room> rooms) {
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
                    style: Theme.of(ctx).textTheme.headline,
                  ),
                ),
              ),
              Expanded(
                child: ListView(
                  children: ListTile.divideTiles(
                    context: ctx,
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

  Widget _buildLoadingIcon() {
    return Center(
      child: CircularProgressIndicator(),
    );
  }
}
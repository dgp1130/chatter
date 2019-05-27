import 'package:chatter/models/user.dart';
import 'package:chatter/widgets/login.dart';
import 'package:flutter_web/material.dart';
import 'package:quiver/core.dart';

/// Widget representing the entire Chatter application.
class App extends StatefulWidget {
  @override
  _AppState createState() => _AppState();
}

class _AppState extends State<App> {
  Optional<User> _user = const Optional.absent();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Chatter',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: <String, WidgetBuilder>{
        '/': (ctx) => Login(onSubmitUsername: Optional.of((username) {
          setState(() => _user = Optional.of(User(username)));
        })),
      },
    );
  }
}
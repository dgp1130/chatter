import 'package:flutter_web/material.dart';
import 'package:quiver/core.dart';

/// Widget representing the login page of the app.
class Login extends StatefulWidget {
  Login({
    Key key,
    this.onSubmitUsername = const Optional.absent(),
  }) : super(key: key);

  final Optional<void Function(String)> onSubmitUsername;

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _formKey = GlobalKey<FormState>();

  final _usernameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints.tightFor(width: 300),
          child: IntrinsicHeight(
            child: Card(
              child: Padding(
                padding: EdgeInsets.all(10),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text('Please enter your username:'),
                      TextFormField(
                        controller: _usernameController,
                        autofocus: true,
                        textInputAction: TextInputAction.done,
                        validator: (value) {
                          return value.isEmpty ? 'I need SOME kind of name.' : null;
                        },
                      ),
                      Padding(
                        padding: EdgeInsets.all(5),
                        child: RaisedButton(
                          child: Text('Submit'),
                          onPressed: () {
                            if (!_formKey.currentState.validate()) return;

                            widget.onSubmitUsername.ifPresent((cb) => cb(_usernameController.text));
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
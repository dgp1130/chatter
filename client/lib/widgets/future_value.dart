import 'package:flutter_web/cupertino.dart';

class FutureValue<T, R extends Widget> extends StatefulWidget {
  FutureValue({
    Key key,
    @required this.future,
    @required this.onCompleted,
    @required this.onPending,
    @required this.onError,
  }): super(key: key);

  final Future<T> future;
  final R Function(T) onCompleted;
  final R Function() onPending;
  final R Function(dynamic) onError; // Cannot assume that Futures throw Errors or Exceptions. :(

  @override
  _FutureValueState createState() => _FutureValueState();
}

enum _State {
  PENDING,
  COMPLETED,
  ERROR,
}

class _FutureValueState<T, R extends Widget> extends State<FutureValue<T, R>> {
  _State _state = _State.PENDING;
  T _value;
  dynamic _ex;

  @override
  void initState() {
    super.initState();

    // Listen for future to complete and update current state.
    widget.future.then((value) {
      setState(() {
        _state = _State.COMPLETED;
        _value = value;
      });
    }, onError: (ex) {
      setState(() {
        _state = _State.ERROR;
        _ex = ex;
      });
    });
  }

  @override
  Widget build(final BuildContext context) {
    switch (_state) {
      case _State.PENDING: return widget.onPending();
      case _State.COMPLETED: return widget.onCompleted(_value);
      case _State.ERROR: return widget.onError(_ex);
      default: throw StateError('Unknown state: ${_state}');
    }
  }
}
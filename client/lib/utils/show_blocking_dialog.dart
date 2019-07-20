import 'package:flutter_web/material.dart';
import 'package:pedantic/pedantic.dart';

/// Flutter helper method to show a dialog whose lifecycle is dicated by a Future.
/// This works just like showDialog() but accepts a Future and automatically dismisses the dialog
/// when the Future completes. If the future completed successfully, that result is returned. If the
/// Future completed with an error, that error is thrown.
/// 
/// This function is most useful for rendering blocking progress icons while waiting for background
/// tasks such as a network request.
/// 
/// @param context The BuildContext with which to render.
/// @param builder A build function to create the dialog widget. Recommend returning a Dialog,
///     AlertDialog, or SimpleDialog here.
/// @param barrierDismissible Whether or not to allow the user to dismiss the dialog by clicking off
///     of it. Defaults to false because this dialog is meant to be dismissed by the system (via the
///     given Future completing), not dimissed by the end user clicking a button on the dialog.
Future<T> showBlockingDialog<T>({
    @required final BuildContext context,
    @required final Widget Function(BuildContext) builder,
    @required final Future<T> future,
    final bool barrierDismissible = false,
}) async {
  unawaited(showDialog<T>(
    context: context,
    builder: builder,
    barrierDismissible: barrierDismissible,
  ));

  try {
    return await future;
  } finally {
    Navigator.of(context).pop(); // Dismiss dialog.
  }
}

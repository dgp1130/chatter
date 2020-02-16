import { Directive, Input, ViewContainerRef, TemplateRef, OnChanges, OnDestroy, Host } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * Directive to observe a value and render content on each value while supporting loading, error,
 * completion use cases.
 *
 * Example:
 * ```html
 * <div [appAsyncObserve]="myObservable">
 *   <!-- Required: Rendered as each value is emitted. -->
 *   <div *appAsyncObserveValue="let value = value; let index = index">
 *     Emitted value {{ value }} at index {{ index }}.
 *   </div>
 *
 *   <!--
 *     Rendered before the first value is emitted. This is required if the input Observable is
 *     asynchronous.
 *   -->
 *   <div *appAsyncObserveStartup>
 *     Thinking...
 *   </div>
 *
 *   <!-- Required: Rendered when an error is emitted. -->
 *   <div *appAsyncObserveError="let error = error">
 *     Oh noes!<br />{{ error.message }}
 *   </div>
 *
 *   <!--
 *     Optional: Rendered when the Observable completes. If not set, then the last emitted value
 *     will still be rendered. Be careful with this, because Observables will often emit their last
 *     value and then immediately complete. If this happens, the last value will never render
 *     because complete will render over it too quickly. On error, this does not render because it
 *     would clobber any rendered error template.
 *   -->
 *   <div *appAsyncObserveComplete="let lastValue = lastValue; let totalCount = totalCount">
 *     Done: Emitted {{ totalCount }} values and the last one was {{ lastValue }}.
 *   </div>
 * </div>
 * ```
 *
 * @see AsyncObserveValueDirective
 * @see AsyncObserveStartupDirective
 * @see AsyncObserveErrorDirective
 * @see AsyncObserveCompleteDirective
 */
@Directive({
  selector: '[appAsyncObserve]',
})
export class AsyncObserveDirective<T> implements OnChanges, OnDestroy {
  private observable?: Observable<T>;
  /** Required: The input {@link Observable<T>} to render. */
  @Input() public set appAsyncObserve(observable: Observable<T>) {
    this.observable = observable;
  }

  private valueView?: View<ValueContext<T>>;
  /** Required: The view to render when a value is emitted from the input {@link Observable<T>}. */
  public set renderValue(valueView: View<ValueContext<T>>) {
    this.valueView = valueView;
  }

  private startupView?: View<StartupContext>;
  /**
   * The view to render while waiting for the first value to be emitted from the input {@link
   * Observable<T>}. Required if no value is emitted synchronously.
   */
  public set renderStartup(startupView: View<StartupContext>) {
    this.startupView = startupView;
  }

  private errorView?: View<ErrorContext>;
  /** Required: The view to render when the input {@link Observable<T>} emits an error. */
  public set renderError(errorView: View<ErrorContext>) {
    this.errorView = errorView;
  }

  private completeView?: View<CompleteContext<T>>;
  /** Optional: The view to render when the input {@link Observable<T>} completes. */
  public set renderComplete(completeView: View<CompleteContext<T>>) {
    this.completeView = completeView;
  }

  private subscription?: Subscription;
  public ngOnChanges() {
    // Assert required values are present.
    const { observable, valueView, errorView } = this;
    if (!observable || !valueView || !errorView) {
      throw new Error('Observable, valueView, and errorView are all required.');
    }

    let index = 0;
    let lastValue: T|undefined;
    this.subscription?.unsubscribe();
    this.subscription = this.observable.subscribe((value) => {
      // Render value.
      lastValue = value;

      this.startupView?.clear();
      valueView.clear();
      valueView.render({
        value,
        index: index++,
      });
    }, (error) => {
      // Render error.
      this.startupView?.clear();
      valueView.clear();
      errorView.render({ error });
    }, () => {
      if (errorView.rendered) {
        // Do nothing. On error, a complete() call will come immediately after an error. If we
        // rendered now, it would clobber the error view and make it useless.
        return;
      }

      // Render completion if available.
      this.startupView?.clear();
      if (this.completeView) {
        valueView.clear();
        this.completeView.render({
          lastValue,
          totalCount: index,
        });
      }
    });

    // Render startup view if a value was not emitted synchronously.
    if (!valueView.rendered) {
      const { startupView } = this;
      if (startupView) {
        startupView.render({});
      } else {
        throw new Error('Observable did not emit a value synchronously, must provide a startup'
            + ' view to render until the first value is received.');
      }
    }
  }

  // Clean up subscriptions.
  public ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

/** Holds the data to render a template view with a provided context. */
class View<Context> {
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<Context>,
  ) { }

  private isRendered = false;
  public get rendered(): boolean {
    return this.isRendered;
  }

  public render(ctx: Context) {
    this.viewContainer.createEmbeddedView(this.templateRef, ctx);
    this.isRendered = true;
  }

  public clear() {
    this.viewContainer.clear();
    this.isRendered = false;
  }
}

/**
 * Structural directive for rendering a value from an {@link Observable<T>}.
 *
 * Provides `{{ value }}` and `{{ index }}` bindings to the context for use in the template.
 *
 * @see AsyncObserveDirective
 */
@Directive({
  selector: '[appAsyncObserveValue]',
})
export class AsyncObserveValueDirective<T> {
  constructor(
    viewContainer: ViewContainerRef,
    templateRef: TemplateRef<ValueContext<T>>,
    @Host() asyncObserve: AsyncObserveDirective<T>,
  ) {
    asyncObserve.renderValue = new View(viewContainer, templateRef);
  }
}

/** Context to use for data bindings when rendering value view. */
interface ValueContext<T> {
  value: T;
  index: number;
}

/**
 * Structural directive for rendering a startup template while waiting for the first value from an
 * {@link Observable}.
 *
 * Provides no bindings to the context.
 *
 * @see AsyncObserveDirective
 */
@Directive({
  selector: '[appAsyncObserveStartup]',
})
export class AsyncObserveStartupDirective {
  constructor(
    viewContainer: ViewContainerRef,
    templateRef: TemplateRef<StartupContext>,
    @Host() asyncObserve: AsyncObserveDirective<unknown>,
  ) {
    asyncObserve.renderStartup = new View(viewContainer, templateRef);
  }
}

/** Context to use for data bindings when rendering startup view. */
// tslint:disable-next-line:no-empty-interface Semantic interface, just happens to be empty.
interface StartupContext { }

/**
 * Structural directive for rendering an error emitted for an {@link Observable}.
 *
 * Provides an `{{ error }}` binding to the context for use in the template.
 *
 * @see AsyncObserveDirective
 */
@Directive({
  selector: '[appAsyncObserveError]',
})
export class AsyncObserveErrorDirective {
  constructor(
    viewContainer: ViewContainerRef,
    templateRef: TemplateRef<ErrorContext>,
    @Host() asyncObserve: AsyncObserveDirective<unknown>,
  ) {
    asyncObserve.renderError = new View(viewContainer, templateRef);
  }
}

/** Context to use for data bindings when rendering error view. */
interface ErrorContext {
  error: Error;
}

/**
 * Structural directive for rendering a completion template after all values from an
 * {@link Observable} have been emitted.
 *
 * Provides `{{ lastValue }}` and `{{ totalCount }}` bindings to the context for use in the
 * template.
 *
 * @see AsyncObserveDirective
 */
@Directive({
  selector: '[appAsyncObserveComplete]',
})
export class AsyncObserveCompleteDirective<T> {
  constructor(
    viewContainer: ViewContainerRef,
    templateRef: TemplateRef<CompleteContext<T>>,
    @Host() asyncObserve: AsyncObserveDirective<T>,
  ) {
    asyncObserve.renderComplete = new View(viewContainer, templateRef);
  }
}

/** Context to use for data bindings when rendering complete view. */
interface CompleteContext<T> {
  lastValue?: T;
  totalCount: number;
}

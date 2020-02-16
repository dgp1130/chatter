import { AsyncObserveDirective, AsyncObserveValueDirective, AsyncObserveStartupDirective, AsyncObserveErrorDirective, AsyncObserveCompleteDirective } from './async-observe.directive';
import { Component, Input, Type } from '@angular/core';
import { Observable, of, NEVER, throwError, Subscriber, concat } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  template: `
    <div [appAsyncObserve]="observable" id="view">
      <div *appAsyncObserveValue="let value = value; let index = index">
        Value: {{ value }}
        Index: {{ index }}
      </div>
      <div *appAsyncObserveStartup>
        Startup
      </div>
      <div *appAsyncObserveError="let error = error">
        Error: {{ error.message }}
      </div>
      <div *appAsyncObserveComplete="let lastValue = lastValue; let totalCount = totalCount">
        <div *ngIf="lastValue; else noLastValue">
          LastValue: {{ lastValue }}
        </div>
        <ng-template #noLastValue>
          No LastValue
        </ng-template>
        TotalCount: {{ totalCount }}
      </div>
    </div>
  `,
})
class WellBehavedComponent<T> {
  @Input() public observable?: Observable<T>;
}

function init<T>(ComponentClass: Type<T>): {
  fixture: ComponentFixture<T>,
  component: T,
  debugElement: HTMLElement,
} {
  TestBed.configureTestingModule({
    declarations: [
      AsyncObserveDirective,
      AsyncObserveValueDirective,
      AsyncObserveStartupDirective,
      AsyncObserveErrorDirective,
      AsyncObserveCompleteDirective,
      ComponentClass,
    ],
  });

  const fixture = TestBed.createComponent(ComponentClass);
  const component = fixture.componentInstance;
  const debugElement = fixture.debugElement.nativeElement;
  return { fixture, component, debugElement };
}

describe('AsyncObserveDirective', () => {
  it('renders the value view when a value is emitted', () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);

    component.observable = uncompletedOf(1);
    fixture.detectChanges();

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Value: 1');
    expect(view.textContent).toContain('Index: 0');
  });

  it('renders the startup view while waiting for a value', () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);

    component.observable = NEVER;
    fixture.detectChanges();

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Startup');
  });

  it('renders the error view when an error is emitted', () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);

    component.observable = throwError(new Error('Whoopsie daisy!'));
    fixture.detectChanges();

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Error: Whoopsie daisy!');
  });

  it('renders the complete view when the Observable completes', () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);

    component.observable = of(2);
    fixture.detectChanges();

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('LastValue: 2');
    expect(view.textContent).toContain('TotalCount: 1');
  });

  it('transitions from startup view to value view', async () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);
    const [ obs, subPromise ] = emitter<number>();

    component.observable = obs;
    fixture.detectChanges();
    const sub = await subPromise;

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Startup');

    sub.next(1);
    fixture.detectChanges();

    expect(view.textContent).toContain('Value: 1');
    expect(view.textContent).toContain('Index: 0');
  });

  it('transitions from startup view to error view', async () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);
    const [ obs, subPromise ] = emitter<number>();

    component.observable = obs;
    fixture.detectChanges();
    const sub = await subPromise;

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Startup');

    sub.error(new Error('Whoopsie daisy!'));
    fixture.detectChanges();

    expect(view.textContent).toContain('Error: Whoopsie daisy!');
  });

  it('transitions from startup view to complete view', async () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);
    const [ obs, subPromise ] = emitter<number>();

    component.observable = obs;
    fixture.detectChanges();
    const sub = await subPromise;

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Startup');

    sub.complete();
    fixture.detectChanges();

    expect(view.textContent).toContain('No LastValue');
    expect(view.textContent).toContain('TotalCount: 0');
  });

  it('transitions from value view to error view', async () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);
    const [ obs, subPromise ] = emitter<number>();

    component.observable = concat(of(1), obs);
    fixture.detectChanges();
    const sub = await subPromise;

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Value: 1');

    sub.error(new Error('Whoopsie daisy!'));
    fixture.detectChanges();

    expect(view.textContent).toContain('Error: Whoopsie daisy!');
  });

  it('transitions from value view to complete view', async () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);
    const [ obs, subPromise ] = emitter<number>();

    component.observable = concat(of(2), obs);
    fixture.detectChanges();
    const sub = await subPromise;

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Value: 2');

    sub.complete();
    fixture.detectChanges();

    expect(view.textContent).toContain('LastValue: 2');
    expect(view.textContent).toContain('TotalCount: 1');
  });

  it('does *not* transition to complete view after an error', () => {
    const { component, fixture, debugElement } = init(WellBehavedComponent);
    component.observable = throwError(new Error('Whoopsie daisy!'));
    fixture.detectChanges();

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Error: Whoopsie daisy!');
  });

  it('throws an error when not given an input Observable', () => {
    @Component({
      template: `
        <div [appAsyncObserve]="observable">
          <div *appAsyncObserveValue>Value</div>
          <div *appAsyncObserveStartup>Startup</div>
          <div *appAsyncObserveError>Error</div>
          <div *appAsyncObserveComplete>Complete</div>
        </div>
      `,
    })
    class TestComponent<T> {
      @Input() public observable?: Observable<T>;
    }

    const { component, fixture } = init(TestComponent);

    component.observable = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('throws an error when not given a value template', () => {
    @Component({
      template: `
        <div [appAsyncObserve]="observable">
          <!-- No *appAsyncObserveValue. -->
          <div *appAsyncObserveStartup>Startup</div>
          <div *appAsyncObserveError>Error</div>
          <div *appAsyncObserveComplete>Complete</div>
        </div>
      `,
    })
    class TestComponent<T> {
      @Input() public observable?: Observable<T>;
    }

    const { component, fixture } = init(TestComponent);

    component.observable = of();
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('throws an error when given an asynchronous Observable and no startup template', () => {
    @Component({
      template: `
        <div [appAsyncObserve]="observable">
          <div *appAsyncObserveValue>Value</div>
          <!-- No *appAsyncObserveStartup. -->
          <div *appAsyncObserveError>Error</div>
          <div *appAsyncObserveComplete>Complete</div>
        </div>
      `,
    })
    class TestComponent<T> {
      @Input() public observable?: Observable<T>;
    }

    const { component, fixture } = init(TestComponent);

    component.observable = uncompletedOf();
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('does not throw an error when given a synchronous Observable and no startup template', () => {
    @Component({
      template: `
        <div [appAsyncObserve]="observable">
          <div *appAsyncObserveValue>Value</div>
          <!-- No *appAsyncObserveStartup. -->
          <div *appAsyncObserveError>Error</div>
          <div *appAsyncObserveComplete>Complete</div>
        </div>
      `,
    })
    class TestComponent<T> {
      @Input() public observable?: Observable<T>;
    }

    const { component, fixture } = init(TestComponent);

    component.observable = uncompletedOf(1);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('throws an error when not given an error template', () => {
    @Component({
      template: `
        <div [appAsyncObserve]="observable">
          <div *appAsyncObserveValue>Value</div>
          <div *appAsyncObserveStartup>Startup</div>
          <!-- No *appAsyncObserveError. -->
          <div *appAsyncObserveComplete>Complete</div>
        </div>
      `,
    })
    class TestComponent<T> {
      @Input() public observable?: Observable<T>;
    }

    const { component, fixture } = init(TestComponent);

    component.observable = of();
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('renders last value template when not given a complete template', () => {
    @Component({
      template: `
        <div [appAsyncObserve]="observable" id="view">
          <div *appAsyncObserveValue="let value = value">Value: {{ value }}</div>
          <div *appAsyncObserveStartup>Startup</div>
          <div *appAsyncObserveError>Error</div>
          <!-- No *appAsyncObserveComplete. -->
        </div>
      `,
    })
    class TestComponent<T> {
      @Input() public observable?: Observable<T>;
    }

    const { component, fixture, debugElement } = init(TestComponent);

    component.observable = of(1, 2, 3);
    fixture.detectChanges();

    const view = debugElement.querySelector('#view');
    expect(view.textContent).toContain('Value: 3');
  });
});

function emitter<T>(): readonly [Observable<T>, Promise<Subscriber<T>>] {
  let resolver: (sub: Subscriber<T>) => void;
  const subscriber: Promise<Subscriber<T>> = new Promise((resolve) => resolver = resolve);
  const observable = new Observable<T>((sub) => resolver(sub));
  return [observable, subscriber];
}

/**
 * Emits all the given values as an {@link Observable<T>}, but does **not** complete that
 * {@link Observable<T>}.
 */
function uncompletedOf<T>(...values: T[]): Observable<T> {
  return new Observable((sub) => {
    for (const value of values) sub.next(value);
  });
}

import {
  assertInInjectionContext,
  inject,
  Injector,
  isSignal,
  Signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  isObservable,
  Observable,
  of,
  OperatorFunction,
  Subject,
  takeUntil,
  Unsubscribable,
} from 'rxjs';
import { injectDestroy } from './inject-destroy';

type RxEffectInput<Input> = Input | Observable<Input> | Signal<Input>;
type RxEffect<Input> = ((input: RxEffectInput<Input>) => Unsubscribable) &
  Unsubscribable;

export function rxEffect<Input>(
  generator: OperatorFunction<Input, unknown>
): RxEffect<Input> {
  assertInInjectionContext(rxEffect);

  const injector = inject(Injector);
  const destroy$ = injectDestroy();
  const source$ = new Subject<Input>();

  const sourceSubscription = generator(source$)
    .pipe(takeUntil(destroy$))
    .subscribe();

  const rxEffectFn = (input: RxEffectInput<Input>) => {
    let input$: Observable<Input>;

    if (isSignal(input)) {
      input$ = toObservable(input, { injector });
    } else if (isObservable(input)) {
      input$ = input.pipe(takeUntil(destroy$));
    } else {
      input$ = of(input);
    }

    const instanceSubscription = input$.subscribe((value) =>
      source$.next(value)
    );
    sourceSubscription.add(instanceSubscription);

    return instanceSubscription;
  };
  rxEffectFn.unsubscribe =
    sourceSubscription.unsubscribe.bind(sourceSubscription);

  return rxEffectFn;
}

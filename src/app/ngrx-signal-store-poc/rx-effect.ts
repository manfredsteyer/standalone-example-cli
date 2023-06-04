import { DestroyRef, inject, isSignal, Signal } from '@angular/core';
import {
  isObservable,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { injectDestroy } from './inject-destroy';
import { toObservable } from './to-observable';

export function rxEffect<Input>(
  generator: (source$: Observable<Input>) => Observable<unknown>
): (input: Input | Observable<Input> | Signal<Input>) => Subscription {
  const destroy$ = injectDestroy();
  const source$ = new Subject<Input>();

  generator(source$).pipe(takeUntil(destroy$)).subscribe();

  return (input) => {
    let input$ = fromRxInput(input);

    return input$
      .pipe(takeUntil(destroy$))
      .subscribe((value) => source$.next(value));
  };
}

function fromRxInput<Input>(
  input: Input | Observable<Input> | Signal<Input>
): Observable<Input> {
  if (isObservable(input)) {
    return input;
  }

  return typeof input === 'function' && isSignal(input)
    ? toObservable(input)
    : of(input);
}

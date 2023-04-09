/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Signal, computed, effect, signal } from '@angular/core';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
/**
 * Exposes the value of an Angular `Signal` as an RxJS `Observable`.
 *
 * The returned `Observable` has `shareReplay` semantics. When subscribed, the current value starts
 * propagating to subscribers with the same timing as an `effect` watching that value. New
 * subscribers beyond the first will receive the current value immediately.
 *
 * When there are no more subscriptions, the internal `effect` will be cleaned up.
 *
 * @developerPreview
 */
export function fromSignal<T>(source: Signal<T>): Observable<T> {
  // Creating a new `Observable` allows the creation of the effect to be lazy. This allows for all
  // references to `source` to be dropped if the `Observable` is fully unsubscribed and thrown away.
  const observable = new Observable<T>(observer => {
    const watcher = effect(() => {
      try {
        observer.next(source());
      } catch (err) {
        observer.error(err);
      }
    });
    return () => {
      watcher.destroy();
    };
  });

  // Pipe via `shareReplay` to share the single backing `effect` across all interested subscribers.
  // This of course has timing implications for when new subscribers show up. We turn on `refCount`
  // so that once all subscribers are unsubscribed, the underlying `effect` can be cleaned up. We
  // set a `bufferSize` of 1 to only cache the latest value.
  return observable.pipe(shareReplay({refCount: true, bufferSize: 1}));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */



/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * `fromObservable` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * If the `Observable` does not produce a value before the `Signal` is read, the `Signal` will throw
 * an error. To avoid this, use a synchronous `Observable` (potentially created with the `startWith`
 * operator) or pass an initial value to `fromObservable` as the second argument.
 */
export function fromObservable<T>(obs$: Observable<T>): Signal<T>;

/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * `fromObservable` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * Before the `Observable` emits its first value, the `Signal` will return the configured
 * `initialValue`. If the `Observable` is known to produce a value before the `Signal` will be read,
 * `initialValue` does not need to be passed.
 *
 * @developerPreview
 */
export function fromObservable<T, U>(source: Observable<T>, initialValue: U): Signal<T|U>;
export function fromObservable<T, U = never>(source: Observable<T>, initialValue?: U): Signal<T|U> {
  let initialState: State<T|U>;
  if (initialValue === undefined && arguments.length !== 2) {
    initialState = {kind: StateKind.NoValue};
  } else {
    initialState = {kind: StateKind.Value, value: initialValue!};
  }

  const state = signal<State<T|U>>(initialState);

  source.subscribe({
    next: value => state.set({kind: StateKind.Value, value}),
    error: error => state.set({kind: StateKind.Error, error}),
  });

  // TODO(alxhub): subscription cleanup logic

  return computed(() => {
    const current = state();
    switch (current.kind) {
      case StateKind.NoValue:
        throw new Error(`fromObservable() signal read before the Observable emitted`);
      case StateKind.Value:
        return current.value;
      case StateKind.Error:
        throw current.error;
    }
  });
}
const enum StateKind {
  NoValue,
  Value,
  Error,
}

interface NoValueState {
  kind: StateKind.NoValue;
}

interface ValueState<T> {
  kind: StateKind.Value;
  value: T;
}

interface ErrorState {
  kind: StateKind.Error;
  error: unknown;
}

type State<T> = NoValueState|ValueState<T>|ErrorState;
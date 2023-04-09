import { Signal, inject, signal } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export function fromObservable<T>(
  obs$: Observable<T>,
  initialValue: T
): Signal<T> {
  const sig = signal(initialValue);

  obs$.subscribe((val) => sig.update(() => val));

  return sig.bind(sig);
}

export function fromStore<T>(selector: MemoizedSelector<object, T>): Signal<T> {
  const store = inject(Store);

  const subj = store
    .select(selector)
    .pipe(take(1)) as BehaviorSubject<T>;

  return fromObservable(store.select(selector), subj.value);
}

export function injectStore() {
  return inject(Store);
}

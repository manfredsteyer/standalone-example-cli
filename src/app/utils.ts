import { inject } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Signal, signal } from './signals';

export function fromObservable<T>(
  obs$: Observable<T>,
  initialValue: T
): Signal<T> {
  const sig = signal(initialValue);

  obs$.subscribe((val) => sig.update(() => val));

  return sig.bind(sig);
}

export function fromStore<T>(selector: MemoizedSelector<object, T>): () => T {
  const store = inject(Store);

//   let initialValue: T;
  const subj = store
    .select(selector)
    .pipe(take(1)) as BehaviorSubject<T>;
    // .subscribe((res) => {
    //   initialValue = res;
    // });

  return fromObservable(store.select(selector), subj.value);
}

export function injectStore() {
  return inject(Store);
}

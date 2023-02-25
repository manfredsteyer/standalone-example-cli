import { inject } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SettableSignal, Signal, signal } from './signals';

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

type DeepSignal<Type> = {
  [Property in keyof Type]: 
    Type[Property] extends object ? 
      SettableSignal<DeepSignal<Type[Property]>>  
    : SettableSignal<Type[Property]>;
} | null;

export function nest<T>(value: T): SettableSignal<DeepSignal<T>> {
  if (value === null) {
    return signal(null)
  }
  else if (typeof value === 'object') {
    const deep = {} as DeepSignal<T>;

    for (const key of Object.keys(value as object)) {
      (deep as any)[key] = nest((value as any)[key]);
    }

    return signal(deep);
  }
  else {
    return signal(value as DeepSignal<T>);
  }
}

export function flatten<T>(value: DeepSignal<T>): T {
  return value as T;
}

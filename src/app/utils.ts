import { Signal, WritableSignal, inject, signal } from '@angular/core';
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

export function fromStore<T>(selector: MemoizedSelector<object, T>): () => T {
  const store = inject(Store);

  //   let initialValue: T;
  const subj = store.select(selector).pipe(take(1)) as BehaviorSubject<T>;
  // .subscribe((res) => {
  //   initialValue = res;
  // });

  return fromObservable(store.select(selector), subj.value);
}

export function injectStore() {
  return inject(Store);
}

export type DeepSignal<Type> = {
  [Property in keyof Type]: Type[Property] extends Array<object>
    ? WritableSignal<DeepArraySignal<DeepSignal<Type[Property][0]>>>
    : Type[Property] extends object
    ? WritableSignal<DeepSignal<Type[Property]>>
    : WritableSignal<Type[Property]>;
};

export function nest<T>(value: T): WritableSignal<DeepSignal<T>> {
  if (value === null) {
    return signal(null) as unknown as WritableSignal<DeepSignal<T>>;
  } else if (Array.isArray(value)) {
    const signals = value.map((v) => nest(v));
    const wrapped = new DeepArraySignal(signals) as DeepSignal<T>;
    return signal(wrapped);
  } else if (typeof value === 'object') {
    const deep = {} as DeepSignal<T>;

    for (const key of Object.keys(value as object)) {
      (deep as any)[key] = nest((value as any)[key]);
    }

    return signal(deep);
  } else {
    return signal(value as DeepSignal<T>);
  }
}

export function flatten<T>(value: DeepSignal<T>): T {

  if (typeof value !== 'object' || !value) {
    return value;
  }

  if (value instanceof DeepArraySignal) {
    return [...value].map((item) => flatten(item())) as T;
  }

  let result = {} as T;
  for (const key of Object.keys(value)) {
    (result as any)[key] = flatten((value as any)[key]());
  }
  return result;
}

class DeepArraySignal<T> {
  constructor(private signals: WritableSignal<T>[]) {}

  [Symbol.iterator]() {
    return this.signals[Symbol.iterator]();
  }

  set(signals: WritableSignal<T>[]): void {
    this.signals = signals;
  }

  update(updateFn: (value: WritableSignal<T>[]) => WritableSignal<T>[]): void {
    this.signals = updateFn(this.signals);
  }

  mutate(mutatorFn: (value: WritableSignal<T>[]) => void): void {
    mutatorFn(this.signals);
  }

  length(): number {
    return this.signals.length;
  }

  at(index: number): T {
    return this.signals[index]();
  }
}

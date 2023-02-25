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
    Type[Property] extends Array<object> ? 
      SettableSignal<DeepArraySignal<DeepSignal<Type[Property][0]>>>  
    : Type[Property] extends object ? 
      SettableSignal<DeepSignal<Type[Property]>>  
    : SettableSignal<Type[Property]>;
} | null;

export function nest<T>(value: T): SettableSignal<DeepSignal<T>> {
  if (value === null) {
    return signal(null)
  }
  else if (Array.isArray(value)) {
    const signals = value.map(v => nest(v));
    const wrapped = new DeepArraySignal(signals) as DeepSignal<T>;
    return signal(wrapped);
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

class DeepArraySignal<T> {
  constructor(private signals: SettableSignal<T>[]) {
  }

  set(signals: SettableSignal<T>[]): void {
    this.signals = signals;
  }

  update(updateFn: (value: SettableSignal<T>[]) => SettableSignal<T>[]): void {
    this.signals = updateFn(this.signals);
  }

  mutate(mutatorFn: (value: SettableSignal<T>[]) => void): void {
    mutatorFn(this.signals);
  }

  length(): number {
    return this.signals.length;
  }

  at(index: number): T {
    return this.signals[index]();
  }
}


import { Injector, Signal, WritableSignal, computed, effect, signal, untracked } from '@angular/core';

export type DeepWritableSignal<Type> =
  /*Type extends Array<object> ?
Array<WritableSignal<DeepWritableSignal<Type[0]>>> :*/
  {
    [Property in keyof Type]: Type[Property] extends object
      ? WritableSignal<DeepWritableSignal<Type[Property]>>
      : WritableSignal<Type[Property]>;
  };

export type DeepSignal<Type> =
  /*Type extends Array<object> ?
Array<Signal<DeepSignal<Type[0]>>> :*/
  {
    [Property in keyof Type]: Type[Property] extends object
      ? Signal<DeepSignal<Type[Property]>>
      : Signal<Type[Property]>;
  };

export function toReadOnly<T>(deep: DeepWritableSignal<T>, injector: Injector): DeepSignal<T> {
  // return deep as DeepSignal<T>;
  // debugger;

  const cache = new Map<string, WritableSignal<unknown>>();

  const result = Array.isArray(deep)
    ? ([] as Array<DeepSignal<T>>)
    : ({} as DeepSignal<T>);

  for (const key of Object.keys(deep)) {
    Object.defineProperty(result, key, {
      get() {
        const s = (deep as any)[key] as WritableSignal<any>;
        let mirror: WritableSignal<unknown>;

        if (!cache.has(key)) {
          mirror = createMirror(s);
          cache.set(key, mirror);
          setupSync(s, mirror);
        }
        else {
          mirror = cache.get(key)!;
        }

        return mirror.asReadonly();
      },
    });

  }
  return result as DeepSignal<T>;

  function setupSync(s: WritableSignal<any>, mirror: WritableSignal<unknown>) {
    effect(() => {
      const value = s();
      if (typeof value === 'object') {
        mirror.set(toReadOnly(value as DeepSignal<unknown>, injector));
      }
      else {
        mirror.set(value);
      }
    }, { allowSignalWrites: true, injector });
  }

  function createMirror(s: WritableSignal<any>) {
    const value = s();
    if (typeof value === 'object') {
      return signal(toReadOnly(value, injector));
    }
    else {
      return signal(value);
    }
  }
}

export function nest<T>(value: T): DeepWritableSignal<T> {
  const signalMap = new Map<string | symbol, WritableSignal<unknown>>();

  if (typeof value === 'object') {
    const deep = Array.isArray(value)
      ? ([] as Array<DeepWritableSignal<T>>)
      : ({} as DeepWritableSignal<T>);

    for (const key of Object.keys(value as object)) {
      Object.defineProperty(deep, key, {
        enumerable: true,
        get() {
          return getSignal(key, value);
        },
        set(v: unknown) {
          const s = getSignal(key, value);
          s?.set(v);
          (value as any)[key] = v;
        },
      });
    }
    return deep as DeepWritableSignal<T>;
  } else {
    return value as DeepWritableSignal<T>;
  }

  function getSignal(
    prop: string | symbol,
    target: T
  ): WritableSignal<unknown> | undefined {
    if (!signalMap.has(prop)) {
      const value = (target as any)[prop];
      const isObject = typeof value === 'object';
      const s = isObject ? nest(value) : value;
      signalMap.set(prop, signal(s));
    }
    const s = signalMap.get(prop);
    return s;
  }
}

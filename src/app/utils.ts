import { WritableSignal, signal } from '@angular/core';

export type DeepSignal<Type> = Type extends Array<object> ?
Array<WritableSignal<DeepSignal<Type[0]>>> :
{
  [Property in keyof Type]: Type[Property] extends object
    ? WritableSignal<DeepSignal<Type[Property]>>
    : WritableSignal<Type[Property]>;
};

export function nest<T>(value: T): DeepSignal<T> {
  const signalMap = new Map<string | symbol, WritableSignal<unknown>>();

  if (typeof value === 'object') {
    const deep = Array.isArray(value) ?
      [] as Array<DeepSignal<T>> :
      {} as DeepSignal<T>;

    for (const key of Object.keys(value as object)) {
      Object.defineProperty(deep, key, {
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
    return deep as DeepSignal<T>;
  } else {
    return value as DeepSignal<T>;
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


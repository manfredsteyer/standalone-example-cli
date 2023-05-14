import {
  Signal,
  WritableSignal,
  computed,
  isSignal,
  signal,
} from '@angular/core';

export type DeepWritableSignal<Type> = {
  [Property in keyof Type]: Type[Property] extends object
    ? WritableSignal<DeepWritableSignal<Type[Property]>>
    : WritableSignal<Type[Property]>;
};

export type DeepSignal<Type> = {
  [Property in keyof Type]: Type[Property] extends object
    ? Signal<DeepSignal<Type[Property]>>
    : Signal<Type[Property]>;
};

export type Projector<T, U> = (selector: T) => U;
export type Updater<T> = (value: T) => T;

export function createStore<T>(init: T) {
  const writeModel = nest(init);
  const readModel = toReadOnly(writeModel);

  const select = <U>(projector: Projector<DeepSignal<T>, U>): U => {
    return projector(readModel);
  };

  const selectValue = <U>(
    projector: Projector<DeepSignal<T>, Signal<U>>
  ): U => {
    const value = projector(readModel);
    return value();
  };


  function update<U extends Object>(
    projector: Projector<
      DeepWritableSignal<T>,
      WritableSignal<DeepWritableSignal<U>>
    >,
    valueOrUpdater: Updater<U> | U
  ): void;
  function update<U extends Object>(
    projector: Projector<
      DeepWritableSignal<T>,
      WritableSignal<WritableSignal<DeepWritableSignal<U>>[]>
    >,
    valueOrUpdater: Updater<U[]> | U[]
  ): void;
  function update(projector: any, valueOrUpdater: any) {
    const s = projector(writeModel);
    let value: unknown;

    if (typeof valueOrUpdater === 'function') {
      value = valueOrUpdater(s());
    } else {
      value = valueOrUpdater;
    }

    if (typeof value === 'object') {
      value = nest(value);
    }

    s.set(value);
  }

  return {
    state: readModel,
    select,
    selectValue,
    update,
  };
}

export function toReadOnly<T>(deep: DeepWritableSignal<T>): DeepSignal<T> {
  // Perhaps for Prod Mode?
  // return deep as DeepSignal<T>;

  const mirrorMap = new Map<string, Signal<unknown>>();

  const result = Array.isArray(deep)
    ? ([] as Array<DeepSignal<T>>)
    : ({} as DeepSignal<T>);

  for (const key of Object.keys(deep)) {
    Object.defineProperty(result, key, {
      enumerable: true,
      get() {
        const s = (deep as any)[key] as WritableSignal<any>;
        const mirror = getMirror(key, s);
        return mirror;
      },
    });
  }
  return result as DeepSignal<T>;

  function getMirror(key: string, s: WritableSignal<any>) {
    if (!mirrorMap.has(key)) {
      let mirror = createMirror(s);
      mirrorMap.set(key, mirror);
    }
    const mirror = mirrorMap.get(key)!;
    return mirror;
  }

  function createMirror(s: WritableSignal<any>) {
    return computed(() => {
      const value = s();
      if (typeof value === 'object') {
        return toReadOnly(value);
      } else {
        return value;
      }
    });
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
      const s = isSignal(value)
        ? value
        : isObject
        ? signal(nest(value))
        : signal(value);

      signalMap.set(prop, s as WritableSignal<unknown>);
    }
    const s = signalMap.get(prop);
    return s;
  }
}

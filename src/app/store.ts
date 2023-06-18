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
  [Property in keyof Type]: Type[Property] extends Object
    ? Signal<DeepSignal<Type[Property]>>
    : Signal<Type[Property]>;
};

export type Projector<T, U> = (selector: T) => U;
export type Updater<T> = (value: T) => T;

export function createStore<T>(init: T) {
  const writeModel = nest(init);
  const readModel = writeModel as unknown as DeepSignal<T>;

  function select<T2 extends keyof T>(segment: T2): Signal<DeepSignal<T[T2]>>;
  function select<T2 extends keyof T, T3 extends keyof T[T2]>(
    s1: T2,
    s2: T3
  ): Signal<DeepSignal<T[T2][T3]>>;
  function select<
    T2 extends keyof T,
    T3 extends keyof T[T2],
    T4 extends keyof T[T2][T3]
  >(s1: T2, s2: T3, s3: T4): Signal<DeepSignal<T[T2][T3][T4]>>;
  function select<
    T2 extends keyof T,
    T3 extends keyof T[T2],
    T4 extends keyof T[T2][T3],
    T5 extends keyof T[T2][T3][T4]
  >(s1: T2, s2: T3, s3: T4, s4: T5): Signal<DeepSignal<T[T2][T3][T4]>>;
  function select<U extends Signal<unknown>>(projector: Projector<DeepSignal<T>, U>): U;
  function select(...args: any[]) {
    if (typeof args[0] === 'function') {
      const projector = args[0];
      return projector(readModel);
    } else {
      return navigate(readModel, args as any)
    }
  }

  function selectWritable<T2 extends keyof T>(segment: T2): WritableSignal<DeepWritableSignal<T[T2]>>;
  function selectWritable<T2 extends keyof T, T3 extends keyof T[T2]>(
    s1: T2,
    s2: T3
  ): WritableSignal<DeepWritableSignal<T[T2][T3]>>;
  function selectWritable<
    T2 extends keyof T,
    T3 extends keyof T[T2],
    T4 extends keyof T[T2][T3]
  >(s1: T2, s2: T3, s3: T4): WritableSignal<DeepWritableSignal<T[T2][T3][T4]>>;
  function selectWritable<
    T2 extends keyof T,
    T3 extends keyof T[T2],
    T4 extends keyof T[T2][T3],
    T5 extends keyof T[T2][T3][T4]
  >(s1: T2, s2: T3, s3: T4, s4: T5): WritableSignal<DeepWritableSignal<T[T2][T3][T4]>>;
  function selectWritable<U extends WritableSignal<unknown>>(projector: Projector<DeepWritableSignal<T>, U>): U;
  function selectWritable(...args: any[]) {
    if (typeof args[0] === 'function') {
      const projector = args[0];
      return projector(readModel);
    } else {
      return navigate(readModel, args as any)
    }
  }

  function update<T2 extends keyof T>(
    segment: T2,
    valueOrUpdater: Updater<T[T2]> | Partial<T[T2]>
  ): void;
  function update<T2 extends keyof T, T3 extends keyof T[T2]>(
    s1: T2,
    s2: T3,
    valueOrUpdater: Updater<T[T2][T3]> | Partial<T[T2][T3]>
  ): void;
  function update<
    T2 extends keyof T,
    T3 extends keyof T[T2],
    T4 extends keyof T[T2][T3]
  >(
    s1: T2,
    s2: T3,
    s3: T4,
    valueOrUpdater: Updater<T[T2][T3][T4]> | Partial<T[T2][T3][T4]>
  ): void;
  function update<
    T2 extends keyof T,
    T3 extends keyof T[T2],
    T4 extends keyof T[T2][T3],
    T5 extends keyof T[T2][T3][T4]
  >(
    s1: T2,
    s2: T3,
    s3: T4,
    s4: T5,
    valueOrUpdater: Updater<T[T2][T3][T4][T5]> | Partial<T[T2][T3][T4][T5]>
  ): void;
  function update<U>(
    projector: Projector<
      DeepWritableSignal<T>,
      WritableSignal<DeepWritableSignal<U>> | WritableSignal<U>
    >,
    valueOrUpdater: Updater<U> | U
  ): void;
  function update<U>(
    projector: Projector<
      DeepWritableSignal<T>,
      | WritableSignal<WritableSignal<DeepWritableSignal<U>>[]>
      | WritableSignal<WritableSignal<U>[]>
    >,
    valueOrUpdater: Updater<U[]> | U[]
  ): void;
  function update<U>(
    projector: Projector<
      DeepWritableSignal<T>,
      WritableSignal<DeepWritableSignal<U>> | WritableSignal<U>
    >,
    valueOrUpdater: Updater<U> | Partial<U>
  ): void;  
  function update(...params: any[]) {
    let valueOrUpdater: any = params.pop();
    let s;

    if (typeof params[0] === 'string') {
      s = navigate.apply(null, [writeModel, ...params] as any);
    } else {
      const projector = params[0];
      s = projector(writeModel);
    }

    let value: unknown;

    if (typeof valueOrUpdater === 'function') {
      value = valueOrUpdater(s());
    } else {
      value = valueOrUpdater;
    }

    // if (typeof value !== 'object') {
    //   console.error('cannot update this value directly', s);
    //   return;
    // }

    value = nest(value);

    if (Array.isArray(value)) {
      s.set(value);
    } else if (typeof value === 'object') {
      (s as WritableSignal<object>).update((current) => ({
        ...current,
        ...(value as object),
      }));
    }
    else {
      s.set(value);
    }
  }

  function compute<U>(projector: Projector<DeepSignal<T>, U>) {
    return select(s => computed(() => projector(s)))
  }

  return {
    compute,
    selectWritable,
    select,
    update,
  };
}

type W1<T extends Signal<any>> = T extends Signal<infer U> ? U : never;
type W2<T extends DeepSignal<any>> = T extends DeepSignal<infer U> ? U : never;
type W<T extends Signal<any>> = W2<W1<T>>;

function isNullOrUndef<T>(v: T): boolean {
  return typeof v === 'undefined' || v === null;
}

export function navigate<T1 extends DeepSignal<any>, T2 extends keyof T1>(
  root: T1,
  segment: T2
): Signal<T1[T2]>;
export function navigate<
  T1 extends DeepSignal<any>,
  T2 extends keyof T1,
  T3 extends keyof W<T1[T2]>
>(root: T1, s1: T2, s2: T3): Signal<W<T1[T2]>[T3]>;
export function navigate<
  T1 extends DeepSignal<any>,
  T2 extends keyof T1,
  T3 extends keyof W<T1[T2]>,
  T4 extends keyof W<T1[T2]>[T3]
>(root: T1, s1: T2, s2: T3, s3: T4): Signal<W<T1[T2]>[T3][T4]>;
export function navigate<
  T1 extends DeepSignal<any>,
  T2 extends keyof T1,
  T3 extends keyof W<T1[T2]>,
  T4 extends keyof W<T1[T2]>[T3],
  T5 extends keyof W<T1[T2]>[T3][T4]
>(root: T1, s1: T2, s2: T3, s3: T4, s4: T5): Signal<W<T1[T2]>[T3][T4][T5]>;
export function navigate(root: any, ...segments: any[]) {
  let current = root;

  for (let i = 0; i < segments.length - 1; i++) {
    if (isNullOrUndef(current)) {
      return current;
    }
    const segment = segments[i];
    current = current[segment]();
  }

  return current[segments[segments.length - 1]];
}

export function toReadOnly<T>(deep: DeepWritableSignal<T>): DeepSignal<T> {
  // Perhaps just a side-cast to keep things simple and performat?
  return deep as DeepSignal<T>;

  // Perhaps for Prod Mode?
  // const mirrorMap = new Map<string, Signal<unknown>>();

  // const result = Array.isArray(deep)
  //   ? ([] as Array<DeepSignal<T>>)
  //   : ({} as DeepSignal<T>);

  // for (const key of Object.keys(deep)) {
  //   Object.defineProperty(result, key, {
  //     enumerable: true,
  //     get() {
  //       const s = (deep as any)[key] as WritableSignal<any>;
  //       const mirror = getMirror(key, s);
  //       return mirror;
  //     },
  //   });
  // }
  // return result as DeepSignal<T>;

  // function getMirror(key: string, s: WritableSignal<any>) {
  //   if (!mirrorMap.has(key)) {
  //     let mirror = createMirror(s);
  //     mirrorMap.set(key, mirror);
  //   }
  //   const mirror = mirrorMap.get(key)!;
  //   return mirror;
  // }

  // function createMirror(s: WritableSignal<any>) {
  //   return computed(() => {
  //     const value = s();
  //     if (typeof value === 'object') {
  //       return toReadOnly(value);
  //     } else {
  //       return value;
  //     }
  //   });
  // }
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

// export function flatten<T>(value: DeepSignal<T>): T {
//   if (typeof value !== 'object' || !value) {
//     return value;
//   }

//   let result = Array.isArray(value) ? ([] as T) : ({} as T);
//   for (const key of Object.keys(value)) {
//     (result as any)[key] = flatten((value as any)[key]());
//   }
//   return result;
// }


export function flatten<T>(value: DeepSignal<T>[] | DeepWritableSignal<T>[] | Signal<Signal<DeepSignal<T>>[]> | Signal<WritableSignal<DeepWritableSignal<T>>[]> ): T[];
export function flatten<T>(value: DeepSignal<T> | DeepWritableSignal<T> | Signal<DeepSignal<T>> | WritableSignal<DeepWritableSignal<T>> ): T;
export function flatten<T>(value: unknown): T | T[] {
  if (typeof value === 'function') {
    value = value();
  }

  if (typeof value !== 'object' || !value) {
    return value as T;
  }

  let result = Array.isArray(value) ? ([] as T) : ({} as T);
  for (const key of Object.keys(value)) {

    if (isSignal((value as any)[key])) {
      (result as any)[key] = flatten((value as any)[key]());
    }
    else {
      (result as any)[key] = (value as any)[key];

    }
  }
  return result;
}
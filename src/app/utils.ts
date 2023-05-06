import { WritableSignal, signal } from '@angular/core';

const $PROXY = Symbol('$PROXY');

export function isProxy<T>(obj: T): boolean {
  return !!(obj as any)[$PROXY];
}

export function state<T extends Object>(obj: T): T {
  const signalMap = new Map<string | symbol, WritableSignal<unknown>>();

  if (isProxy(obj)) {
    return obj;
  }

  return new Proxy(obj, {
    get(target: T, prop: string|symbol, receiver) {
      if (prop === $PROXY) {
        return receiver;
      }
      if (typeof (target as any)[prop] === 'function') {
        return (target as any)[prop];
      }
      const s = getSignal(prop, target);
      return s ? s() : undefined;
    },
    set(target: T, prop: string | symbol, value: T) {
      const s = getSignal(prop, target);
      if (typeof value === 'object') {
        value = state(value);
      }
      if (s) {
        s.set(value as any);
      } 
      (target as any)[prop] = value;
      return true;
    },
  });

  function getSignal(
    prop: string | symbol,
    target: T
  ): WritableSignal<unknown> | undefined {
    if (!signalMap.has(prop)) {
      const value = (target as any)[prop];
      const isObject = typeof value === 'object';
      const valueOrProxy = isObject ? state(value) : value;
      const s = signal<unknown>(valueOrProxy);
      signalMap.set(prop, s);
    }
    const s = signalMap.get(prop);
    return s;
  }
}


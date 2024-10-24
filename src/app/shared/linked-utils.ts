import { Signal, untracked, WritableSignal } from '@angular/core';
import { linkedSignal } from './linked/linked';

export type DeepLink<T> = {
  [K in keyof T]: WritableSignal<T[K]>;
};

export function deepLink<T extends Record<string, unknown>>(
  source: Signal<T>,
): DeepLink<T> {
  const value = untracked(source);
  const result: Record<string, WritableSignal<unknown>> = {};

  const keys = Object.keys(value);

  for (const key of keys) {
    result[key] = linkedSignal(() => source()[key]);
  }

  return result as DeepLink<T>;
}

export function flatten<T>(deepLink: DeepLink<T>): T {
  const result: Record<string | number | symbol, unknown> = {};

  const keys = Object.keys(deepLink) as Array<keyof T>;

  for (const key of keys) {
    result[key] = deepLink[key]();
  }

  return result as T;
}

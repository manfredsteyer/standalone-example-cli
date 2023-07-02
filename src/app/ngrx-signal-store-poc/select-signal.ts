import { computed, Signal, ValueEqualityFn } from '@angular/core';
import { defaultEqualityFn } from './equality-fn';

type SelectSignalConfig<T> = { equal: ValueEqualityFn<T> };

export function selectSignal<Result>(
  projector: () => Result,
  config?: SelectSignalConfig<Result>
): Signal<Result>;
export function selectSignal<Signals extends Signal<any>[], Result>(
  ...args: [
    ...signals: Signals,
    projector: (
      ...values: {
        [K in keyof Signals]: Signals[K] extends Signal<infer Value>
          ? Value
          : never;
      }
    ) => Result
  ]
): Signal<Result>;
export function selectSignal<Signals extends Signal<any>[], Result>(
  ...args: [
    ...signals: Signals,
    projector: (
      ...values: {
        [K in keyof Signals]: Signals[K] extends Signal<infer Value>
          ? Value
          : never;
      }
    ) => Result,
    config: SelectSignalConfig<Result>
  ]
): Signal<Result>;
export function selectSignal<Result>(...args: unknown[]): Signal<Result> {
  const selectSignalArgs = [...args];

  const config: SelectSignalConfig<Result> =
    typeof selectSignalArgs[selectSignalArgs.length - 1] === 'object'
      ? (selectSignalArgs.pop() as SelectSignalConfig<Result>)
      : { equal: defaultEqualityFn };
  const projector = selectSignalArgs.pop() as (...values: unknown[]) => Result;
  const signals = selectSignalArgs as Signal<unknown>[];

  const computation =
    signals.length === 0
      ? projector
      : () => {
          const values = signals.map((signal) => signal());
          return projector(...values);
        };

  return computed(computation, config);
}

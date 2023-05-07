export { $RAW, createStore, unwrap } from "./store";
export type {
  ArrayFilterFn,
  DeepMutable,
  DeepReadonly,
  NotWrappable,
  Part,
  SetStoreFunction,
  SolidStore,
  Store,
  StoreNode,
  StorePathRange,
  StoreSetter
} from "./store";
export * from "./mutable";
export * from "./modifiers";

// dev
import { $NODE, isWrappable, DevHooks } from "./store";
export const DEV = "_SOLID_DEV_" ? ({ $NODE, isWrappable, hooks: DevHooks } as const) : undefined;

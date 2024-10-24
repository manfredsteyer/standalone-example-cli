import { computed, Signal } from '@angular/core';
import { ResourceLoader, ResourceLoaderParams } from './resource/api';
import { resource } from './resource/resource';
import { Observable, of } from 'rxjs';

export function wait(
  msec: number,
  signal: AbortSignal | undefined = undefined,
) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timeoutId = setTimeout(() => {
      resolve();
    }, msec);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export function debounce<T, U>(
  loader: ResourceLoader<T, U>,
  time = 300,
): ResourceLoader<T, U> {
  return async (param) => {
    await wait(time, param.abortSignal);
    return await loader(param);
  };
}

export function skipInitial<T, U>(
  loader: ResourceLoader<T, U>,
): ResourceLoader<T, U> {
  let first = true;
  return (param) => {
    if (first) {
      first = false;
      return Promise.resolve<T>(undefined as T);
    }
    return loader(param);
  };
}

export function debounceTrue(computation: () => boolean, time = 300): Signal<boolean> {
  const value = computed(() => computation());
  
  const debouncedResource = resource({
    request: value,
    loader: async (param) => {
      const isLoading = param.request;
      if (isLoading) {
        await wait(time, param.abortSignal);
        return true;
      }
      return false;
    } 
  });

  return computed(() => debouncedResource.value() ?? false);
}

export type RxResourceLoader<T,R> = (params: ResourceLoaderParams<R>) => Observable<T>;

export function rxSkipInitial<T, U>(
  loader: RxResourceLoader<T, U>,
): RxResourceLoader<T, U> {
  let first = true;
  return (param) => {
    if (first) {
      first = false;
      return of(undefined as T);
    }
    return loader(param);
  };
}

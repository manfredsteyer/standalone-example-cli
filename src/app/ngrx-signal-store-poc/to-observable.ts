/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { effect, Signal } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

export function toObservable<T>(source: Signal<T>): Observable<T> {
  const signal$ = new Observable<T>((observer) => {
    const watcher = effect(() => {
      try {
        observer.next(source());
      } catch (err) {
        observer.error(err);
      }
    });

    return () => watcher.destroy();
  });

  return signal$.pipe(shareReplay({ bufferSize: 1, refCount: true }));
}

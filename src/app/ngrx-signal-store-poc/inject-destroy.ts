import { DestroyRef, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export function injectDestroy(): Observable<void> {
  const destroyRef = inject(DestroyRef);
  const destroy$ = new ReplaySubject<void>(1);

  destroyRef.onDestroy(() => {
    destroy$.next();
    destroy$.complete();
  });

  return destroy$;
}

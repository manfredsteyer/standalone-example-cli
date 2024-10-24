import { HttpRequest, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    console.log('LegacyInterceptor (root scope)');

    if (req.url.startsWith('https://demo.angulararchitects.io/api/')) {
        // Setting a dummy token for demonstration
        const headers = req.headers.set('Authorization', 'Bearer Legacy-1234567');
        req = req.clone({headers});
    }

    return next(req).pipe(
        tap(resp => console.log('response', resp))
    );
};

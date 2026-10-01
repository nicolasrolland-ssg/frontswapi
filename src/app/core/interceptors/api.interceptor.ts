import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (_request, next) => next(_request).pipe(
  catchError((error: HttpErrorResponse) => {
    const message = error.status === 0 ? 'Connexion au réseau impérial impossible.' : error.status === 404 ? 'Coordonnée introuvable dans les archives.' : 'Le système a rencontré une anomalie.';
    return throwError(() => ({ status: error.status, message, detail: error.message }));
  })
);

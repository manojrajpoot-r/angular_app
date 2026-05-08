import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(

    catchError((error) => {

      let message = 'Something went wrong';

      if (error.error?.message) {
        message = error.error.message;
      }

      Swal.fire('Error', message, 'error');

      return throwError(() => error);
    })
  );
};

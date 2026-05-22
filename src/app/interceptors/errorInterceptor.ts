import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import Swal from 'sweetalert2';

import {
  catchError,
  throwError
} from 'rxjs';

export const errorInterceptor:
  HttpInterceptorFn = (req, next) => {

    return next(req).pipe(

      catchError((error: HttpErrorResponse) => {

        let title = 'Error';

        let message =
          'Something went wrong';

        // ============================================
        // NETWORK ERROR
        // ============================================

        if (error.status === 0) {

          title = 'Network Error';

          message =
            'Please check your internet connection';

        }

        // ============================================
        // BAD REQUEST
        // ============================================

        else if (error.status === 400) {

          title = 'Bad Request';

          message =
            error.error?.message ||
            'Invalid request';

        }

        // ============================================
        // UNAUTHORIZED
        // ============================================

        else if (error.status === 401) {

          title = 'Unauthorized';

          message =
            error.error?.message ||
            'Session expired. Please login again';


          localStorage.clear();


          window.location.href =
            '/admin/login';

        }

        // ============================================
        // FORBIDDEN
        // ============================================

        else if (error.status === 403) {

          title = 'Forbidden';

          message =
            error.error?.message ||
            'You do not have permission';

        }

        // ============================================
        // NOT FOUND
        // ============================================

        else if (error.status === 404) {

          title = 'Not Found';

          message =
            error.error?.message ||
            'Requested resource not found';

        }

        // ============================================
        // VALIDATION ERROR
        // ============================================

        else if (error.status === 422) {

          title = 'Validation Error';

          // LARAVEL VALIDATION ERROR

          if (error.error?.errors) {

            const validationErrors =
              Object.values(
                error.error.errors
              ).flat();

            message =
              validationErrors.join('\n');

          } else {

            message =
              error.error?.message ||
              'Validation failed';

          }

        }

        // ============================================
        // SERVER ERROR
        // ============================================

        else if (error.status >= 500) {

          title = 'Server Error';

          message =
            error.error?.message ||
            'Internal server error';

        }

        // ============================================
        // CUSTOM MESSAGE
        // ============================================

        else if (error.error?.message) {

          message =
            error.error.message;

        }

        // ============================================
        // SWEET ALERT
        // ============================================

        Swal.fire({

          icon: 'error',

          title: title,

          text: message,

          confirmButtonText: 'OK'

        });

        // ============================================
        // THROW ERROR
        // ============================================

        return throwError(
          () => error
        );

      })

    );

  };

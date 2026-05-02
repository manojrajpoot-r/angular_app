import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {

  confirmDelete() {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  }

  success(message: string) {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0d6efd'
    });
  }

  error(message: string) {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }
}

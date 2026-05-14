import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl = environment.apiUrl + '/payment';

  constructor(private http: HttpClient) { }


  createOrder(amount: number) {
    return this.http.post(
      `${this.apiUrl}/create-order`,
      amount
    );

  }

  verifyPayment(data: any) {

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });

    return this.http.post(

      `${this.apiUrl}/verify`,
      data,
      { headers }

    );

  }



  checkout(data: any) {

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });

    return this.http.post(

      `${this.apiUrl}/checkout`,
      data,
      { headers }

    );

  }
  paymentFailed(orderId: number) {

    return this.http.post(
      `${this.apiUrl}/payment-failed`,
      {
        orderId: orderId
      }
    );

  }


}

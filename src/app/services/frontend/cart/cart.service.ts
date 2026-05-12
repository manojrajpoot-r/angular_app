import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl + '/cart';

  constructor(private http: HttpClient) { }
  private cartCountSource = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSource.asObservable();

  updateCartCount(count: number) {

    this.cartCountSource.next(count);

  }
  addToCart(data: any) {

    return this.http.post(
      `${this.apiUrl}/add`,
      data
    );

  }

  getCart() {
    return this.http.get(`${this.apiUrl}`);
  }

  increaseQuantity(id: number) {

    return this.http.put(
      `${this.apiUrl}/increase/${id}`,
      {}
    );

  }
  decreaseQuantity(id: number) {

    return this.http.put(
      `${this.apiUrl}/decrease/${id}`,
      {}
    );

  }

  removeCart(cartId: number) {

    return this.http.delete(
      `${this.apiUrl}/${cartId}`
    );

  }

}


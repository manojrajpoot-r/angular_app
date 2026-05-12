import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private apiUrl = environment.apiUrl + '/wishlist';

  private wishlistCountSource =
    new BehaviorSubject<number>(0);

  wishlistCount$ =
    this.wishlistCountSource.asObservable();

  updateWishlistCount(count: number) {

    this.wishlistCountSource.next(count);

  }

  // NEW

  private wishlistProductsSource =
    new BehaviorSubject<number[]>([]);

  wishlistProducts$ =
    this.wishlistProductsSource.asObservable();

  updateWishlistProducts(productIds: number[]) {

    this.wishlistProductsSource.next(productIds);

  }

  constructor(private http: HttpClient) { }

  addWishlist(data: any) {

    return this.http.post(
      `${this.apiUrl}/add`,
      data
    );

  }

  getWishlist(userId: number) {

    return this.http.get(
      `${this.apiUrl}/${userId}`
    );

  }

  removeWishlist(WishlistId: number) {

    return this.http.delete(
      `${this.apiUrl}/${WishlistId}`
    );

  }

}

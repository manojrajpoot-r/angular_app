import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl + '/cart';
  
  constructor(private http: HttpClient) { }

  addToCart(data:any){

    return this.http.post(
      `${this.apiUrl}/add`,
      data
    );

  }
  getCart(){
  return this.http.get(`${this.apiUrl}`);
}

increase(id:number){
  return this.http.put(
    `${this.apiUrl}/increase/${id}`,
    {}
  );
}

decrease(id:number){
  return this.http.put(
    `${this.apiUrl}/decrease/${id}`,
    {}
  );
}

remove(id:number){
  return this.http.delete(
    `${this.apiUrl}/${id}`
  );
}

}


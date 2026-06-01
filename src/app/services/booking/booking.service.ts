
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {

  private apiUrl = environment.apiUrl + '/booking';

  constructor(private http: HttpClient) { }

  getBookings(
    pageNumber: number,
    pageSize: number,
    search: string
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/list`,
      {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    );
  }

  getBookingById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addBooking(data: any) {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateBooking(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/update`, data);
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  statusBooking(id: number) {
    return this.http.get(`${this.apiUrl}/status/${id}`);
  }

  getAllBookings() {
    return this.http.get(`${this.apiUrl}/frontend`);

  }

  getUserBookings(userId: number) {
    return this.http.get(
      `${this.apiUrl}/user/${userId}`
    );
  }


}

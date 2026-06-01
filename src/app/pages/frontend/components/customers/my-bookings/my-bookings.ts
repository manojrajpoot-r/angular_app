import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../../../services/booking/booking.service';
import { Router, RouterLink } from '@angular/router';

@Component({

  standalone: true,
  imports: [RouterLink],
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.html'
})
export class MyBookingsComponent implements OnInit {

  bookings: any[] = [];

  constructor(private bookingService: BookingService, private router: Router) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    const userId = user?.id;





    this.bookingService.getUserBookings(Number(userId))
      .subscribe({
        next: (res: any) => {
          this.bookings = res.data;
        }
      });
  }



}

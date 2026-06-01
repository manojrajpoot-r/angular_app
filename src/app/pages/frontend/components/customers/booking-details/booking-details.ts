import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../../../services/booking/booking.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './booking-details.html',
  styleUrl: './booking-details.css',
})
export class BookingDetails implements OnInit {

  booking: any;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');


    if (id) {

      this.getBookingDetails(Number(id));
    }
  }

  getBookingDetails(id: number) {
    this.bookingService.getBookingById(id).subscribe({
      next: (res: any) => {
        this.booking = res.data;
        console.log(this.booking);
      }
    });
  }
}

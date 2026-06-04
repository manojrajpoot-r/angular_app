

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { BookingService } from '../../../services/booking/booking.service';
import { AlertService } from '../../../services/alert/alert.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component/pagination.component';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent implements OnInit {

  bookings: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private bookingService: BookingService,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadBookings();

    // SEARCH OPTIMIZATION
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadBookings();
      });
  }

  // LOAD DATA
  loadBookings(): void {

    this.loading = true;

    this.bookingService
      .getBookings(
        this.pageNumber,
        this.pageSize,
        this.search
      )
      .subscribe({
        next: (response) => {

          this.bookings = response.data;
          this.totalRecords = response.totalRecords;
          this.loading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          this.loading = false;
          this.alertService.error('Failed to load bookings');
          this.cdr.markForCheck();
        }
      });
  }


  // SEARCH
  onSearch(event: any): void {
    this.search = event.target.value;
    this.searchSubject.next(this.search);
  }

  // PAGINATION
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadBookings();
  }

  addBooking(): void {

    this.router.navigate(['admin/bookings/add']);
  }
  // EDIT
  editBooking(id: number): void {

    this.router.navigate(['admin/bookings/edit', id]);
  }

  // DELETE
  deleteBooking(id: number): void {

    this.alertService.confirmDelete()
      .then((result: any) => {

        if (result.isConfirmed) {

          this.bookingService
            .deleteBooking(id)
            .subscribe({

              next: (response: any) => {
                this.alertService.success(response.message);
                this.loadBookings();
              },

              error: () => {

                this.alertService.error('Delete failed');
              }
            });
        }
      });
  }

  // STATUS CHANGE
  changeStatus(booking: any): void {

    this.bookingService.changeStatus(booking.id)
      .subscribe({
        next: (res) => {

          this.alertService.success('Status updated');

          this.loadBookings();
        },
        error: () => {
          this.alertService.error('Status update failed');
        }
      });
  }




  changeBookingStatus(id: number): void {

    this.bookingService
      .changeBookingStatus(id)
      .subscribe({
        next: (res) => {
          this.alertService.success('Status Booking updated');
          this.loadBookings();
        }
      });
  }

  changePaymentStatus(id: number): void {

    this.bookingService
      .changePaymentStatus(id)
      .subscribe({
        next: (res) => {
          this.alertService.success('Payment Status updated');
          this.loadBookings();
        }
      });
  }








  // TRACKBY PERFORMANCE
  trackById(index: number, item: any): number {

    return item.id;
  }
}


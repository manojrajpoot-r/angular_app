import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ServiceSevice } from '../../../../../services/service/service.service';
import { BookingService } from '../../../../../services/booking/booking.service';
import { AlertService } from '../../../../../services/alert/alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-booking-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {

  form!: FormGroup;
  services: any[] = [];
  selectedServices: number[] = [];
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private service: ServiceSevice,
    private alert: AlertService,
    private booking: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const storedUser = localStorage.getItem('user');

    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    const userId = user?.id;
    setTimeout(() => {
      this.form.patchValue({
        userId: userId
      });
    });





    this.form = this.fb.group({

      userId: [''],
      bookingDate: [''],
      bookingTime: [''],
      paymentMethod: ['Cash'],
      notes: [''],
      address: [''],
      serviceIds: [[]]
    });

    this.getServices();
  }

  // GET SERVICES
  getServices() {

    this.service.getAllServices().subscribe({
      next: (res: any) => {
        this.services = res.data;
      },

      error: (err) => {
        this.alert.error(err);
      }
    });
  }



  // CHECKBOX
  onServiceChange(event: any) {
    const id = +event.target.value;

    if (event.target.checked) {
      this.selectedServices.push(id);
    } else {
      this.selectedServices =
        this.selectedServices.filter(x => x != id);
    }

    this.form.patchValue({
      serviceIds: this.selectedServices
    });

    this.calculateTotal();
  }

  // TOTAL
  calculateTotal() {

    this.totalAmount = this.services
      .filter(x =>
        this.selectedServices.includes(x.id))
      .reduce((sum, item) =>
        sum + item.price, 0);
  }

  // SUBMIT
  submit() {
    this.booking.addBooking(this.form.value).subscribe({
      next: (res) => {
        this.alert.success('Booking Added Successfully');
        this.form.reset();
        this.totalAmount = 0;
        this.selectedServices = [];
      },

      error: (err) => {
        this.alert.error(err);
      }
    });
  }
}

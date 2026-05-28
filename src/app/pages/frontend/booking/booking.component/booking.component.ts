import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking.html'
})
export class BookingComponent implements OnInit {

  form!: FormGroup;

  services: any[] = [];

  selectedServices: number[] = [];

  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

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

    this.http.get<any>(
      'https://localhost:7284/api/services/frontend'
    ).subscribe({

      next: (res) => {

        console.log(res);

        this.services = res.data;
      },

      error: (err) => {
        console.log(err);
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

    console.log(this.form.value);

    this.http.post(
      'https://localhost:7284/api/booking/add',
      this.form.value
    ).subscribe({

      next: (res) => {

        console.log(res);

        alert('Booking Added Successfully');

        this.form.reset();

        this.totalAmount = 0;

        this.selectedServices = [];
      },

      error: (err) => {

        console.log(err);
      }
    });
  }
}

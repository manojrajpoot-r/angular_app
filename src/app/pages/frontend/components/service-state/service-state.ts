import { Component } from '@angular/core';
import { ServiceSevice } from '../../../../services/service/service.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Modal } from 'bootstrap';
import { environment } from "../../../../environments/environment";

import { RouterModule } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-service-state',
  imports: [CommonModule, RouterModule],
  templateUrl: './service-state.html',
  styleUrl: './service-state.css',
})


export class ServiceState {
  services: any[] = [];
  imgurls = environment.apiUrlImage;
  pageNumber: number = 1
  constructor(
    private service: ServiceSevice,
    private alert: AlertService,
    private auth: AuthService,
    private router: Router,


  ) { }

  ngOnInit(): void {
    this.getServices();
  }

  openBooking() {
    if (!this.auth.isLoggedIn()) {
      const modalEl = document.getElementById('loginModal');

      if (modalEl) {
        const modal = new Modal(modalEl);
        modal.show();
      }

      return;
    }

    this.router.navigate(['bookings'])
  }



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
}

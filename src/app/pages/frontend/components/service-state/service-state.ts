import { Component } from '@angular/core';
import { ServiceSevice } from '../../../../services/service/service.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-service-state',
  imports: [CommonModule],
  templateUrl: './service-state.html',
  styleUrl: './service-state.css',
})
export class ServiceState {
  services:any[] = [];

constructor( 
  private service:ServiceSevice,
  private alert:AlertService,
  private auth:AuthService,
  private router:Router

){}

  ngOnInit(): void {
    this.getServices();
  }

  openBooking(){
    if(!this.auth.isLoggedIn()){
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
      next: (res:any) => {
        console.log(res.data);
        this.services = res.data;
      },

      error: (err) => {
        this.alert.error(err);
      }
    });
  }
}

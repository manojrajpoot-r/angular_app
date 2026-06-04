import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServiceSevice } from '../../../../services/service/service.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-details.html',
  styleUrls: ['./service-details.css']
})
export class ServiceDetailsComponent implements OnInit {

  service: any;
  loading = true;
  imgurl = environment.apiUrlImage;
  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceSevice,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.serviceService.getServiceById(id)
      .subscribe({
        next: (res: any) => {

          this.service = res.data;
          this.loading = false;
        },
        error: () => {

          this.loading = false;
        }
      });
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
}

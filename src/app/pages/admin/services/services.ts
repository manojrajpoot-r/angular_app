
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ServiceSevice } from '../../../services/service/service.service';
import { AlertService } from '../../../services/alert/alert.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component/pagination.component';
import { DurationPipe } from '../../../shared/pipes/duration-pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    DurationPipe
  ],
  templateUrl: './services.html',
  styleUrl: './services.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements OnInit {

  services: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private serviceService: ServiceSevice,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.getloadServices();

    // SEARCH OPTIMIZATION
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.getloadServices();
      });
  }

  // LOAD DATA
  getloadServices(): void {

    this.loading = true;

    this.serviceService
      .getloadServices(
        this.pageNumber,
        this.pageSize,
        this.search
      )
      .subscribe({
        next: (response) => {

          this.services = response.data;
          this.totalRecords = response.totalRecords;
          this.loading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          this.loading = false;
          this.alertService.error('Failed to load services');
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

    this.getloadServices();
  }

  addService(): void {

    this.router.navigate(['admin/services/add']);
  }
  // EDIT
  editService(id: number): void {

    this.router.navigate(['admin/services/edit', id]);
  }

  // DELETE
  deleteService(id: number): void {

    this.alertService.confirmDelete()
      .then((result: any) => {

        if (result.isConfirmed) {

          this.serviceService
            .deleteService(id)
            .subscribe({

              next: (response: any) => {

                this.alertService.success(response.message);

                this.getloadServices();
              },

              error: () => {

                this.alertService.error('Delete failed');
              }
            });
        }
      });
  }

  // STATUS CHANGE
  changeStatus(service: any): void {

    service.isActive = !service.isActive;

    // AGAR API HAI
    // this.colorService.changeStatus(color.id)

    this.alertService.success('Status updated');
  }

  // TRACKBY PERFORMANCE
  trackById(index: number, item: any): number {

    return item.id;
  }
}


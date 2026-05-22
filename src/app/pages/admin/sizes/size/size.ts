
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SizeService } from '../../../../services/sizes/size';
import { AlertService } from '../../../../services/alert/alert.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';


@Component({
  selector: 'app-size',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './size.html',
  styleUrl: './size.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SizeComponent implements OnInit {

  sizes: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private sizeservice: SizeService,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadsizes();

    // SEARCH OPTIMIZATION
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadsizes();
      });
  }

  // LOAD DATA
  loadsizes(): void {

    this.loading = true;

    this.sizeservice
      .getSizes(
        this.pageNumber,
        this.pageSize,
        this.search
      )
      .subscribe({
        next: (response) => {

          this.sizes = response.data;
          console.log(this.sizes);
          this.totalRecords = response.totalRecords;
          this.loading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          this.loading = false;
          this.alertService.error('Failed to load sizes');
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
    this.loadsizes();
  }

  addSize(): void {
    this.router.navigate(['admin/sizes/add']);
  }
  // EDIT
  editSize(id: number): void {

    this.router.navigate(['admin/sizes/edit', id]);
  }

  // DELETE
  deleteSize(id: number): void {
    this.alertService.confirmDelete()
      .then((result: any) => {
        if (result.isConfirmed) {
          this.sizeservice
            .deleteSize(id)
            .subscribe({
              next: (response: any) => {
                this.alertService.success(response.message);
                this.loadsizes();
              },

              error: () => {
                this.alertService.error('Delete failed');
              }
            });
        }
      });
  }

  // STATUS CHANGE
  changeStatus(size: any): void {

    size.isActive = !size.isActive;
    this.alertService.success('Status updated');
  }

  // TRACKBY PERFORMANCE
  trackById(index: number, item: any): number {

    return item.id;
  }
}

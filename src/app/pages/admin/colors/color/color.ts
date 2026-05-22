import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ColorService } from '../../../../services/colors/color';
import { AlertService } from '../../../../services/alert/alert.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';


@Component({
  selector: 'app-color',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './color.html',
  styleUrl: './color.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorComonent implements OnInit {

  colors: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private colorService: ColorService,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadColors();

    // SEARCH OPTIMIZATION
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadColors();
      });
  }

  // LOAD DATA
  loadColors(): void {

    this.loading = true;

    this.colorService
      .getColors(
        this.pageNumber,
        this.pageSize,
        this.search
      )
      .subscribe({
        next: (response) => {

          this.colors = response.data;
          this.totalRecords = response.totalRecords;
          this.loading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          this.loading = false;
          this.alertService.error('Failed to load colors');
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

    this.loadColors();
  }

  addColor(): void {

    this.router.navigate(['admin/colors/add']);
  }
  // EDIT
  editColor(id: number): void {

    this.router.navigate(['admin/colors/edit', id]);
  }

  // DELETE
  deleteColor(id: number): void {

    this.alertService.confirmDelete()
      .then((result: any) => {

        if (result.isConfirmed) {

          this.colorService
            .deleteColor(id)
            .subscribe({

              next: (response: any) => {

                this.alertService.success(response.message);

                this.loadColors();
              },

              error: () => {

                this.alertService.error('Delete failed');
              }
            });
        }
      });
  }

  // STATUS CHANGE
  changeStatus(color: any): void {

    color.isActive = !color.isActive;

    // AGAR API HAI
    // this.colorService.changeStatus(color.id)

    this.alertService.success('Status updated');
  }

  // TRACKBY PERFORMANCE
  trackById(index: number, item: any): number {

    return item.id;
  }
}

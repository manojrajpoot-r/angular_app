import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,   // ✅ MOST IMPORTANT
  imports: [CommonModule], // ✅ ngFor ke liye
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {

  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    this.pageChange.emit(page);
  }
}

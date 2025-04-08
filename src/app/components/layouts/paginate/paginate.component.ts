import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginate',
  imports: [CommonModule],
  templateUrl: './paginate.component.html',
  styleUrl: './paginate.component.css'
})
export class PaginateComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {

    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {

    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {

    this.currentPage = page;
    this.pageChange.emit(page);
  }
}

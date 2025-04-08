import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import swal from 'sweetalert2';
import { PaginateComponent } from '../../layouts/paginate/paginate.component';

@Component({
  selector: 'app-index',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    PaginateComponent
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  books: any[] = [];
  apiUrl = environment.apiUrl;

  // Paginate data
  currentPage = 1;
  itemsPerPage = 5;

  private http = inject(HttpClient);

  ngOnInit(): void {

    this.http.get<any[]>(this.apiUrl+'/books').subscribe(data => {
      this.books = data;
    });
  }

  deleteBook(id: number): void {

    swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.delete(id);
      }
    });
  }

  delete(id: number): void {

    this.http.delete(this.apiUrl+'/books/delete/'+id, { responseType: 'text' }).subscribe(() => {

      this.ngOnInit();
      swal.fire(
        'Eliminado!',
        'El libro ha sido eliminado.',
        'success'
      );
    }, error => {

      swal.fire(
        'Error!',
        'No se pudo eliminar el libro.',
        'error'
      );
      console.error('Error deleting book:', error);
    });
  }

  get paginatedData() {

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.books.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {

    this.currentPage = page;
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import swal from 'sweetalert2';
import { PaginateComponent } from '../../layouts/paginate/paginate.component';
import axios from 'axios';

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

  async ngOnInit(): Promise<void> {

    await axios.get(this.apiUrl+'/books')
    .then(response => {

      this.books = response.data;
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'No se pudo obtener los libros.',
        'error'
      );
      console.error(error);
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

  async delete(id: number): Promise<void> {

    await axios.delete(this.apiUrl+'/books/delete/'+id)
    .then(() => {

      swal.fire(
        'Eliminado!',
        'El libro ha sido eliminado.',
        'success'
      );
      this.ngOnInit();
    })
    .catch(error => {

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

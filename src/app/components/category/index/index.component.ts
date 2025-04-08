import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
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
  categories: any[] = [];
  apiUrl = environment.apiUrl;

  // Paginate data
  currentPage = 1;
  itemsPerPage = 5;

  private http = inject(HttpClient);

  ngOnInit(): void {

    this.http.get<any[]>(this.apiUrl+'/categories').subscribe(data => {
      this.categories = data;
    });
  }

  deleteCategory(id: number): void {

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

    this.http.delete(this.apiUrl+'/categories/delete/'+id, { responseType: 'text' }).subscribe(() => {
      this.ngOnInit();

      swal.fire(
        'Eliminado!',
        'La categoría ha sido eliminada.',
        'success'
      );
    }, error => {

      console.error('Error deleting category:', error);
      swal.fire(
        'Error!',
        'No se pudo eliminar la categoría.',
        'error'
      );
    });
  }

  get paginatedData() {

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.categories.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {

    this.currentPage = page;
  }

}

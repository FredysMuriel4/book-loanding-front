import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
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
  categories: any[] = [];
  apiUrl = environment.apiUrl;

  // Paginate data
  currentPage = 1;
  itemsPerPage = 5;

  async ngOnInit(): Promise<void> {

    await axios.get(this.apiUrl+'/categories')
    .then(response => {

      this.categories = response.data;
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'No se pudieron cargar las categorías.',
        'error'
      );
      console.log(error);
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

  async delete(id: number): Promise<void> {

    await axios.delete(this.apiUrl+'/categories/delete/'+id).then(response => {

      this.ngOnInit();
      swal.fire(
        'Eliminado!',
        'La categoría ha sido eliminada.',
        'success'
      );
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'No se pudo eliminar la categoría.',
        'error'
      );
      console.log(error);
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

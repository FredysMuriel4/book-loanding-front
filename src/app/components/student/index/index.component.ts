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
  students: any[] = [];
  apiUrl = environment.apiUrl;

  // Paginate data
  currentPage = 1;
  itemsPerPage = 5;

  async ngOnInit(): Promise<void> {

    await axios.get(this.apiUrl+'/students')
    .then(response => {

      this.students = response.data;
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'Error al cargar los estudiantes.',
        'error'
      );
      console.log(error);
    });
  }

  deleteStudent(id: number): void {

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

    await axios.delete(this.apiUrl+'/students/delete/'+id, { responseType: 'text' })
    .then(() => {

      swal.fire(
        'Eliminado!',
        'El estudiante ha sido eliminado.',
        'success'
      );
      this.ngOnInit();
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'No se pudo eliminar el estudiante.',
        'error'
      );
      console.log(error);
    });
  }

  get paginatedData() {

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.students.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {

    this.currentPage = page;
  }

}

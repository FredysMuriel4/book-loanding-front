import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  students: any[] = [];
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  ngOnInit(): void {

    this.http.get<any[]>(this.apiUrl+'/students').subscribe(data => {
      this.students = data;
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

  delete(id: number): void {

    this.http.delete(this.apiUrl+'/students/delete/'+id, { responseType: 'text' }).subscribe(() => {

      this.ngOnInit();

      swal.fire(
        'Eliminado!',
        'El usuario ha sido eliminado.',
        'success'
      );
    }, error => {

      console.log(error);
      swal.fire(
        'Error!',
        'No se pudo eliminar el usuario.',
        'error'
      );
    });
  }

}

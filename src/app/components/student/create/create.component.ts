import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CaseConverterService } from '../../../utils/case-converter.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  student: any = {
    firstName: null,
    lastName: null,
    email: null,
    identificationNumber: null,
    address: null,
  }
  isEditing: boolean = false;
  id: any = null;
  apiUrl = environment.apiUrl;

  constructor(private caseConverter: CaseConverterService) {}

  private http = inject(HttpClient);

  ngOnInit(): void {

    const url = window.location.href;
    if (url.includes('edit')) {

      this.isEditing = true;
      this.id = url.split('/').pop();

      this.http.get(this.apiUrl+'/students/'+this.id).subscribe(data =>{
          this.student = data;
        } , error => {

          swal.fire(
            'Error',
            'Error al cargar el estudiante',
            'error'
          );
          console.log(error);
        }
      );
    }
  }

  createOrUpdateStudent(): void {

    if(this.student.firstName == null || this.student.lastName == null || this.student.email == null || this.student.identificationNumber == null || this.student.address == null) {

      swal.fire(
        'Error',
        'Por favor complete todos los campos',
        'error'
      );
      return;
    }

    swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then((result: any) => {

        if (result.isConfirmed) {

          if(this.isEditing) {

            this.updateStudent();
            return;
          }

          this.storeStudent();
        }
      });
  }

  storeStudent(): void {

    const formattedStudent = this.caseConverter.toSnakeCase(this.student);

    this.http.post(this.apiUrl+'/students/save', formattedStudent).subscribe(data => {

      swal.fire(
        'Creado!',
        'El estudiante ha sido creado.',
        'success'
      );
      location.href = '/students';
    }, error => {

      swal.fire(
        'Error',
        'Error al crear el estudiante',
        'error'
      );
      console.log(error);
    });
  }

  updateStudent(): void {

    const formattedStudent = this.caseConverter.toSnakeCase(this.student);

    this.http.put(this.apiUrl+'/students/update/'+this.id, formattedStudent).subscribe(data => {

      swal.fire(
        'Actualizado!',
        'El estudiante ha sido actualizado.',
        'success'
      );
      location.href = '/students';
    }, error => {

      swal.fire(
        'Error',
        'Error al actualizar el estudiante',
        'error'
      );
      console.log(error);
    });
  }

}

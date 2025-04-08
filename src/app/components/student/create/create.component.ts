import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CaseConverterService } from '../../../utils/case-converter.service';
import swal from 'sweetalert2';
import axios from 'axios';

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

  async ngOnInit(): Promise<void> {

    const url = window.location.href;
    if (url.includes('edit')) {

      this.isEditing = true;
      this.id = url.split('/').pop();

      await axios.get(this.apiUrl+'/students/'+this.id)
      .then(response => {

        this.student = response.data;
      })
      .catch(error => {

        swal.fire(
          'Error',
          'Error al cargar el estudiante',
          'error'
        );
        console.log(error);
      });
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

  async storeStudent(): Promise<void> {

    const formattedStudent = this.caseConverter.toSnakeCase(this.student);

    await axios.post(this.apiUrl+'/students/save', formattedStudent)
    .then(() => {

      swal.fire(
        'Creado!',
        'El estudiante ha sido creado.',
        'success'
      );
      location.href = '/students';
    })
    .catch(error => {

      swal.fire(
        'Error',
        'Error al crear el estudiante',
        'error'
      );
      console.log(error);
    });
  }

  async updateStudent(): Promise<void> {

    const formattedStudent = this.caseConverter.toSnakeCase(this.student);

    await axios.put(this.apiUrl+'/students/update/'+this.id, formattedStudent)
    .then(() => {

      swal.fire(
        'Actualizado!',
        'El estudiante ha sido actualizado.',
        'success'
      );
      location.href = '/students';
    })
    .catch(error => {

      swal.fire(
        'Error',
        'Error al actualizar el estudiante',
        'error'
      );
      console.log(error);
    });
  }

}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CaseConverterService } from '../../../utils/case-converter.service';

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
          console.log(data);
          this.student = data;
        } , error => {
          alert('Error al cargar el estudiante');
        }
      );
    }
  }

  createOrUpdateStudent(): void {

    if(!this.isEditing) {

      this.storeStudent();
      return;
    }

    this.updateStudent();
  }

  storeStudent(): void {

    const formattedStudent = this.caseConverter.toSnakeCase(this.student);

    this.http.post(this.apiUrl+'/students/save', formattedStudent).subscribe(data => {
      alert('Estudiante creado correctamente');
      location.href = '/students';
    }, error => {
      alert('Error al crear estudiante');
      console.log(error);
    });
  }

  updateStudent(): void {

    const formattedStudent = this.caseConverter.toSnakeCase(this.student);

    this.http.put(this.apiUrl+'/students/update/'+this.id, formattedStudent).subscribe(data => {
      alert('Estudiante actualizado correctamente');
      location.href = '/students';
    }, error => {
      alert('Error al actualizar catgoría');
      console.log(error);
    });
  }

}

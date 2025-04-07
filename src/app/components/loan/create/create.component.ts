import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  isEditing: boolean = false;
  query: string = '';
  id: any = null;
  apiUrl = environment.apiUrl;
  students: any[] = [];
  student: any = {
    identificationNumber: '',
    name: '',
    lastName: '',
    email: '',
    phone: ''
  };

  private http = inject(HttpClient);

  ngOnInit(): void {

    const url = window.location.href;
    if (url.includes('edit')) {

      this.isEditing = true;
      this.id = url.split('/').pop();

    //   this.http.get(this.apiUrl+'/books/'+this.id).subscribe(data =>{
    //       this.book = data;
    //     } , error => {
    //       alert('Error al cargar el libro');
    //     }
    //   );
    }

    this.http.get<any[]>(this.apiUrl+'/students').subscribe(data => {
      console.log(data)
      this.students = data;
    });

  }

  searchStudent(): void {

    const student = this.students.find(student => {
      return student.identificationNumber == this.query;
    });

    if(!student) {
      alert('No se encontró el estudiante con el número de identificación: ' + this.query);
      this.student = {
        identificationNumber: '',
        name: '',
        lastName: '',
        email: '',
        phone: ''
      }
      return;
    }

    this.student = student;
  }

}

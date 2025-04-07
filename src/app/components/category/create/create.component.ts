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
  category: any = {
    name: null,
    description: null
  }
  apiUrl = environment.apiUrl;
  isEditing: boolean = false;
  id: any = null;

  private http = inject(HttpClient);

  ngOnInit(): void {

    const url = window.location.href;
    if (url.includes('edit')) {

      this.isEditing = true;
      this.id = url.split('/').pop();

      this.http.get(this.apiUrl+'/categories/'+this.id).subscribe(data =>{
          this.category = data;
        } , error => {
          alert('Error al cargar la categoría');
        }
      );
    }
  }

  createOrUpdateCategory(): void {

    if(!this.isEditing) {

      this.storeCategory();
      return;
    }

    this.updateCategory();
  }

  storeCategory(): void {

    this.http.post(this.apiUrl+'/categories/save', this.category).subscribe(data => {
      alert('Categoría creada correctamente');
      location.href = '/categories';
    }, error => {
      alert('Error al crear categoría');
      console.log(error);
    });
  }

  updateCategory(): void {

    this.http.put(this.apiUrl+'/categories/update/'+this.id, this.category).subscribe(data => {
      alert('Categoria actualizada correctamente');
      location.href = '/categories';
    }, error => {
      alert('Error al actualizar catgoría');
      console.log(error);
    });
  }

}

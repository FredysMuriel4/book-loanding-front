import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

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
          console.log(error);
          swal.fire(
            'Error',
            'Error al cargar la categoría',
            'error'
          );
        }
      );
    }
  }

  createOrUpdateCategory(): void {

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
          this.updateCategory();
          return;
        }
        this.storeCategory();
      }
    });
  }

  storeCategory(): void {

    this.http.post(this.apiUrl+'/categories/save', this.category).subscribe(data => {

      swal.fire(
        'Creado!',
        'La categoría ha sido creada.',
        'success'
      );

      location.href = '/categories';
    }, error => {

      swal.fire(
        'Error',
        'Error al crear la categoría',
        'error'
      );
      console.log(error);
    });
  }

  updateCategory(): void {

    this.http.put(this.apiUrl+'/categories/update/'+this.id, this.category).subscribe(data => {

      swal.fire(
        'Actualizado!',
        'La categoría ha sido actualizada.',
        'success'
      );

      location.href = '/categories';
    }, error => {

      swal.fire(
        'Error',
        'Error al actualizar la categoría',
        'error'
      );
      console.log(error);
    });
  }

}

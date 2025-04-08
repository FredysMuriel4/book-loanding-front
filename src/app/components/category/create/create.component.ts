import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import swal from 'sweetalert2';
import axios from 'axios';

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

  async ngOnInit(): Promise<void> {

    const url = window.location.href;
    if (url.includes('edit')) {

      this.isEditing = true;
      this.id = url.split('/').pop();

      await axios.get(this.apiUrl+'/categories/'+this.id)
      .then(response => {

        this.category = response.data;
      })
      .catch(error =>  {

        swal.fire(
          'Error',
          'Error al cargar la categoría',
          'error'
        );
        console.log(error);
      });
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

  async storeCategory(): Promise<void> {

    await axios.post(this.apiUrl+'/categories/save', this.category)
    .then(() => {

      swal.fire(
        'Creado!',
        'La categoría ha sido creada.',
        'success'
      );
      location.href = '/categories';
    })
    .catch(error => {

      swal.fire(
        'Error',
        'Error al crear la categoría',
        'error'
      );
      console.log(error);
    });
  }

  async updateCategory(): Promise<void> {

    await axios.put(this.apiUrl+'/categories/update/'+this.id, this.category)
    .then(() => {

      swal.fire(
        'Actualizado!',
        'La categoría ha sido actualizada.',
        'success'
      );
      location.href = '/categories';
    })
    .catch(error => {

      swal.fire(
        'Error',
        'Error al actualizar la categoría',
        'error'
      );
      console.log(error);
    });
  }

}

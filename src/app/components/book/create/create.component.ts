import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import swal from 'sweetalert2';
import { PaginateComponent } from '../../layouts/paginate/paginate.component';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule,
    CommonModule,
    PaginateComponent
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  book: any = {
    title: '',
    author: '',
    stock: 0,
    image_url: '',
    imageUrl: '',
    description: '',
    categories: []
  }
  apiUrl = environment.apiUrl;
  categories: any[] = [];
  selectedCategory: any = null;
  isEditing: boolean = false;
  id: any = null;

  // Paginate data
  currentPage = 1;
  itemsPerPage = 3;

  private http = inject(HttpClient);

  ngOnInit(): void {

    const url = window.location.href;
    if (url.includes('edit')) {

      this.isEditing = true;
      this.id = url.split('/').pop();

      this.http.get(this.apiUrl+'/books/'+this.id).subscribe(data =>{

        this.book = data;
      } , error => {

        swal.fire(
          'Error',
          'Error al cargar el libro',
          'error'
        );
        console.log(error);
      });
    }

    this.http.get<any[]>(this.apiUrl+'/categories').subscribe(data => {
      this.categories = data;
    });

  }

  addCategory(): void {

    if (this.selectedCategory) {
      const category = this.categories.find(cat => {
        if (cat.id == this.selectedCategory) {
          return cat;
        }
      });
      if (category) {
        const exists = this.book.categories.find((cat:any) => cat.id == category.id);
        if (exists) {

          swal.fire(
            'Error',
            'La categoria ya existe en el libro!',
            'error'
          );
          return;
        }
        this.book.categories.push(category);
        this.selectedCategory = null;
      }
    }
  }

  deleteCategory(id: number): void {

    const index = this.book.categories.findIndex((cat:any) => cat.id == id);
    if (index !== -1) {
      this.book.categories.splice(index, 1);
    }
  }

  createOrUpdateBook(): void {

    const bookIds = this.book.categories.map((cat:any) => cat.id);
    this.book.categories = bookIds;
    this.book.image_url = this.book.imageUrl;

    if (this.book.title && this.book.author && this.book.stock && this.book.image_url && this.book.description && this.book.categories.length > 0) {

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
            this.update();
            return;
          }
          this.store();
        }
      });
    } else {

      swal.fire(
        'Error',
        'Por favor completa todos los campos!',
        'error'
      );
      return;
    }
  }

  store(): void {

    this.http.post(this.apiUrl+'/books/save', this.book).subscribe(data => {

      swal.fire(
        'Creado!',
        'El libro ha sido creado.',
        'success'
      );

      location.href = '/books';
    }, error => {

      swal.fire(
        'Error',
        'Error al crear el libro',
        'error'
      );
      console.log(error);
    });
  }

  update(): void {

    this.http.put(this.apiUrl+'/books/update/'+this.id, this.book).subscribe(data => {

      swal.fire(
        'Actualizado!',
        'El libro ha sido actualizado.',
        'success'
      );

      location.href = '/books';
    }, error => {

      swal.fire(
        'Error',
        'Error al actualizar el libro',
        'error'
      );
      console.log(error);
    });
    return;
  }

  get paginatedData() {

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.book.categories.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {

    this.currentPage = page;
  }
}

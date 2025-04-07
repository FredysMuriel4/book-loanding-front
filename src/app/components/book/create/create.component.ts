import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

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

  private http = inject(HttpClient);

  ngOnInit(): void {

    const url = window.location.href;
    if (url.includes('edit')) {

      this.isEditing = true;
      this.id = url.split('/').pop();

      this.http.get(this.apiUrl+'/books/'+this.id).subscribe(data =>{
          this.book = data;
        } , error => {
          alert('Error al cargar el libro');
        }
      );
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
          alert('La categoria ya existe en el libro');
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

      if(this.isEditing) {

        this.update();
      } else {

        this.store();
      }
    } else {
      alert('Por favor completa todos los campos');
    }
  }

  store(): void {

    this.http.post(this.apiUrl+'/books/save', this.book).subscribe(data => {
      alert('Libro creado correctamente');
      location.href = '/books';
    }, error => {
      alert('Error al crear el libro');
      console.log(error);
    });
  }

  update(): void {

    this.http.put(this.apiUrl+'/books/update/'+this.id, this.book).subscribe(data => {
      alert('Libro actualizado correctamente');
      location.href = '/books';
    }, error => {
      alert('Error al actualizar el libro');
      console.log(error);
    });
    return;
  }
}

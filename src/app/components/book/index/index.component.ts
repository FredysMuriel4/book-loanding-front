import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  books: any[] = [];
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  ngOnInit(): void {

    this.http.get<any[]>(this.apiUrl+'/books').subscribe(data => {
      this.books = data;
    });
  }

  deleteBook(id: number): void {

    this.http.delete(this.apiUrl+'/books/delete/'+id, { responseType: 'text' }).subscribe(() => {
      this.ngOnInit();
      alert('Book deleted successfully!');
    }, error => {
      alert('Error deleting book: ' + error.message);
    });
  }


}

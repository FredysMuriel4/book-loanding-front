import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  query: string = '';
  books: any[] = [];
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl+'/books').subscribe(data => {
      this.books = data;
    });
  }

  searchBooks(): void {
    const actualBooks = this.books;
    this.books = actualBooks.filter(book => {
      const query = this.query.toLowerCase();

      const matchesTitle = book.title.toLowerCase().includes(query);
      const matchesAuthor = book.author.toLowerCase().includes(query);
      const matchesCategory = book.categories?.some((cat: any) =>
        cat.name.toLowerCase().includes(query)
      );

      return matchesTitle || matchesCategory || matchesAuthor;
    });
  }

  cleanBooks(): void {
    this.query = '';
    this.ngOnInit();
  }
}


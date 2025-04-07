import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CaseConverterService } from '../../../utils/case-converter.service';

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
  query: string = '';
  apiUrl = environment.apiUrl;
  students: any[] = [];
  student: any = {
    id: '',
    name: '',
    lastName: '',
    email: '',
    phone: ''
  };
  books: any[] = [];
  selectedBook: any = null;
  selectedBooks: any[] = [];
  quantity: number = 1;
  currentDate: any;
  tentativeDate: any;

  private http = inject(HttpClient);

  constructor(private caseConverter: CaseConverterService) {}

  ngOnInit(): void {

    this.http.get<any[]>(this.apiUrl+'/students').subscribe(data => {
      this.students = data;
    });

    this.http.get<any[]>(this.apiUrl+'/books').subscribe(data => {
      this.books = data;
    });

    this.currentDate = new Date().toISOString().split('T')[0];
  }

  searchStudent(): void {

    const student = this.students.find(student => {
      return student.identificationNumber == this.query;
    });

    if(!student) {

      alert('No se encontró el estudiante con el número de identificación: ' + this.query);
      this.student = {
        id: '',
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

  addBook(): void {

    const book = this.books.find(book => {
      return book.id == this.selectedBook;
    });

    if (book) {

      const formattedBook = {
        id: book.id,
        title: book.title,
        quantity: this.quantity,
      }

      const exists = this.selectedBooks.find((book:any) => book.id == formattedBook.id);
      if (exists) {

        const newQuantity = exists.quantity + formattedBook.quantity;

        if(!this.validateBookStock(newQuantity)) {
          return;
        }
        exists.quantity = newQuantity;
      } else {

        if(!this.validateBookStock(formattedBook.quantity)) {
          return;
        }
        this.selectedBooks.push(formattedBook);
      }
      this.selectedBook = null;
      this.quantity = 1;
    }
  }

  validateBookStock(quantity: number): boolean {

    const book = this.books.find(book => {
      return book.id == this.selectedBook;
    });

    if(quantity > book.stock) {
      alert('No hay suficiente stock del libro: ' + book.title);
      this.quantity = 1;
      return false;
    }
    return true;
  }

  deleteBook(id: number): void {

    const index = this.selectedBooks.findIndex((cat:any) => cat.id == id);
    if (index !== -1) {
      this.selectedBooks.splice(index, 1);
    }
  }

  createLoan(): void {

    const items = this.selectedBooks.map(book => ({
      book_id: book.id,
      quantity: book.quantity
    }));

    const currentDate = this.caseConverter.formatDate(this.currentDate);
    const tentativeDate = this.caseConverter.formatDate(this.tentativeDate);

    const data = {
      student_id: this.student.id,
      loan_date: currentDate,
      tentative_date: tentativeDate,
      items: items
    };

    this.store(data);
  }

  store(loan: Object): void {

    this.http.post(this.apiUrl+'/loans/save', loan).subscribe(data => {
      alert('Préstamo registrado correctamente');
      location.href = '/loans';
    }, error => {
      alert('Error al crear el libro');
      console.log(error);
    });
  }
}

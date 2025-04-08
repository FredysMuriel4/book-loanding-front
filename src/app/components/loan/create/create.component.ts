import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CaseConverterService } from '../../../utils/case-converter.service';
import swal from 'sweetalert2';
import { PaginateComponent } from '../../layouts/paginate/paginate.component';
import axios from 'axios';

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

  // Paginate data
  currentPage = 1;
  itemsPerPage = 3;

  constructor(private caseConverter: CaseConverterService) {}

  async ngOnInit(): Promise<void> {

    await axios.get(this.apiUrl+'/students')
    .then(response => {

      this.students = response.data;
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'Error al cargar estudiantes!',
        'error'
      );
      console.log(error);
    });

    await axios.get(this.apiUrl+'/books')
    .then(response => {

      this.books = response.data;
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'Error al cargar libros!',
        'error'
      );
      console.log(error);
    });

    this.currentDate = new Date().toISOString().split('T')[0];
  }

  searchStudent(): void {

    const student = this.students.find(student => {
      return student.identificationNumber == this.query;
    });

    if(!student) {

      swal.fire(
        'Error!',
        'No se encontró al estudiante con el número de cédula: '+this.query,
        'error'
      );

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

      swal.fire(
        'Error!',
        'No hay suficiente stock del libro: '+ book.title,
        'error'
      );
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

    if(data.student_id == null || data.items.length == 0 || data.loan_date == null || data.tentative_date == null) {

      swal.fire(
        'Error',
        'Por favor complete todos los campos',
        'error'
      );
      return;
    }

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

        this.store(data);
      }
    });
  }

  async store(loan: Object): Promise<void> {

    await axios.post(this.apiUrl+'/loans/save', loan)
    .then(() => {

      swal.fire(
        'Correcto!',
        'Préstamo registrado de forma correcta',
        'success'
      );
      location.href = '/loans';
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'Error al registrar el préstamo.',
        'error'
      );
      console.log(error);
    });
  }

  get paginatedData() {

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.selectedBooks.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {

    this.currentPage = page;
  }
}

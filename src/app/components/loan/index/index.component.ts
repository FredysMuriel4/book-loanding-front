import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CaseConverterService } from '../../../utils/case-converter.service';
import swal from 'sweetalert2';

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
  loans: any[] = [];
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  constructor(private caseConverter: CaseConverterService) {}

  ngOnInit(): void {

    this.http.get<any[]>(this.apiUrl+'/loans').subscribe(data => {
      this.loans = data;
    });
  }

  deleteLoan(id: number): void {

    swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.delete(id);
      }
    });
  }

  delete(id: number): void {

    this.http.delete(this.apiUrl+'/loans/delete/'+id, { responseType: 'text' }).subscribe(() => {

      this.ngOnInit();

      swal.fire(
        'Correcto!',
        'Préstamo eliminado de forma correcta!',
        'success'
      )
    }, error => {

      swal.fire(
        'Error!',
        'No se pudo eliminar el libro.',
        'error'
      );
      console.log(error);
    });
  }

  updateLoan(id: number): void {

    const loan = this.loans.find(loan => loan.id === id);
    const returnDate = new Date().toISOString().split('T')[0];
    const formattedDate = this.caseConverter.formatDate(returnDate);

    const data = {
      return_date: formattedDate,
      items: loan.detailJson
    };

    swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.update(id, data);
      }
    });
  }

  update(id: number, data: object): void {

    this.http.put(this.apiUrl+'/loans/update/'+id, data, { responseType: 'text' }).subscribe(() => {

      this.ngOnInit();
      swal.fire(
        'Correcto!',
        'Préstamo actualizado de forma correcta.',
        'success'
      );
    }, error => {

      swal.fire(
        'Error!',
        'No se pudo actualizar el libro.',
        'error'
      );
      console.log(error);
    });
  }
}

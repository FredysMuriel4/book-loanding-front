import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CaseConverterService } from '../../../utils/case-converter.service';
import swal from 'sweetalert2';
import { PaginateComponent } from '../../layouts/paginate/paginate.component';
import axios from 'axios';

@Component({
  selector: 'app-index',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    PaginateComponent
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  loans: any[] = [];
  apiUrl = environment.apiUrl;

  // Paginate data
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private caseConverter: CaseConverterService) {}

  async ngOnInit(): Promise<void> {

    await axios.get(this.apiUrl+'/loans')
    .then(response => {

      this.loans = response.data;
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'No se cargaron los prestamos.',
        'error'
      );
      console.log(error);
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

  async delete(id: number): Promise<void> {

    await axios.delete(this.apiUrl+'/loans/delete/'+id, { responseType: 'text' })
    .then(() => {

      this.ngOnInit();
      swal.fire(
        'Correcto!',
        'Préstamo eliminado de forma correcta!',
        'success'
      )
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'No se pudo eliminar el prestamo.',
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

  async update(id: number, data: object): Promise<void> {

    await axios.put(this.apiUrl+'/loans/update/'+id, data, { responseType: 'text' })
    .then(() => {

      this.ngOnInit();
      swal.fire(
        'Correcto!',
        'Préstamo actualizado de forma correcta.',
        'success'
      );
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'No se pudo actualizar el libro.',
        'error'
      );
      console.log(error);
    });
  }

  get paginatedData() {

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.loans.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {

    this.currentPage = page;
  }
}

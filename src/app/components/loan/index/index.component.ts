import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CaseConverterService } from '../../../utils/case-converter.service';

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

    this.http.delete(this.apiUrl+'/loans/delete/'+id, { responseType: 'text' }).subscribe(() => {
      this.ngOnInit();
      alert('Préstamo eliminado de forma correcta!');
    }, error => {
      alert('Error eliminando préstamo: ' + error.message);
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

    this.http.put(this.apiUrl+'/loans/update/'+id, data, { responseType: 'text' }).subscribe(() => {
      this.ngOnInit();
      alert('Préstamo actualizado de forma correcta!');
    }, error => {
      alert('Error actualizando préstamo: ' + error.message);
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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
}

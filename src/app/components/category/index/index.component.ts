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
  categories: any[] = [];
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  ngOnInit(): void {

    this.http.get<any[]>(this.apiUrl+'/categories').subscribe(data => {
      this.categories = data;
    });
  }

  deleteCategory(id: number): void {

    this.http.delete(this.apiUrl+'/categories/delete/'+id, { responseType: 'text' }).subscribe(() => {
      this.ngOnInit();
      alert('Category deleted successfully!');
    }, error => {
      alert('Error deleting book: ' + error.message);
    });
  }

}

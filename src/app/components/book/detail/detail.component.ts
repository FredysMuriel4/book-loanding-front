import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
  book: any = {
    title: '',
    author: '',
    description: '',
    imageUrl: ''
  }
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  ngOnInit(): void {

    const url = window.location.href;
    const id = url.split('/').pop();

    this.http.get<any[]>(this.apiUrl+'/books/'+id).subscribe(data => {
      this.book = data;
      console.log(data);
    });
  }


}

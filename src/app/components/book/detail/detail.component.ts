import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import swal from 'sweetalert2';

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

  async ngOnInit(): Promise<void> {

    const url = window.location.href;
    const id = url.split('/').pop();

    await axios.get(this.apiUrl+'/books/'+id)
    .then(response => {

      this.book = response.data;
    })
    .catch(error => {

      swal.fire(
        'Error!',
        'Error al cargar el libro.',
        'error'
      );
      console.error(error);
    });
  }


}

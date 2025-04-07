import { Component } from '@angular/core';
import { RouterOutlet, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {}

import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/main/main.component').then(m => m.MainComponent)
      },
      {
        path: 'books',
        loadComponent: () =>
          import('./components/book/index/index.component').then(m => m.IndexComponent)
      },
      {
        path: 'books/create',
        loadComponent: () =>
          import('./components/book/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'books/edit/:id',
        loadComponent: () =>
          import('./components/book/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/category/index/index.component').then(m => m.IndexComponent)
      },
      {
        path: 'categories/create',
        loadComponent: () =>
          import('./components/category/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import('./components/category/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./components/student/index/index.component').then(m => m.IndexComponent)
      },
      {
        path: 'students/create',
        loadComponent: () =>
          import('./components/student/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'students/edit/:id',
        loadComponent: () =>
          import('./components/student/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./components/loan/index/index.component').then(m => m.IndexComponent)
      },
      {
        path: 'loans/create',
        loadComponent: () =>
          import('./components/loan/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'loans/edit/:id',
        loadComponent: () =>
          import('./components/loan/create/create.component').then(m => m.CreateComponent)
      },
    ],
  },
];

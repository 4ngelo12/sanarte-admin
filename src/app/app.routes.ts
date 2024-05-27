import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth.component'),
        children: [
            {
                path: 'login',
                title: 'Login',
                loadComponent: () => import('./auth/pages/login/login.component')
            },
            {
                path: 'register',
                title: 'Register',
                loadComponent: () => import('./auth/pages/register/register.component')
            }
        ]
    },
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    }

];

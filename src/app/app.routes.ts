import { Routes } from '@angular/router';
import { authorizationGuard } from './core/guards/authorization.guard';

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
                canActivate: [authorizationGuard],
                loadComponent: () => import('./auth/pages/register/register.component')
            }
        ]
    },
    {
        path: 'dashboard',
        canActivate: [authorizationGuard],
        loadComponent: () => import('./principal/principal.component'),
        children: [
            {
                path: 'home',
                title: 'Home',
                loadComponent: () => import('./principal/pages/home/home.component')
            },
            {
                path: 'reservas',
                title: 'Reservas',
                loadComponent: () => import('./principal/pages/reservas/reservas.component')
            },
            {
                path: 'servicios',
                title: 'Servicios',
                loadComponent: () => import('./principal/pages/servicios/servicios.component')
            },
            {
                path: 'categorias',
                title: 'Categorias',
                loadComponent: () => import('./principal/pages/categorias/categorias.component')
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }

];

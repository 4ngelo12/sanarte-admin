import { Routes } from '@angular/router';
import { authorizationGuard } from './core/guards/authorization.guard';
import { hasRoleGuard } from './core/guards/has-role.guard';

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
        path: 'home',
        title: 'Home',
        canActivate: [authorizationGuard],
        loadComponent: () => import('./pages/home/home.component')
    },
    {
        path: 'categorias',
        title: 'Categorias',
        canActivate: [authorizationGuard, hasRoleGuard],
        data: {
            allowedRoles: ['Admin']
        },
        children: [
            {
                path: 'list',
                title: 'List',
                loadComponent: () => import('./pages/categories/list/list.component')
            },
            {
                path: 'create',
                title: 'Create',
                loadComponent: () => import('./pages/categories/create/create.component')
            },
            {
                path: 'edit/:id',
                title: 'Edit',
                loadComponent: () => import('./pages/categories/edit/edit.component')
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'servicios',
        title: 'Servicios',
        canActivate: [authorizationGuard, hasRoleGuard],
        data: {
            allowedRoles:['Admin']
        },
        children: [
            {
                path: 'list',
                title: 'List',
                loadComponent: () => import('./pages/services/list/list.component')
            },
            {
                path: 'create',
                title: 'Create',
                loadComponent: () => import('./pages/services/create/create.component')
            },
            {
                path: 'edit/:id',
                title: 'Edit',
                loadComponent: () => import('./pages/services/edit/edit.component')
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'clientes',
        title: 'Clientes',
        canActivate: [authorizationGuard],
        children: [
            {
                path: 'list',
                title: 'List',
                loadComponent: () => import('./pages/client/list/list.component')
            },
            {
                path: 'create',
                title: 'Create',
                loadComponent: () => import('./pages/client/create/create.component')
            },
            {
                path: 'edit/:id',
                title: 'Edit',
                loadComponent: () => import('./pages/client/edit/edit.component')
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'reservas',
        title: 'Reservas',
        canActivate: [authorizationGuard],
        children: [
            {
                path: 'list',
                title: 'List',
                loadComponent: () => import('./pages/reservations/list/list.component')
            },
            {
                path: 'create',
                title: 'Create',
                loadComponent: () => import('./pages/reservations/create/create.component')
            },
            {
                path: 'edit/:id',
                title: 'Edit',
                loadComponent: () => import('./pages/reservations/edit/edit.component')
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'usuarios',
        title: 'Usuarios',
        canActivate: [authorizationGuard, hasRoleGuard],
        data: {
            allowedRoles:['Admin']
        },
        children: [
            {
                path: 'list',
                title: 'List',
                loadComponent: () => import('./pages/users/list/list.component')
            },
            {
                path: 'create',
                title: 'Create',
                loadComponent: () => import('./pages/users/create/create.component')
            },
            {
                path: 'edit/:id',
                title: 'Edit',
                loadComponent: () => import('./pages/users/edit/edit.component')
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
];

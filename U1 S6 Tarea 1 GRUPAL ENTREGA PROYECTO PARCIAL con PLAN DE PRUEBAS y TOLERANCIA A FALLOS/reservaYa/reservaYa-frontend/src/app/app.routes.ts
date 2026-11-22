import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { EspaciosList } from './components/espacios/espacios-list/espacios-list';
import { ReservasList } from './components/reservas/reservas-list/reservas-list';
import { ClientesList } from './components/clientes/clientes-list/clientes-list';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Login},
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard]},
    { path: 'espacios', component: EspaciosList, canActivate: [authGuard]},
    { path: 'reservas', component: ReservasList, canActivate: [authGuard]},
    { path: 'clientes', component: ClientesList, canActivate: [authGuard]},
    { path: '**', redirectTo: ''}
];

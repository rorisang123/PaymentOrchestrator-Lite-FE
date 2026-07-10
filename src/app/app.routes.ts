import { Routes } from '@angular/router';
import { PaymentsComponent } from './pages/payments/payments.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { 
        path: '', 
        component: PaymentsComponent,
        canActivate: [authGuard] 
    },
    { path: '**', redirectTo: 'login' }
];

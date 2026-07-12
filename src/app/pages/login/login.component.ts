import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  credentials = signal({ email: '', password: '' });
  error = signal('');
  loading = signal(false);

  onLogin() {
  this.loading.set(true);
  this.error.set('');

  this.authService.login(this.credentials()).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => this.error.set(err?.error?.message || 'Invalid email or password')
    });
  }
}
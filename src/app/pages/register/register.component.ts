import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  credentials = signal({ username: '', email: '', password: '' });
  error = signal('');
  loading = signal(false);

  onRegister() {
    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.credentials()).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Registration failed');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}
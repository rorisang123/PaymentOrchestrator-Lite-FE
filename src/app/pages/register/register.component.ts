import { Component, inject } from '@angular/core';
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

  credentials = { username: '', email: '', password: '' };
  error = '';
  loading = false;

  onRegister() {
    this.loading = true;
    this.error = '';

    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/payments']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
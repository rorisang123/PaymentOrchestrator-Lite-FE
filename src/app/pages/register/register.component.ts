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
  hasNumber = signal(false);
  hasSpecial = signal(false);

  passwordStrength = signal<'weak' | 'medium' | 'strong' | ''>('');

  onPasswordChange(password: string) {
    this.credentials.set({ ...this.credentials(), password });
    this.passwordStrength.set(this.getPasswordStrength(password));

    this.hasNumber.set(/\d/.test(password));
    this.hasSpecial.set(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  }

  private getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | '' {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    if (password.length >= 8 && hasUpper && hasLower && hasNumber) {
      return 'strong';
    }
    if (password.length >= 6 && (hasUpper || hasLower) && hasNumber) {
      return 'medium';
    }
    return 'weak';
  }

  onRegister() {
    this.loading.set(true);
    this.error.set('');

    const creds = this.credentials();

    if (!creds.username.trim()) {
      this.error.set('Username is required');
      this.loading.set(false);
      return;
    }
    if (!this.isValidEmail(creds.email)) {
      this.error.set('Please enter a valid email address');
      this.loading.set(false);
      return;
    }
    if (creds.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      this.loading.set(false);
      return;
    }
    if (this.passwordStrength() === 'weak') {
      this.error.set('Password is too weak. Please use a stronger password.');
      this.loading.set(false);
      return;
    }

    this.authService.register(creds).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => this.error.set(err?.error?.message || 'Registration failed'),
      complete: () => this.loading.set(false)
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
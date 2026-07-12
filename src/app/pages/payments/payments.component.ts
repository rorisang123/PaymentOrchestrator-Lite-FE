import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { Payment, CreatePaymentRequest } from '../../core/models/payment.model';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  payments = signal<Payment[]>([]);
  loading = signal(false);
  confirmingId = signal<string | null>(null);
  newPayment: CreatePaymentRequest = { customerId: '', amount: 0 };

  constructor() {
    effect(() => {
    });
  }

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading.set(true);
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  createPayment() {
    if (this.newPayment.amount <= 0) return;

    this.paymentService.createPayment(this.newPayment.amount).subscribe({
      next: () => {
        this.newPayment.amount = 0;
        this.loadPayments();
      },
      error: (err) => console.error(err)
    });
  }

  confirmPayment(paymentId: string) {
    this.confirmingId.set(paymentId);

    this.paymentService.confirmPayment(paymentId).subscribe({
      next: () => {
        this.loadPayments();
        this.confirmingId.set(null);
      },
      error: (err) => {
        console.error('Failed to confirm', err);
        this.confirmingId.set(null);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
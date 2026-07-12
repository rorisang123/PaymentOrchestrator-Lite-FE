import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { Payment, CreatePaymentRequest } from '../../core/models/payment.model';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

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
  private toastService = inject(ToastService);

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
        this.toastService.show('Failed to load payments. Please try again.', 'error');
        this.loading.set(false);
      }
    });
  }

  createPayment() {
    if (this.newPayment.amount <= 0) {
      this.toastService.show('Please enter a valid amount', 'error');
      return;
    }

    this.paymentService.createPayment(this.newPayment.amount).subscribe({
      next: () => {
        this.newPayment.amount = 0;
        this.toastService.show('Payment created successfully!', 'success');
        this.loadPayments();
      },
      error: () => this.toastService.show('Failed to create payment', 'error')
    });
  }

  confirmPayment(paymentId: string) {
    this.confirmingId.set(paymentId);

    this.paymentService.confirmPayment(paymentId).subscribe({
      next: () => {
        this.toastService.show('Payment confirmed successfully!', 'success');
        this.loadPayments();
        this.confirmingId.set(null);
      },
      error: () => {
        this.toastService.show('Failed to confirm payment', 'error');
        this.confirmingId.set(null);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
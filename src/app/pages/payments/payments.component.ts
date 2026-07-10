import { Component, inject, OnInit } from '@angular/core';
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
  private authService = inject(AuthService);
  private router = inject(Router);
  
  payments: Payment[] = [];
  newPayment: CreatePaymentRequest = { customerId: '', amount: 0 };
  loading = false;
  confirmingId: string | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  createPayment() {
  if (this.newPayment.amount <= 0) return;

  this.paymentService.createPayment(this.newPayment.amount).subscribe({
    next: () => {
      this.newPayment.amount = 0;
      this.loadPayments();
    }
  });
}

  confirmPayment(paymentId: string) {
    this.confirmingId = paymentId;

    this.paymentService.confirmPayment(paymentId).subscribe({
      next: () => {
        this.loadPayments();
        this.confirmingId = null;
      },
      error: (err) => {
        console.error('Failed to confirm payment', err);
        this.confirmingId = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
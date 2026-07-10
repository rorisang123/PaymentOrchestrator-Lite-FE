import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { Payment, CreatePaymentRequest } from '../../core/models/payment.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {
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
    if (!this.newPayment.customerId?.trim() || this.newPayment.amount <= 0) {
      alert('Please enter a valid Customer ID and Amount > 0');
      return;
    }

    this.paymentService.createPayment(this.newPayment).subscribe({
      next: () => {
        this.newPayment = { customerId: '', amount: 0 };
        this.loadPayments();
      },
      error: (err) => console.error(err)
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
}
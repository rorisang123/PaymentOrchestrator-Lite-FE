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
    if (!this.newPayment.customerId || this.newPayment.amount <= 0) {
      alert('Please fill Customer ID and Amount');
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

  confirmPayment(id: string) {
    this.paymentService.confirmPayment(id).subscribe({
      next: () => this.loadPayments(),
      error: (err) => console.error(err)
    });
  }
}
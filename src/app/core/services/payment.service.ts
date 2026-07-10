import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, CreatePaymentRequest } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://localhost:7053/api/payments'; // TODO: move to env file

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  createPayment(request: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, request);
  }

  confirmPayment(paymentId: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/simulate-confirmation/${paymentId}`, {});
  }
}
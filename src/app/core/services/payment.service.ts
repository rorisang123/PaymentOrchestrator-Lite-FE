import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environements/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  createPayment(amount: number): Observable<Payment> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const request = { customerId: userId, amount };
    return this.http.post<Payment>(this.apiUrl, request);
  }

  confirmPayment(paymentId: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/simulate-confirmation/${paymentId}`, {});
  }
}
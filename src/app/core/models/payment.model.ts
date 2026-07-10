export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  status: 'Pending' | 'Confirmed';
  createdAt: string;
}

export interface CreatePaymentRequest {
  customerId: string;
  amount: number;
}
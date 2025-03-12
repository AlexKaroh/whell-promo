import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebhookService {
  private webhookUrl = 'https://webhook.nodul.ru/429/dev/new_order';

  constructor(private http: HttpClient) {}

  sendWebhook(data: any) {
    console.log(data);
    const params = new HttpParams({
      fromObject: {
        'Название сделки': data.deal_name,
        'Номер телефона': data.phone_number,
        'Сумма платежа': data.monthly_amount,

        'Имя': data.name,
        'Срок рассрочки': data.installment_period,
      },
    });
    return this.http.get(this.webhookUrl, { params }).pipe(take(1)).subscribe({
      next: (response) => console.log('✅ Успех:', response),
      error: (err) => console.error('❌ Ошибка:', err),
    });
  }
}

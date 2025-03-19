import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StopPropagationDirective } from './stop-propaginaton.directive';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhoneMaskDirective } from './phone-mask.directive';
import { WebhookService } from './webhook.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NgFor, NgIf, StopPropagationDirective, PhoneMaskDirective, ReactiveFormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  dealName = 'НОУТБУКИ'

  itemsArray = Array(8).fill(
    'Акция! Мега Розыгрыш 🔥!'
  );
  isModalActive = false;
  flag = false;
  isConfirm = false;

  public PopupMode?: "Info" | "Prize" | "doc1" | "doc2" | "doc3" | "doc4";

  phoneControl = new FormControl('', [
    Validators.required
  ]);

  nameControl = new FormControl('', [
    Validators.required
  ]);

  periodControl = new FormControl('', [
    Validators.required
  ]);

  sumControl = new FormControl('', [
    Validators.required
  ]);

  ratingControl = new FormControl(1, [
    Validators.required
  ]);

  constructor (private cdf: ChangeDetectorRef, private webhookService: WebhookService, private router: Router) {}

  ngOnInit(): void {
    if(localStorage.getItem('isConfirm')) {
      this.activateModal('doc4');
      localStorage.removeItem('isConfirm');
    }
  }

  activateModal(popupMode: "Info" | "Prize" | "doc1" | "doc2" | "doc3" | "doc4") {
    this.PopupMode = popupMode;
    this.nameControl.reset();
    this.phoneControl.reset();
    this.ratingControl.reset();
    this.isModalActive = true;
    this.cdf.detectChanges();
  }

  disableModal() {
    this.isModalActive = false;
    this.PopupMode = undefined;
    this.nameControl.reset();
    this.phoneControl.reset();
    this.ratingControl.reset();
  }

  spin() {
    this.flag = true;
    setTimeout(() => {
      this.activateModal('Prize');
    }, 14000)
  }

  public onClick() {
    if (this.nameControl.invalid || this.phoneControl.invalid && this.phoneControl.touched || (this.phoneControl.value?.length !== 17 && this.phoneControl.touched)) {
      this.phoneControl.markAsTouched();
      this.phoneControl.markAsDirty();

      this.sumControl.markAsTouched();
      this.sumControl.markAsDirty();

      this.periodControl.markAsTouched();
      this.periodControl.markAsDirty();

      this.nameControl.markAsTouched();
      this.nameControl.markAsDirty();
      return;
    }
    else
    this.cdf.detectChanges();


    const data = {
      name: this.nameControl.value,
      deal_name: this.dealName,
      phone_number: this.phoneControl.value,
      installment_period: this.periodControl.value,
      monthly_amount: this.sumControl.value,
    };

    console.log( "Собранная информация: ", data);
    this.webhookService.sendWebhook(data);

    setTimeout(() => {
      localStorage.setItem('isConfirm', '1');
      window.location.href = '/thanks';
    })
  }
}

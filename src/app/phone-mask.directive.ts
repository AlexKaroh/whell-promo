import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true, // Директива становится standalone
})
export class PhoneMaskDirective {
  private readonly allowedPrefixes = ['29', '44', '33', '17', '25'];
  private readonly maxLength = 17; // Длина строки: +375-XX-XXX-XX-XX

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Убираем всё, кроме цифр

    if (value.startsWith('375')) {
      value = value.slice(3); // Убираем префикс 375, так как он задан в маске
    }

    // Применяем маску
    let formatted = '+375 ';
    if (value.length > 0) {
      formatted += value.substring(0, 2); // Префикс оператора
    }
    if (value.length > 2) {
      formatted += ' ' + value.substring(2, 5); // Три цифры
    }
    if (value.length > 5) {
      formatted += ' ' + value.substring(5, 7); // Первые две цифры
    }
    if (value.length > 7) {
      formatted += ' ' + value.substring(7, 9); // Последние две цифры
    }

    // Ограничиваем длину и проверяем валидность префикса
    if (
      formatted.length > this.maxLength ||
      (formatted.length >= 8 && !this.allowedPrefixes.includes(value.substring(0, 2)))
    ) {
      formatted = formatted.substring(0, formatted.length - 1);
    }

    input.value = formatted;
  }
}

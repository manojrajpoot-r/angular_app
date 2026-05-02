import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-input.html'
})
export class PasswordInputComponent {

  @Input() model: string = '';

  @Output() modelChange = new EventEmitter<string>();

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}

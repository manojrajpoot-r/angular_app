import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-input.html'
})
export class DynamicInputComponent {

  @Input() label: string = '';

  @Input() items: string[] = [''];

  @Input() showAddButton: boolean = true;

  @Output() itemsChange = new EventEmitter<string[]>();

  trackByIndex(index: number): number {
    return index;
  }

  addItem(): void {
    this.items.push('');
    this.itemsChange.emit(this.items);
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.itemsChange.emit(this.items);
  }
}

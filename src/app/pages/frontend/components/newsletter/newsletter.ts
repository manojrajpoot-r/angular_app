import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-newsletter',
  imports: [
    MatFormFieldModule,
    MatInputModule,
     MatIconModule
  ],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.css',
})
export class NewsletterComponent {}

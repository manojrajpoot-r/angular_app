import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../layouts/frontend/header.component/header.component';
import { FooterComponent } from '../../../layouts/frontend/footer.component/footer.component';
@Component({
  selector: 'app-frontend-layout.component',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './frontend-layout.component.html',
  styleUrl: './frontend-layout.component.css',
})
export class FrontendLayoutComponent { }

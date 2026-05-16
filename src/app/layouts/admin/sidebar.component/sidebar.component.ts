

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PermissionAuthService } from '../../../core/services/permission-auth';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarCollapsed = false;
  userOpen = false;
  productOpen = false;
  profileOpen = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    public permissionAuth: PermissionAuthService
  ) { }

}

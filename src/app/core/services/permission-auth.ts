import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionAuthService {

  getPermissions(): string[] {

    return JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );

  }

  getRoles(): string[] {

    return JSON.parse(
      localStorage.getItem('roles') || '[]'
    );

  }

  hasPermission(permission: string): boolean {

    const roles = this.getRoles();

    if (roles.includes('Admin')) {
      return true;
    }

    const permissions = this.getPermissions();
    return permissions.includes(permission);

  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);

  }

}

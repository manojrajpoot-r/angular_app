import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../../../core/services/permission/permission.service';
import { AssignRolePermissionService } from '../../../../core/services/assign-role-permission/assign-role-permission';
import { RoleService } from '../../../../core/services/roles/role.service';
import { ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../../../services/alert/alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-role-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permission.html'
})
export class RolePermissionComponent implements OnInit {

  roleName: string = '';
  roleId: number = 0;
  permissions: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private assignRolePermissionService: AssignRolePermissionService,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.roleId = Number(params.get('id'));

      this.loadRole();

      this.loadData();

    });

  }

  loadData() {

    this.loading = true;

    this.permissions = [];

    this.permissionService.getPermission(1, 100, '')
      .subscribe({

        next: (res: any) => {

          const data = res.data || [];

          const grouped: any = {};

          data.forEach((item: any) => {

            if (!grouped[item.groupName]) {
              grouped[item.groupName] = [];
            }

            grouped[item.groupName].push({
              id: item.id,
              name: item.name,
              checked: false
            });

          });

          this.permissions = Object.keys(grouped).map(groupName => ({
            groupName,
            items: grouped[groupName]
          }));

          this.cdr.detectChanges();

          this.loadAssignedPermissions();

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

  loadRole() {
    this.roleService
      .getRoleById(this.roleId)
      .subscribe({

        next: (res: any) => {
          this.roleName =
            res?.data?.name || '';

        },

        error: (err) => {

          console.log(err);

        }

      });

  }



  loadAssignedPermissions() {

    this.assignRolePermissionService
      .getRolePermissions(this.roleId)
      .subscribe({

        next: (res: any) => {

          console.log('Assigned Permissions:', res.data);

          const assignedPermissions =
            (res?.data || [])
              .map((x: string) =>
                x.trim().toLowerCase()
              );

          this.permissions.forEach(group => {

            group.items.forEach((item: any) => {

              item.checked =
                assignedPermissions.includes(
                  item.name.trim().toLowerCase()
                );

            });

          });

          console.log(this.permissions);

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log('Permission Error:', err);

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

  savePermissions() {
    const selectedPermissions = this.permissions
      .flatMap(group =>
        group.items
          .filter((x: any) => x.checked)
          .map((x: any) => x.id)
      );

    const payload = {

      roleId: this.roleId,

      permissionIds: selectedPermissions

    };

    console.log(payload);

    this.assignRolePermissionService
      .assignPermission(payload)
      .subscribe({
        next: (res: any) => {

          this.alert.success('Permissions Assigned Successfully!')
            .then(() => {

              this.router.navigate(['/admin/roles']);

            });
        },

        error: (err) => {
          console.log(err);
        }

      });

  }

  isAllSelected(items: any[]): boolean {

    return items.every(x => x.checked);

  }

  toggleGroup(items: any[], event: any) {

    const checked = event.target.checked;

    items.forEach(item => {
      item.checked = checked;
    });

  }

}

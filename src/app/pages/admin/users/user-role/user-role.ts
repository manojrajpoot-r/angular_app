import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../../../core/services/roles/role.service';
import { AssignUserRoleService } from '../../../../core/services/assign-user-role/assign-user-role.service';
import { UserService } from '../../../../core/services/user/user.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-role.html',
  styleUrl: './user-role.css',
})
export class UserRole implements OnInit {

  userId: number = 0;

  userName: string = '';

  roles: any[] = [];

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private assignUserRoleService: AssignUserRoleService,
    private userService: UserService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.userId = Number(params.get('id'));

      this.loadUser();

      this.loadRoles();

    });

  }

  loadUser() {

    this.userService
      .getUserById(this.userId)
      .subscribe({

        next: (res: any) => {

          this.userName = res?.data?.name || '';
          console.log('User Details:', res);
          this.cd.detectChanges();
        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  loadRoles() {

    this.loading = true;

    this.roles = [];

    this.roleService
      .getRoles(1, 100, '')
      .subscribe({

        next: (res: any) => {

          const data = res.data || [];
          console.log('Roles List:', data);
          this.cd.detectChanges();
          this.roles = data.map((item: any) => ({

            id: item.id,

            name: item.name,

            checked: false

          }));

          this.loadAssignedRoles();

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

        }

      });

  }

  loadAssignedRoles() {

    this.assignUserRoleService
      .getUserRoles(this.userId)
      .subscribe({

        next: (res: any) => {

          console.log('Assigned Roles:', res);

          const assignedRoles = Array.isArray(res)
            ? res
            : [];

          this.roles.forEach((item: any) => {

            item.checked =
              assignedRoles.some(
                (x: string) =>
                  x?.trim()?.toLowerCase() ===
                  item.name?.trim()?.toLowerCase()
              );

          });

          console.log('Updated Roles:', this.roles);

          this.loading = false;

          this.roles = [...this.roles];

          this.cd.detectChanges();

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          this.cd.detectChanges();

        }

      });

  }



  saveRoles() {

    const selectedRoles = this.roles
      .filter((x: any) => x.checked)
      .map((x: any) => x.id);

    const payload = {

      userId: this.userId,

      roleIds: selectedRoles

    };

    console.log(payload);

    this.assignUserRoleService
      .assignUserRole(payload)
      .subscribe({

        next: (res: any) => {

          this.alert.success('Roles Assigned Successfully!')
            .then(() => {

              this.router.navigate(['/admin/users']);

            });

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  isAllSelected(): boolean {

    return this.roles.every(x => x.checked);

  }

  toggleAll(event: any) {

    const checked = event.target.checked;

    this.roles.forEach((item: any) => {

      item.checked = checked;

    });

  }

}

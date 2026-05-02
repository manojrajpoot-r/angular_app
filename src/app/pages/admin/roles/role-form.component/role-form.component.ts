import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { RoleService } from '../../../../core/services/roles/role.service';
@Component({
  standalone: true,
  selector: 'app-role-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {

  role: any = {
    name: '',
  };

  isEdit = false;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private roleService: RoleService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.getRoleById();
    }
  }

  getRoleById() {
    this.roleService.getRoleById(this.id).subscribe((res: any) => {
      this.role = res.data;
      console.log(this.role);
    });
  }

  saveRole() {
    if (this.isEdit) {
      this.roleService.updateRole(this.id, this.role).subscribe(() => {
        this.alert
          .success('Role details have been updated successfully!!')
          .then(() => {

            this.router.navigate(['/admin/roles']);

          });
      });
    } else {
      this.roleService.addRole(this.role).subscribe(() => {

        this.alert
          .success('New role has been added successfully!')
          .then(() => {

            this.router.navigate(['/admin/roles']);

          });

      });
    }
  }
}

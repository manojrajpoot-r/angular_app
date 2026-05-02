import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { PermissionService } from '../../../../core/services/permission/permission.service';
import { DynamicInputComponent } from '../../../../shared/components/dynamic-input/dynamic-input';

@Component({
  standalone: true,
  selector: 'app-permission-form',
  imports: [CommonModule, FormsModule, DynamicInputComponent],
  templateUrl: './permission-form.component.html'
})


export class PermissionFormComponent implements OnInit {

  permission = {
    groupName: '',
    permissions: ['']
  };


  isEdit = false;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private permissionService: PermissionService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.getPermissionById();
    }
  }





  getPermissionById() {
    this.permissionService.getPermissionById(this.id).subscribe((res: any) => {
      this.permission = {
        groupName: res.data.groupName,
        permissions: [res.data.name]
      };
      console.log(this.permission);
    });
  }

  savePermission() {
    if (this.isEdit) {
      this.permissionService.updatePermission(this.id, this.permission).subscribe(() => {
        this.alert.success('Permission details have been updated successfully!');
        this.router.navigate(['/admin/permissions']);
      });
    } else {
      console.log(this.permission);
      this.permissionService.addPermission(this.permission).subscribe(() => {
        this.alert.success('New permission has been added successfully!');
        this.router.navigate(['/admin/permissions']);
      });
    }
  }
}

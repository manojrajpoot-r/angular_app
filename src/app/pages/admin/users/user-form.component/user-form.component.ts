import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user/user.service';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { PasswordInputComponent } from '../../../../shared/password-input/password-input';
@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule, PasswordInputComponent],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  user: any = {
    name: '',
    email: '',
    password: ''
  };

  isEdit = false;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.isEdit = true;
      this.getUserById();
    }
  }

  getUserById() {
    this.userService.getUserById(this.id).subscribe((res: any) => {
      this.user = res.data;
    });
  }

  saveUser() {
    if (this.isEdit) {
      this.userService.updateUser(this.id, this.user).subscribe(() => {
        this.alert.success('User details have been updated successfully!!')
          .then(() => {
            this.router.navigate(['/admin/users']);
          });

      });
    } else {
      this.userService.addUser(this.user).subscribe(() => {
        this.alert.success('User details have been added successfully!!')
          .then(() => {
            this.router.navigate(['/admin/users']);
          });
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user/user.service';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule],
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
    private userService: UserService
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
      console.log(this.user);
    });
  }

  saveUser() {
    if (this.isEdit) {
      this.userService.updateUser(this.id, this.user).subscribe(() => {
        Swal.fire(
          'User Updated',
          'User details have been updated successfully.',
          'success'
        );
        this.router.navigate(['/admin/users']);
      });
    } else {
      this.userService.addUser(this.user).subscribe(() => {
        Swal.fire(
          'User Added',
          'New user has been added successfully.',
          'success'
        );
        this.router.navigate(['/admin/users']);
      });
    }
  }
}

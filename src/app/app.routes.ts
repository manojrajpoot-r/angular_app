import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component/home.component';
import { LoginComponent } from './pages/auth/login.component/login.component';
import { DashboardComponent } from './pages/admin/dashboard.component/dashboard.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component/admin-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { UserComponent } from './pages/admin/users/user.component/user.component';
import { UserFormComponent } from './pages/admin/users/user-form.component/user-form.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'admin/login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: "users", component: UserComponent },
      {
        path: 'users/add',
        component: UserFormComponent
      },
      {
        path: 'users/edit/:id',
        component: UserFormComponent
      }
    ]
  }

];

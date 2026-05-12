import { Routes } from '@angular/router';
import { HomeComponent } from './pages/frontend/home/home.component/home.component';
import { LoginComponent } from './pages/auth/login.component/login.component';
import { DashboardComponent } from './pages/admin/dashboard.component/dashboard.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component/admin-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { UserComponent } from './pages/admin/users/user.component/user.component';
import { UserFormComponent } from './pages/admin/users/user-form.component/user-form.component';
import { RoleComponent } from './pages/admin/roles/roles.component/roles.component';
import { RoleFormComponent } from './pages/admin/roles/role-form.component/role-form.component';
import { PermissionComponent } from './pages/admin/permissions/permission.component/permission.component';
import { PermissionFormComponent } from './pages/admin/permissions/permission-form.component/permission-form.component';
import { RolePermissionComponent } from './pages/admin/roles/role-permission/role-permission';
import { UserRole } from './pages/admin/users/user-role/user-role';
import { loginGuard } from './guards/login-guard';
import { CategoriesComponent } from './pages/admin/categories/categories.component/categories.component';
import { CategoryFormComponent } from './pages/admin/categories/category-form.component/category-form.component';
import { SubCategoriesComponent } from './pages/admin/subCategories/sub-categories.component/sub-categories.component';
import { SubCategoryFormComponent } from './pages/admin/subCategories/sub-category-form.component/sub-category-form.component';
import { BrandsComponent } from './pages/admin/brands/brands.component/brands.component';
import { BrandFormComponent } from './pages/admin/brands/brand-form.component/brand-form.component';
import { ProductsComponent } from './pages/admin/products/products.component/products.component';
import { ProductFormComponent } from './pages/admin/products/product-form.component/product-form.component';
import { ProductImagesComponent } from './pages/admin/productImages/product-images.component/product-images.component';
import { ProductImageFormComponent } from './pages/admin/productImages/product-image-form.component/product-image-form.component';


export const routes: Routes = [

  { path: '', component: HomeComponent },
  {
    path: 'wishlist', loadComponent: () =>
      import('./pages/frontend/components/wishlist/wishlist')
        .then(m => m.WishlistComponent)
  },

  {
    path: 'cart', loadComponent: () =>
      import('./pages/frontend/components/cart/cart')
        .then(m => m.CartComponent)
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/frontend/components/checkout/checkout')
        .then(m => m.CheckoutComponent)
  },

  { path: 'admin/login', component: LoginComponent, canActivate: [loginGuard] },


  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: "users", component: UserComponent },
      { path: 'users/add', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },
      { path: 'user/role/:id', component: UserRole },
      { path: "roles", component: RoleComponent },
      { path: 'roles/add', component: RoleFormComponent },
      { path: 'roles/edit/:id', component: RoleFormComponent },
      { path: 'roles/permissions/:id', component: RolePermissionComponent },
      { path: 'permissions', component: PermissionComponent },
      { path: 'permissions/add', component: PermissionFormComponent },
      { path: 'permissions/edit/:id', component: PermissionFormComponent },

      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/add', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },

      { path: 'sub-categories', component: SubCategoriesComponent },
      { path: 'sub-categories/add', component: SubCategoryFormComponent },
      { path: 'sub-categories/edit/:id', component: SubCategoryFormComponent },

      { path: 'brands', component: BrandsComponent },
      { path: 'brands/add', component: BrandFormComponent },
      { path: 'brands/edit/:id', component: BrandFormComponent },

      { path: 'products', component: ProductsComponent },
      { path: 'products/add', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },

      { path: 'products-images/:id', component: ProductImagesComponent },
      { path: 'products-images/add/:id', component: ProductImageFormComponent },



    ]
  }

];

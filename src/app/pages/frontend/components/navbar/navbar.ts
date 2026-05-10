import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone:true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
cartCount:number = 0;

wishlistCount:number = 0;

isLoggedIn:boolean = false;

userName:string = '';
}

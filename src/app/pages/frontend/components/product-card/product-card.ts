import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartService} from '../../../../services/frontend/cart/cart.service';   
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
import { AlertService } from '../../../../services/alert/alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {

  @Input() product: any;
  
  constructor(
   
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService,
     private cartService: CartService
  ) { }
addToCart(productId:number){

  const payload = {

    productId: productId,

    quantity: 1

  };

  this.cartService.addToCart(payload)
    .subscribe({

      next:(res)=>{

        console.log(res);
        this.alert.success('Added To Cart successfully');
    
      },

      error:(err)=>{

        console.log(err);

      }

    });

}
}
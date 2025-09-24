import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn:boolean=false;

  constructor(public router:Router, private auth:AuthService){}

ngOnInit() {
  this.auth.checkAuth().subscribe(); //to check state sync on refresh
    this.auth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }
  logout(){
     this.auth.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}

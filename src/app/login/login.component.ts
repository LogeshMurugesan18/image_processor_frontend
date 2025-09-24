import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  // token: string | null = null;
  // userId: number | null = null;
  constructor(
    // private http: HttpClient,
     private router: Router,
     private toastr: ToastrService,
     private auth:AuthService) {}

  // login() {
  //   this.http.post('http://localhost:3000/api/auth/login', {
  //     email: this.email,
  //     password: this.password
  //   },
  // {withCredentials:true}).subscribe({
  //     next: (res:any) => {
  //      this.toastr.success('Login successful!');        
  //       this.router.navigate(['/home']);
  //     },
  //     error: err => this.toastr.error(err.error?.error || 'Login failed')
  //   });

  // }
  
  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.toastr.success('Login successful!');
        this.router.navigate(['/home']);
      },
      error: err => this.toastr.error(err.error?.error || 'Login failed')
    });
  }
}

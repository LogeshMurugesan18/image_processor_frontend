import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  // token: string | null = null;
  // userId: number | null = null;
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    },
  {withCredentials:true}).subscribe({
      next: (res) => {
  //       const token = res.token; 
  //        if (token) {
  //   const payload = JSON.parse(atob(token.split('.')[1])); 
  //   this.userId = payload.id;  
  //   localStorage.setItem('token', token);
  // }
        alert('Login successful!');
        
        this.router.navigate(['/home']);
      },
      error: err => alert(err.error?.error || 'Login failed')
    });

  }
}

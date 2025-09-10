import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule,],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  token: string | null = null;
  isTokenMode = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      this.isTokenMode = !!this.token;
    });
  }

  sendVerification() {
    this.http.post('http://localhost:3000/api/auth/send-verification', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    }).subscribe({
      next: () => alert('Verification email sent!'),
      error: err => alert(err.error?.error || 'Error sending verification email')
    });
  }

  completeSignup() {
    this.http.post('http://localhost:3000/api/auth/complete-signup', {
      token: this.token,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Signup completed!');
        this.router.navigate(['/']);
      },
      error: err => alert(err.error?.error || 'Error completing signup')
    });
  }
}

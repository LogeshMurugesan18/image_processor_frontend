import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule,],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
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
    private router: Router,
    private toastr: ToastrService
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
      next: () => this.toastr.success('Verification email sent!'),
      error: err => this.toastr.error(err.error?.error || 'Error sending verification email')
    });
  }

  completeSignup() {
    this.http.post('http://localhost:3000/api/auth/complete-signup', {
      token: this.token,
      password: this.password
    }).subscribe({
      next: () => {
        this.toastr.success('Signup completed!');
        this.router.navigate(['/']);
      },
      error: err => this.toastr.error(err.error?.error || 'Error completing signup')
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // expose the BehaviorSubject as an observable
  isLoggedIn$;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
    this.isLoggedIn$=this.auth.isLoggedIn$
  }

  ngOnInit() {
    // keep auth state in sync on refresh
    this.auth.checkAuth().subscribe();
     this.isLoggedIn$.subscribe(val => {
    console.log('👀 Header sees isLoggedIn$ =', val);
  });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}

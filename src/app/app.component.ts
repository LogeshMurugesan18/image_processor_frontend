import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) {}
  showHeader(): boolean {
    const currentRoute = this.router.url;
    return !(currentRoute.includes('/login') || currentRoute.includes('/signup') ||currentRoute.includes('/'));
  }
}

import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router) {}
  
}

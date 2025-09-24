import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
processedImages: string[] = [
    'assets/images/car1.jpg',
    'assets/images/car2.jpg',
    'assets/images/bike1.jpg'
  ];

  firstName: string = '';
  lastName: string = '';

  resetPassword() {
    
  }

  updateProfile() {
    
  }
}

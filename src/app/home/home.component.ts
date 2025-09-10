import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  // userId: number = 1; // Temporary, replace later with JWT decoded userId
userId: number | null = null;

ngOnInit() {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.userId = payload.id;
  }
}
  constructor(private http: HttpClient, private router: Router) {}

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

uploadFile() {
  if (!this.selectedFile) {
    alert('Please select a file first');
    return;
  }

  const formData = new FormData();
  formData.append('uploadedFile', this.selectedFile);
  // formData.append('userId', this.userId.toString());  

  this.http.post('http://localhost:3000/api/auth/upload-image', formData, {
    withCredentials: true 
  })
  .subscribe({
    next: (res: any) => {
      alert('File uploaded successfully!');
      this.router.navigate(['/process']); 
    },
    error: (err) => {
      console.error('Upload failed:', err);
      alert('Upload failed. Try again.');
    }
  });
}


  clearSelection() {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  processedImages: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  showControls = false;

  // Store dimensions after upload
  uploadedWidth: number = 0;
  uploadedHeight: number = 0;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchProcessedImages();
  }

  fetchProcessedImages() {
    this.http.get<any[]>('http://localhost:3000/api/auth/user-images', { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.processedImages = res;
        },
        error: (err) => {
          console.error('Error fetching images:', err);
        }
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;

        // Get dimensions using Image object
        const img = new Image();
        img.onload = () => {
          this.uploadedWidth = img.width;
          this.uploadedHeight = img.height;
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.toastr.warning('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('uploadedFile', this.selectedFile);

    this.http.post('http://localhost:3000/api/auth/upload-image', formData, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          console.log('Upload response:', res); // Debug the response
          this.toastr.success('File uploaded successfully!');
          this.showControls = true;

          // Pass dimensions and imageId as well
          this.router.navigate(['/process'], {
            state: { 
              previewUrl: this.previewUrl,
              uploadedFileName: this.selectedFile?.name,
              uploadedFileSize: this.formatBytes(this.selectedFile!.size),
              uploadedImageWidth: this.uploadedWidth,
              uploadedImageHeight: this.uploadedHeight,
              imageId: res.imageId // Ensure this is present
            }
          });

          // Reset preview and file
          this.selectedFile = null;
          this.previewUrl = null;

          // Refresh gallery
          this.fetchProcessedImages();
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.toastr.error('Upload failed. Try again.');
        }
      });
  }

  clearSelection() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.showControls = false;

    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Helper to format bytes to KB/MB
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-process',
  imports: [CommonModule, FormsModule, HeaderComponent, ImageCropperComponent],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'] 
})
export class ProcessComponent {
  previewUrl: string | undefined = undefined;
  croppedImage: string | null = null;

  // File info
  uploadedFileName: string = '';
  uploadedFileSize: string = '';
  processedFileSize: string = '';
  processedFileName: string = '';
  // Popup flags
  showRotatePopup = false;
  showUpscalePopup = false;

  // Selected options
  rotateOption: string = '90';
  upscaleOption: string = '2';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private router: Router, private toastr:ToastrService) {}

  ngOnInit() {
    const navState = history.state;
    if (navState.previewUrl) {
      this.previewUrl = navState.previewUrl;
    }
    if (navState.uploadedFileName) this.uploadedFileName = navState.uploadedFileName;
  if (navState.uploadedFileSize) this.uploadedFileSize = navState.uploadedFileSize;
  }

  // Crop flags
  isCropping = false;
  private tempCropped: string | null = null;

  // File selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.uploadedFileSize = this.formatBytes(file.size);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.croppedImage = null;
        this.processedFileSize = '';
        this.processedFileName='';
      };
      reader.readAsDataURL(file);
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Open popups
  openRotatePopup() { this.showRotatePopup = true; }
  openUpscalePopup() { this.showUpscalePopup = true; }

  // Close popups
  closeRotatePopup() { this.showRotatePopup = false; }
  closeUpscalePopup() { this.showUpscalePopup = false; }

onClose(force = false) {
  if (force) {
    this.toastr.clear(); // remove any active toasts
    this.router.navigate(['/home']); // navigate correctly
    return;
  }

  const toastRef = this.toastr.warning(
    'The currently selected/processed data will be lost.<br><br>' +
    '<button id="confirmCloseBtn" style="background:#d9534f;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Close Anyway</button>',
    'Warning!',
    {
      enableHtml: true,
      timeOut: 0,           // keep it until user decides
      closeButton: true,
      tapToDismiss: false
    }
  );

  // Bind the event manually once toastr is rendered
  setTimeout(() => {
    const btn = document.getElementById('confirmCloseBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        this.toastr.clear();
        this.router.navigate(['/home']);
      });
    }
  }, 200);
}



  private fetchImageAsFile(src: string, fileName: string): Promise<File> {
    return fetch(src)
      .then(res => res.blob())
      .then(blob => new File([blob], fileName, { type: blob.type }));
  }

  // --- Image processing ---
  applyRotate() {
    const sourceImage = this.croppedImage || this.previewUrl;
    if (!sourceImage) return;

    this.fetchImageAsFile(sourceImage, "uploadedFile.png").then(file => {
      const formData = new FormData();
      formData.append("uploadedFile", file);
      formData.append("option", this.rotateOption);

      this.http.post<{ image: string }>(
        "http://localhost:3000/api/auth/rotate",
        formData,
        { withCredentials: true }
      ).subscribe({
        next: (res) => {
          this.croppedImage = res.image;
          this.updateProcessedSize(res.image);
          this.closeRotatePopup();
        },
        error: (err) => console.error("Rotation failed:", err)
      });
    });
  }

  applyUpscale() {
    const sourceImage = this.croppedImage || this.previewUrl;
    if (!sourceImage) return;

    this.fetchImageAsFile(sourceImage, "uploadedFile.png").then(file => {
      const formData = new FormData();
      formData.append("uploadedFile", file);
      formData.append("option", this.upscaleOption);

      this.http.post<{ image: string }>(
        "http://localhost:3000/api/auth/upscale",
        formData,
        { withCredentials: true }
      ).subscribe({
        next: (res) => {
          this.croppedImage = res.image;
          this.updateProcessedSize(res.image);
          this.closeUpscalePopup();
        },
        error: (err) => console.error("Upscale failed:", err)
      });
    });
  }

  // --- Crop handling ---
  startCrop() {
    this.isCropping = true;
    this.tempCropped = null;
  }

  cancelCrop() {
    this.isCropping = false;
    this.tempCropped = null;
  }

  onImageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.tempCropped = event.base64;
    } else if (event.blob) {
      this.tempCropped = URL.createObjectURL(event.blob);
    } else {
      this.tempCropped = '';
    }
  }

  applyCrop() {
    if (this.tempCropped) {
      this.croppedImage = this.tempCropped;
      this.updateProcessedSize(this.croppedImage);
    }
    this.isCropping = false;
  }

  downloadImage() {
    if (!this.croppedImage) return;
    const link = document.createElement('a');
    link.href = this.croppedImage;
    link.download = 'processed-image.png';
    link.click();
  }

  // --- Helper to update processed size ---
  private updateProcessedSize(dataUrl: string) {
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => this.processedFileSize = this.formatBytes(blob.size));
  }
}

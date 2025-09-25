// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HeaderComponent } from '../header/header.component';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
// import { DomSanitizer } from '@angular/platform-browser';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-process',
//   imports: [CommonModule, FormsModule, HeaderComponent, ImageCropperComponent],
//   templateUrl: './process.component.html',
//   styleUrls: ['./process.component.scss']
// })
// export class ProcessComponent {
//   previewUrl: string | undefined = undefined;
//   croppedImage: string | null = null;

//   // File info
//   uploadedFileName: string = '';
//   uploadedFileSize: string = '';
//   uploadedImageWidth: number = 0;
//   uploadedImageHeight: number = 0;

//   processedFileName: string = '';
//   processedFileSize: string = '';
//   processedImageWidth: number = 0;
//   processedImageHeight: number = 0;

//   // Popup flags
//   showRotatePopup = false;
//   showUpscalePopup = false;
//   showClosePopup = false;

//   // Selected options
//   rotateOption: string = '90';
//   upscaleOption: string = '2';

//   constructor(
//     private http: HttpClient,
//     private sanitizer: DomSanitizer,
//     private router: Router,
//     private toastr: ToastrService
//   ) {}

//   ngOnInit() {
//     const navState = history.state;

//     if (navState.previewUrl) {
//       this.previewUrl = navState.previewUrl;
//       this.updateUploadedSize(this.previewUrl ||''); 
//     }
//     if (navState.uploadedFileName) this.uploadedFileName = navState.uploadedFileName;
//     if (navState.uploadedFileSize) this.uploadedFileSize = navState.uploadedFileSize;
//     if (navState.uploadedImageWidth) this.uploadedImageWidth = +navState.uploadedImageWidth;
//     if (navState.uploadedImageHeight) this.uploadedImageHeight = +navState.uploadedImageHeight;
//   }

//   // Crop flags
//   isCropping = false;
//   private tempCropped: string | null = null;

//   // File selection
//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.uploadedFileName = file.name;
//       this.uploadedFileSize = this.formatBytes(file.size);

//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.previewUrl = e.target.result;
//         this.croppedImage = null;
//         this.processedFileName = '';
//         this.processedFileSize = '';
//         this.updateUploadedSize(this.previewUrl!); // update width/height for uploaded
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   formatBytes(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   // Open popups
//   openRotatePopup() { this.showRotatePopup = true; }
//   openUpscalePopup() { this.showUpscalePopup = true; }

//   // Close popups
//   closeRotatePopup() { this.showRotatePopup = false; }
//   closeUpscalePopup() { this.showUpscalePopup = false; }

//   // Open close confirmation popup
//   onClose() {
//     this.showClosePopup = true;
//   }

//   // Handle OK
//   confirmClose() {
//     this.showClosePopup = false;
//     this.router.navigate(['/home']);
//   }

//   // Handle Cancel
//   cancelClose() {
//     this.showClosePopup = false;
//   }

//   private fetchImageAsFile(src: string, fileName: string): Promise<File> {
//     return fetch(src)
//       .then(res => res.blob())
//       .then(blob => new File([blob], fileName, { type: blob.type }));
//   }

//   // --- Image processing ---
//   applyRotate() {
//     const sourceImage = this.croppedImage || this.previewUrl;
//     if (!sourceImage) return;

//     this.fetchImageAsFile(sourceImage, "uploadedFile.png").then(file => {
//       const formData = new FormData();
//       formData.append("uploadedFile", file);
//       formData.append("option", this.rotateOption);

//       this.http.post<{ image: string }>(
//         "http://localhost:3000/api/auth/rotate",
//         formData,
//         { withCredentials: true }
//       ).subscribe({
//         next: (res) => {
//           this.croppedImage = res.image;
//           this.processedFileName = 'rotated-' + file.name;
//           this.updateProcessedSize(res.image);
//           this.closeRotatePopup();
//         },
//         error: (err) => console.error("Rotation failed:", err)
//       });
//     });
//   }

//   applyUpscale() {
//     const sourceImage = this.croppedImage || this.previewUrl;
//     if (!sourceImage) return;

//     this.fetchImageAsFile(sourceImage, "uploadedFile.png").then(file => {
//       const formData = new FormData();
//       formData.append("uploadedFile", file);
//       formData.append("option", this.upscaleOption);

//       this.http.post<{ image: string }>(
//         "http://localhost:3000/api/auth/upscale",
//         formData,
//         { withCredentials: true }
//       ).subscribe({
//         next: (res) => {
//           this.croppedImage = res.image;
//           this.processedFileName = 'upscaled-' + file.name;
//           this.updateProcessedSize(res.image);
//           this.closeUpscalePopup();
//         },
//         error: (err) => console.error("Upscale failed:", err)
//       });
//     });
//   }

//   // --- Crop handling ---
//   startCrop() {
//     this.isCropping = true;
//     this.tempCropped = null;
//   }

//   cancelCrop() {
//     this.isCropping = false;
//     this.tempCropped = null;
//   }

//   onImageCropped(event: ImageCroppedEvent) {
//     if (event.base64) {
//       this.tempCropped = event.base64;
//     } else if (event.blob) {
//       this.tempCropped = URL.createObjectURL(event.blob);
//     } else {
//       this.tempCropped = '';
//     }
//   }

//   applyCrop() {
//     if (this.tempCropped) {
//       this.croppedImage = this.tempCropped;
//       this.processedFileName = 'cropped-' + this.uploadedFileName;
//       this.updateProcessedSize(this.croppedImage);
//     }
//     this.isCropping = false;
//   }

//   downloadImage() {
//     if (!this.croppedImage) return;
//     const link = document.createElement('a');
//     link.href = this.croppedImage;
//     link.download = this.processedFileName || 'processed-image.png';
//     link.click();
//   }

//   // --- Helper to update uploaded size & dimensions ---
//   private updateUploadedSize(dataUrl: string) {
//     const img = new Image();
//     img.onload = () => {
//       this.uploadedImageWidth = img.width;
//       this.uploadedImageHeight = img.height;
//     };
//     img.src = dataUrl;
//   }

//   // --- Helper to update processed size & dimensions ---
//   private updateProcessedSize(dataUrl: string) {
//     fetch(dataUrl)
//       .then(res => res.blob())
//       .then(blob => {
//         this.processedFileSize = this.formatBytes(blob.size);

//         const img = new Image();
//         img.onload = () => {
//           this.processedImageWidth = img.width;
//           this.processedImageHeight = img.height;
//         };
//         img.src = dataUrl;
//       });
//   }

// // --- Save processed image ---
//   private saveProcessedImage() {
//     if (this.croppedImage && this.processedFileName) {
//       this.fetchImageAsFile(this.croppedImage, this.processedFileName).then(file => {
//         const formData = new FormData();
//         formData.append('imageId', 'some-image-id'); // Replace with actual imageId
//         formData.append('processedFileSize', this.processedFileSize);
//         formData.append('processedFile', file);
//         formData.append('actionId', 'some-action-id'); // Replace with actual actionId
//         formData.append('sessionId', 'some-session-id'); // Replace with actual sessionId

//         this.http.post('http://localhost:3000/api/save-image', formData, { withCredentials: true })
//           .subscribe({
//             next: () => this.toastr.success('Image saved successfully'),
//             error: (err) => {
//               console.error('Save failed:', err);
//               this.toastr.error('Failed to save image');
//             }
//           });
//       });
//     }
//   }






// }
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for session ID

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
  uploadedImageWidth: number = 0;
  uploadedImageHeight: number = 0;

  processedFileName: string = '';
  processedFileSize: string = '';
  processedImageWidth: number = 0;
  processedImageHeight: number = 0;

  // Popup flags
  showRotatePopup = false;
  showUpscalePopup = false;
  showClosePopup = false;

  // Selected options
  rotateOption: string = '90';
  upscaleOption: string = '2';

  // Session ID
  sessionId: string = uuidv4(); // Generate unique session ID on component init

  // Image ID
  imageId: string | null = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const navState = history.state;
    console.log('Navigation state:', navState); // Debug navigation state

    if (navState.previewUrl) {
      this.previewUrl = navState.previewUrl;
      this.updateUploadedSize(this.previewUrl ||''); 
    }
    if (navState.uploadedFileName) this.uploadedFileName = navState.uploadedFileName;
    if (navState.uploadedFileSize) this.uploadedFileSize = navState.uploadedFileSize;
    if (navState.uploadedImageWidth) this.uploadedImageWidth = +navState.uploadedImageWidth;
    if (navState.uploadedImageHeight) this.uploadedImageHeight = +navState.uploadedImageHeight;
    if (navState.imageId) this.imageId = navState.imageId; // Use imageId from upload
    else {
      console.error('imageId not found in navigation state');
      this.toastr.error('Image ID not received. Upload may have failed.');
    }
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
        this.processedFileName = '';
        this.processedFileSize = '';
        this.updateUploadedSize(this.previewUrl!); // update width/height for uploaded
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

  // Open close confirmation popup
  onClose() {
    this.showClosePopup = true;
  }

  // Handle OK
  confirmClose() {
    this.showClosePopup = false;
    this.router.navigate(['/home']);
  }

  // Handle Cancel
  cancelClose() {
    this.showClosePopup = false;
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
          this.processedFileName = 'rotated-' + file.name;
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
          this.processedFileName = 'upscaled-' + file.name;
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
      this.processedFileName = 'cropped-' + this.uploadedFileName;
      this.updateProcessedSize(this.croppedImage);
    }
    this.isCropping = false;
  }

  downloadImage() {
    if (!this.croppedImage) return;
    const link = document.createElement('a');
    link.href = this.croppedImage;
    link.download = this.processedFileName || 'processed-image.png';
    link.click();
  }

  // --- Helper to update uploaded size & dimensions ---
  private updateUploadedSize(dataUrl: string) {
    const img = new Image();
    img.onload = () => {
      this.uploadedImageWidth = img.width;
      this.uploadedImageHeight = img.height;
    };
    img.src = dataUrl;
  }

  // --- Helper to update processed size & dimensions ---
  private updateProcessedSize(dataUrl: string) {
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        this.processedFileSize = this.formatBytes(blob.size);

        const img = new Image();
        img.onload = () => {
          this.processedImageWidth = img.width;
          this.processedImageHeight = img.height;
        };
        img.src = dataUrl;
      });
  }

  // --- Save processed image ---
  public saveProcessedImage() {
    console.log('saveProcessedImage called');
    console.log('croppedImage:', this.croppedImage);
    console.log('processedFileName:', this.processedFileName);
    console.log('imageId:', this.imageId);
    console.log('processedFileSize:', this.processedFileSize);

    if (!this.croppedImage || !this.processedFileName || !this.imageId) {
      console.log('Error: Missing required data - croppedImage, processedFileName, or imageId');
      this.toastr.error('Missing required image data');
      return;
    }

    this.fetchImageAsFile(this.croppedImage, this.processedFileName).then(file => {
      console.log('File fetched for upload:', file);
      const formData = new FormData();
      formData.append('imageId', this.imageId!);
      formData.append('processedFileSize', this.processedFileSize || '0'); // Fallback if undefined
      formData.append('processedFile', file);
      formData.append('actionId', ''); // NULL will be handled by backend
      formData.append('sessionId', this.sessionId);

      console.log('FormData prepared, sending request...');
      this.http.post('http://localhost:3000/api/auth/save-image', formData, { withCredentials: true }) 
        .subscribe({
          next: (response) => {
            console.log('Upload successful:', response);
            this.toastr.success('Image saved successfully');
          },
          error: (err) => {
            console.error('Save failed:', err);
            this.toastr.error(`Failed to save image: ${err.status} - ${err.statusText || err.message}`);
          }
        });
    }).catch(err => {
      console.error('Error fetching file:', err);
      this.toastr.error('Failed to process image file');
    });
  }
}
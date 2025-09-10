import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download',
  imports: [CommonModule,FormsModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent {
  fileName: string = "processed_image";  // we can set this dynamically later
  fileDownloaded: boolean = false;

  constructor(private router: Router) {}

  // simulate download (later connect to backend)
  downloadAs(format: string) {
    const link = document.createElement('a');
    link.download = `${this.fileName}.${format.toLowerCase()}`;
    link.href = "assets/placeholder.png"; // later replace with processed image blob
    link.click();

    this.fileDownloaded = true;
  }

  processMore() {
    this.router.navigate(['/home']);
  }
}

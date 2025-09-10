import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-process',
  imports: [CommonModule,RouterLink],
  templateUrl: './process.component.html',
  styleUrl: './process.component.css'
})
export class ProcessComponent {
previewUrl: string | null = null; // gets from upload page
  rotation: number = 0;
  selectedResolution: string = '1920x1080';

  resolutions: string[] = [
    '640x480',
    '800x600',
    '1024x768',
    '1280x720',
    '1920x1080',
    '3480x2160'
  ];

  rotateLeft() {
    this.rotation -= 90;
  }

  rotateRight() {
    this.rotation += 90;
  }

  selectResolution(res: string) {
    this.selectedResolution = res;
  }

  processImage() {
    console.log(`Processing with resolution: ${this.selectedResolution}, rotation: ${this.rotation}`);
    // Later: Call backend API here
  }
}

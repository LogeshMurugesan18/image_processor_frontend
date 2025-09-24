import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',   // ✅ use external HTML
  styleUrls: ['./spinner.component.scss']    // ✅ plural: styleUrls
})
export class SpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}

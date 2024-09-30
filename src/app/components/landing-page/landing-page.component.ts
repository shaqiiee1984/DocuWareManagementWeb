import { Component } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { DocumentListComponent } from '../document-list/document-list.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  standalone: true,
  imports: [
    FileUploadComponent,
    DocumentListComponent
  ]
})
export class LandingPageComponent {
  // Add component logic here if needed
}

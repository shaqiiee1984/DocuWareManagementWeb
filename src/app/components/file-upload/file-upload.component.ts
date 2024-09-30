import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service'; // Import DocumentService
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent {
  companyName: string = '';
  contactName: string = '';
  birthday: string = '';
  selectedFile: File | null = null;

  constructor(private documentService: DocumentService) {} // Inject DocumentService

  /**
   * Event handler for file selection
   * @param {Event} event - The input file change event
   */
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedFile = inputElement.files ? inputElement.files[0] : null;
  }

  /**
   * Uploads the selected file along with company, contact name, and birthday
   */
  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('companyName', this.companyName);
      formData.append('contactName', this.contactName);
      formData.append('birthday', this.birthday);

      this.documentService.uploadDocument(formData).subscribe({
        next: (response) => {
          console.log('File uploaded successfully', response);
          alert('File uploaded successfully!');
          
          // Notify the document list component to refresh
          this.documentService.notifyDocumentUpdate();
        },
        error: (error) => {
          console.error('Error uploading file', error);
          alert('Failed to upload file. Please try again.');
        }
      });
    } else {
      console.log('No file selected');
      alert('Please select a file before uploading.');
    }
  }
}

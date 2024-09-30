import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-list.component.html',
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: any[] = [];
  isLoading: boolean = false; 
  private documentUpdateSubscription!: Subscription; 

  constructor(private documentService: DocumentService) {}

  /**
   * Lifecycle hook to initialize the component
   * Subscribes to document updates and loads the document list
   * @returns void
   */
  ngOnInit(): void {
    this.loadDocuments();

    this.documentUpdateSubscription = this.documentService
      .getDocumentUpdateListener()
      .subscribe(() => {
        this.loadDocuments();
      });
  }

  /**
   * Lifecycle hook to clean up resources when the component is destroyed
   * Unsubscribes from the document update subscription
   * @returns void
   */
  ngOnDestroy(): void {
    if (this.documentUpdateSubscription) {
      this.documentUpdateSubscription.unsubscribe();
    }
  }

  /**
   * Fetches the document list from the server and updates the documents array
   * Also sets a loading state while the request is in progress
   * @returns void
   */
  loadDocuments(): void {
    this.isLoading = true;
    this.documentService.getDocumentList().subscribe({
      next: (data) => {
        this.documents = data;
        console.log('Documents loaded:', this.documents);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching documents:', error);
        this.isLoading = false;
      },
    });
  }

  /**
   * Retrieves the value of a specific field from a document object
   * @param {any} document - The document object
   * @param {string} fieldName - The name of the field to retrieve
   * @returns {string | null} - The value of the field or null if not found
   */
  getFieldValue(document: any, fieldName: string): string | null {
    const field = document.fields.find((f: any) => f.fieldName === fieldName);
    return field ? field.item : null;
  }

  /**
   * Deletes a document after user confirmation
   * Displays loading state and reloads the document list after deletion
   * @param {any} document - The document object to delete
   * @returns void
   */
  deleteDocument(document: any): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete document ${this.getFieldValue(document, 'DWDOCID')}?`
    );
    if (confirmDelete) {
      this.isLoading = true;
      this.documentService.deleteDocument(document.id).subscribe({
        next: () => {
          alert('Document deleted successfully.');
          this.loadDocuments();
        },
        error: (error) => {
          console.error('Error deleting document:', error);
          alert('Failed to delete document. Please try again.');
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * Calculates the file size of a document in megabytes
   * @param {any} document - The document object containing the file size field
   * @returns {number} - The file size in MB, or 0 if size is null/undefined
   */
  getFileSizeInMB(document: any): number {
    const sizeInKB = this.getFieldValue(document, 'DWDOCSIZE');
    return sizeInKB ? Number(sizeInKB) / 1024 / 1024 : 0;
  }  
}

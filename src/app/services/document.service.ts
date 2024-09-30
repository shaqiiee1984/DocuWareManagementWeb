import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Import environment config

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl; // Use apiUrl from environment
  private documentUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of documents from the server.
   * @returns Observable<any[]>
   */
  getDocumentList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Uploads a document to the server.
   * @param {FormData} formData - The form data containing the file and metadata.
   * @returns Observable<any>
   */
  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a document by its ID.
   * @param {string} documentId - The unique ID of the document to be deleted.
   * @returns Observable<any>
   */
  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${documentId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Notifies components that a document update has occurred.
   */
  notifyDocumentUpdate(): void {
    this.documentUpdated.next();
  }

  /**
   * Returns an observable that listens for document update notifications.
   * @returns Observable<void>
   */
  getDocumentUpdateListener(): Observable<void> {
    return this.documentUpdated.asObservable();
  }

  /**
   * Handles errors from HTTP requests.
   * @param {HttpErrorResponse} error - The error object returned from the HTTP request.
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(
      error.error instanceof ErrorEvent
        ? `Client-side error: ${error.error.message}`
        : `Server-side error: ${error.status}, ${error.error}`
    );
    return throwError(() => new Error('Something went wrong. Please try again.'));
  }
}

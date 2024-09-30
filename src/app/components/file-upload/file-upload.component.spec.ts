import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import { DocumentService } from '../../services/document.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DocumentService', ['uploadDocument', 'notifyDocumentUpdate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, FileUploadComponent], // Import FileUploadComponent since it is standalone
      providers: [{ provide: DocumentService, useValue: spy }]
    }).compileComponents();

    documentServiceSpy = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(mockEvent);

    expect(component.selectedFile).toEqual(mockFile);
  });

  it('should upload file successfully', () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    component.selectedFile = mockFile;
    component.companyName = 'Test Company';
    component.contactName = 'John Doe';
    component.birthday = '1990-01-01';

    documentServiceSpy.uploadDocument.and.returnValue(of({ success: true })); // Simulate successful upload

    spyOn(window, 'alert'); // Spy on the alert function

    component.uploadFile();

    // Ensure the file upload method was called with the correct FormData
    expect(documentServiceSpy.uploadDocument).toHaveBeenCalled();
    expect(documentServiceSpy.notifyDocumentUpdate).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('File uploaded successfully!');
  });

  it('should handle upload error', () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    component.selectedFile = mockFile;

    // Simulate an error during upload
    documentServiceSpy.uploadDocument.and.returnValue(throwError(() => new Error('Upload failed')));

    spyOn(window, 'alert'); // Spy on the alert function
    spyOn(console, 'error'); // Spy on console.error

    component.uploadFile();

    expect(documentServiceSpy.uploadDocument).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to upload file. Please try again.');
    expect(console.error).toHaveBeenCalledWith('Error uploading file', jasmine.any(Error));
  });

  it('should alert when no file is selected', () => {
    component.selectedFile = null; // No file selected

    spyOn(window, 'alert'); // Spy on the alert function
    spyOn(console, 'log'); // Spy on console.log

    component.uploadFile();

    expect(window.alert).toHaveBeenCalledWith('Please select a file before uploading.');
    expect(console.log).toHaveBeenCalledWith('No file selected');
  });
});

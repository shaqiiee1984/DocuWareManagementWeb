import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentListComponent } from './document-list.component';
import { DocumentService } from '../../services/document.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, Subscription } from 'rxjs';

describe('DocumentListComponent', () => {
  let component: DocumentListComponent;
  let fixture: ComponentFixture<DocumentListComponent>;
  let documentService: DocumentService;
  
  const mockDocuments = [
    { id: '1', fields: [{ fieldName: 'DWDOCID', item: '1' }, { fieldName: 'DWDOCSIZE', item: '1024000' }] },
    { id: '2', fields: [{ fieldName: 'DWDOCID', item: '2' }, { fieldName: 'DWDOCSIZE', item: '2048000' }] }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DocumentListComponent], // Import standalone component here
      providers: [
        {
          provide: DocumentService,
          useValue: {
            getDocumentList: jasmine.createSpy('getDocumentList').and.returnValue(of(mockDocuments)),
            deleteDocument: jasmine.createSpy('deleteDocument').and.returnValue(of({ success: true })),
            getDocumentUpdateListener: jasmine.createSpy('getDocumentUpdateListener').and.returnValue(of())
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
    documentService = TestBed.inject(DocumentService);
  });

  afterEach(() => {
    // Clean up any subscriptions
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load documents on initialization', () => {
    fixture.detectChanges(); // Triggers ngOnInit

    expect(documentService.getDocumentList).toHaveBeenCalled();
    expect(component.documents.length).toBe(2);
    expect(component.documents).toEqual(mockDocuments);
  });

  it('should call loadDocuments and handle success', () => {
    component.loadDocuments();
    expect(documentService.getDocumentList).toHaveBeenCalled();
    expect(component.documents).toEqual(mockDocuments);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error in loadDocuments', () => {
    documentService.getDocumentList = jasmine.createSpy('getDocumentList').and.returnValue(throwError(() => new Error('Failed to load')));
    component.loadDocuments();

    expect(documentService.getDocumentList).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.documents.length).toBe(0);
  });

  it('should retrieve field value from document', () => {
    const fieldValue = component.getFieldValue(mockDocuments[0], 'DWDOCID');
    expect(fieldValue).toBe('1');
  });

  it('should return null if field does not exist', () => {
    const fieldValue = component.getFieldValue(mockDocuments[0], 'NON_EXISTING_FIELD');
    expect(fieldValue).toBeNull();
  });

  it('should delete document and reload list on success', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.documents = mockDocuments; // Pre-populate the document list

    component.deleteDocument(mockDocuments[0]);

    expect(documentService.deleteDocument).toHaveBeenCalledWith(mockDocuments[0].id);
    expect(documentService.getDocumentList).toHaveBeenCalled();
  });

  it('should handle delete document failure', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    documentService.deleteDocument = jasmine.createSpy('deleteDocument').and.returnValue(throwError(() => new Error('Delete failed')));
    component.documents = mockDocuments;

    component.deleteDocument(mockDocuments[0]);

    expect(documentService.deleteDocument).toHaveBeenCalledWith(mockDocuments[0].id);
    expect(component.isLoading).toBeFalse();
  });

  it('should calculate file size correctly', () => {
    const fileSize = component.getFileSizeInMB(mockDocuments[0]);
    expect(fileSize).toBeCloseTo(0.9765625); // 1024000 KB / 1024 / 1024 MB
  });

  it('should return 0 for invalid file size', () => {
    const fileSize = component.getFileSizeInMB({ fields: [] }); // Document with no size field
    expect(fileSize).toBe(0);
  });

  it('should unsubscribe from document update on destroy', () => {
    const subscription = new Subscription();
    spyOn(subscription, 'unsubscribe');
    component['documentUpdateSubscription'] = subscription;

    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});

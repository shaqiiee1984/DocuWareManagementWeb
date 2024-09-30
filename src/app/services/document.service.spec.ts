import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService]
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get document list', () => {
    const mockDocuments = [{ id: '1', fields: [] }, { id: '2', fields: [] }];

    service.getDocumentList().subscribe((documents) => {
      expect(documents).toEqual(mockDocuments);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/list`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDocuments); // Simulate a successful response with mock documents
  });

  it('should upload a document', () => {
    const mockFormData = new FormData();
    const mockResponse = { success: true };

    service.uploadDocument(mockFormData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFormData); // Verify the form data sent
    req.flush(mockResponse); // Simulate a successful response
  });

  it('should delete a document', () => {
    const mockDocumentId = '1';
    const mockResponse = { success: true };

    service.deleteDocument(mockDocumentId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${mockDocumentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse); // Simulate a successful deletion
  });

  it('should notify document update', (done) => {
    service.getDocumentUpdateListener().subscribe(() => {
      expect(true).toBeTruthy(); // Ensures the notification is triggered
      done(); // Mark the asynchronous test as done
    });

    service.notifyDocumentUpdate(); // Trigger the notification
  });
});

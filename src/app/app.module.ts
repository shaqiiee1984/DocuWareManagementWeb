import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DocumentService } from './services/document.service';
import { routes } from './app.routes';

// Import the standalone components directly
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DocumentListComponent } from './components/document-list/document-list.component';

@NgModule({  
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    LandingPageComponent,
    FileUploadComponent,
    DocumentListComponent
  ],
  providers: [DocumentService],
  exports: [RouterModule] // Export RouterModule for use in other modules
})
export class AppModule { }

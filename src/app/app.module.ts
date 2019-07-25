import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UploadService } from './upload.service';
import { EmbedVideo } from 'ngx-embed-video';
import { TestPlayerComponent } from './test-player/test-player.component';
import { TestEmbeddedComponent } from './test-embedded/test-embedded.component';
import { CustomHeaderInterceptor } from './custom-header.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    TestPlayerComponent,
    TestEmbeddedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    EmbedVideo.forRoot()
  ],
  providers: [UploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHeaderInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

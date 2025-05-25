import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { StatusBar, Style } from '@capacitor/status-bar';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [FileChooser,
    FilePath, Media,  File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

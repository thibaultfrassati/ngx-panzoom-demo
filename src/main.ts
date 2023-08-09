import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic"; // Assurez-vous que le chemin est correct

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

if (environment.production) {
  enableProdMode();
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Importez les modules nécessaires ici
import { DraggableDirective } from './draggable.directive';
import { AppComponent } from './app.component'; // Assurez-vous que le chemin vers votre composant est correct
import { NgxPanZoomModule } from 'ngx-panzoom';

@NgModule({
  declarations: [
    DraggableDirective,
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgxPanZoomModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

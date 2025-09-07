import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,  // Aggiungi CommonModule per usare *ngFor
    routes         // Aggiungi il tuo array di routes
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

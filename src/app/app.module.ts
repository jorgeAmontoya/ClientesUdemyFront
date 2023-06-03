import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component'

import { FormsModule } from '@angular/forms';
import{registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es';



registerLocaleData(localeES, 'es');


@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    DirectivaComponent,
    FooterComponent,
    HeaderComponent,
    FormComponent,
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
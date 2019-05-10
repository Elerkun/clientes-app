import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClientesService } from './clientes/clientes.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import { FormComponent } from './clientes/form.component';
import{FormsModule} from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PaginateComponent } from './paginate/paginate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {MatNativeDateModule, MatDatepickerModule} from '@angular/material';
import { DetalleComponent } from './clientes/detalle/detalle.component';

registerLocaleData(localeEs, 'es')
const routes: Routes = [
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path:'clientes', component:ClientesComponent},
  {path:'clientes/page/:page', component:ClientesComponent},
  {path:'directiva', component:DirectivaComponent},
  {path:'clientes/form', component:FormComponent},
  {path:'clientes/form/:id', component:FormComponent},
  {path:'clientes/upload/:id', component:DetalleComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginateComponent,
    DetalleComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule, [MatDatepickerModule, MatNativeDateModule]
  ],
  providers: [ClientesService],
  bootstrap: [AppComponent]
})
export class AppModule { }

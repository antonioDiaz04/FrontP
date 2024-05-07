import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './core/commons/components/footer/footer.component';
import { HeaderComponent } from './core/commons/components/header/header.component';
// import { PublicComponent } from './core/features/public/public.component';
import { HomeView } from './features/public/view/home/home.view';
import { FormVehiculoComponent } from './features/admin/commons/components/form-vehiculo/form-vehiculo.component';
import { FormRepartidoresComponent } from './features/admin/commons/components/form-repartidores/form-repartidores.component';
import { FormRutasComponent } from './features/admin/commons/components/form-rutas/form-rutas.component';
import { FormClienteComponent } from './features/admin/commons/components/form-cliente/form-cliente.component';
import { SigninComponent } from './features/auth/commons/components/signin/signin.component';
import { PublicComponent } from './features/public/public.component';
import { AdminComponent } from './features/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    // PublicComponent,
    HomeView,
    FormVehiculoComponent,
    FormRepartidoresComponent,
    FormRutasComponent,
    FormClienteComponent,
    SigninComponent,
    PublicComponent,
    AdminComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartidorRoutingModule } from './repartidor-routing.module';
import { RepartidorComponent } from './repartidor.component';
import { InicioView } from './commons/view/inicio/inicio.view';
import { SignupService } from '../../shared/services/signup.service';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';


@NgModule({
  declarations: [RepartidorComponent, InicioView,

  ],
  imports: [
    CommonModule,
    RepartidorRoutingModule
  ], providers: [provideClientHydration(), [provideHttpClient(withFetch())],
    SignupService]
})
export class RepartidorModule { }

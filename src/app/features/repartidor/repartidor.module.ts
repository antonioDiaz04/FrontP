import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartidorRoutingModule } from './repartidor-routing.module';
import { RepartidorComponent } from './repartidor.component';
import { InicioView } from './view/inicio/inicio.view';
import { SignupService } from '../../shared/services/signup.service';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RepartidorHomeView } from './view/repartidor-home/repartidor-home.view';

import { SidebarModule } from 'primeng/sidebar';

const MATERIAL = [SidebarModule]

@NgModule({
  declarations: [RepartidorComponent, InicioView,RepartidorHomeView

  ],
  imports: [MATERIAL,
    CommonModule,
    RepartidorRoutingModule
  ], providers: [provideClientHydration(), [provideHttpClient(withFetch())],
    SignupService]
})
export class RepartidorModule { }

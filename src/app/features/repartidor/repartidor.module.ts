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
import { ClientesView } from './view/clientes/clientes.view';
import { RutaView } from './view/ruta/ruta.view';
import { PerfilView } from './view/perfil/perfil.view';
import { EntregasView } from './view/entregas/entregas.view';
import { OpcionesView } from './view/opciones/opciones.view';
import { CodigoqrView } from './view/codigoqr/codigoqr.view';

const MATERIAL = [SidebarModule]

@NgModule({
  declarations: [RepartidorComponent, InicioView,RepartidorHomeView, ClientesView, RutaView, PerfilView, EntregasView, OpcionesView, CodigoqrView

  ],
  imports: [MATERIAL,
    CommonModule,
    RepartidorRoutingModule
  ], providers: [provideClientHydration(), [provideHttpClient(withFetch())],
    SignupService]
})
export class RepartidorModule { }

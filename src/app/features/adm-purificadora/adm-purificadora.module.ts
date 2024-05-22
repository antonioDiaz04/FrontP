import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmPurificadoraRoutingModule } from './adm-purificadora-routing.module';
import { MapaView } from './view/mapa/mapa.view';
import { ClienteTablaComponent } from './commons/components/cliente-tabla/cliente-tabla.component';


@NgModule({
  declarations: [
    MapaView,ClienteTablaComponent,
  ],
  imports: [
    CommonModule,
    AdmPurificadoraRoutingModule
  ]
})
export class AdmPurificadoraModule { }

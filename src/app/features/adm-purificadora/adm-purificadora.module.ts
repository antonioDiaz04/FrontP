import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmPurificadoraRoutingModule } from './adm-purificadora-routing.module';
import { MapaView } from './view/mapa/mapa.view';
import { ClienteTablaComponent } from './commons/components/cliente-tabla/cliente-tabla.component';
import { AdmHomeView } from './view/adm-home/adm-home.view';
import { AdmDashboardView } from './view/adm-dashboard/adm-dashboard.view';
import { InicioView } from './view/inicio/inicio.view';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { MaterialModule } from '../admin/commons/material/material.module';
import { ClientesService } from '../../shared/services/clientes.service';
import { SignupService } from '../../shared/services/signup.service';
// import { UsuarioView } from './view/usuario/usuario.view';
import { ProductoView } from './view/producto/producto.view';
import { PedidosView } from './view/pedidos/pedidos.view';
import { NotificacionesView } from './view/notificaciones/notificaciones.view';
import { ControlEntregasView } from './view/control-entregas/control-entregas.view';
import { ComentariosView } from './view/comentarios/comentarios.view';
import { MapaClientsView } from './view/mapa-clients/mapa-clients.view';
import { ClienteFormComponent } from './commons/components/cliente-form/cliente-form.component';
import { ProductFormComponent } from './commons/components/product-form/product-form.component';
import { VentasComponent } from './commons/components/ventas/ventas.component';
import { PedidosComponent } from './commons/components/pedidos/pedidos.component';
import { AdmPurificadoraComponent } from './adm-purificadora.component';
import { Grafica1Component } from './commons/components/grafica1/grafica1.component';
import { RepartidoresFormComponent } from './commons/components/repartidores-form/repartidores-form.component';
import { RepartidoresListadoComponent } from './commons/components/repartidores-listado/repartidores-listado.component';
import { RepartidoresView } from './view/repartidores/repartidores.view';

const MATERIALS = [
  AvatarModule, AvatarGroupModule, DialogModule, ModalModule
]
@NgModule({
  declarations: [
    AdmPurificadoraComponent,RepartidoresFormComponent,RepartidoresListadoComponent,
    AdmHomeView, ProductoView, PedidosView, NotificacionesView, MapaClientsView, ControlEntregasView, ComentariosView,
    AdmDashboardView, VentasComponent, InicioView, ProductFormComponent, PedidosComponent,
    MapaView,ClienteTablaComponent,ClienteFormComponent, Grafica1Component, RepartidoresFormComponent, RepartidoresListadoComponent, RepartidoresView,
  ],
  imports: [MATERIALS, HttpClientModule,
    CommonModule, FormsModule,
     AdmPurificadoraRoutingModule,MaterialModule, ReactiveFormsModule
  ],
  providers: [
    SignupService,ClientesService]
})
export class AdmPurificadoraModule { 
}

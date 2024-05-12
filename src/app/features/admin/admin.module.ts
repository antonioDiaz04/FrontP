// import { HttpClient } from '@angular/HttpClientt';
// import { HttpClient } from '@angular/HttpClient';
// import { HttpModule } from '@angular/HttpClient';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { AdmDashboardView } from './view/adm-dashboard/adm-dashboard.view';
import { AdmHomeView } from './view/adm-home/adm-home.view';
// import { UsuarioCrudView } from './view/usuarios/usuario-crud/usuario-crud.view';
import { NotificacionesView } from './view/notificaciones/notificaciones.view';
import { ProductFormComponent } from './commons/components/product-form/product-form.component';
import { VentasComponent } from './commons/components/ventas/ventas.component';
import { PedidosComponent } from './commons/components/pedidos/pedidos.component';
import { MaterialModule } from './commons/material/material.module';
import { AdminComponent } from './admin.component';
import { ProductoView } from './view/producto/producto.view';
import { InicioView } from './view/inicio/inicio.view';
import { TablaUsuarioComponent } from './commons/components/tabla-usuario/tabla-usuario.component';
import { UsuarioView } from './view/usuario/usuario.view';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ComentariosView } from './view/comentarios/comentarios.view';
import { PedidosView } from './view/pedidos/pedidos.view';
import { ControlEntregasView } from './view/control-entregas/control-entregas.view';
import { MapaClientsView } from './view/mapa-clients/mapa-clients.view';
import { ClienteFormComponent } from './commons/components/cliente-form/cliente-form.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ClienteTablaComponent } from './commons/components/cliente-tabla/cliente-tabla.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzModalModule } from 'ng-zorro-antd/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogModule } from 'primeng/dialog';
import { MapaView } from './view/mapa/mapa.view';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { SignupService } from '../../shared/services/signup.service';
import { ClientesService } from '../../shared/services/clientes.service';
// HttpClientMod 

// import { HttpClient, HttpModule } from '@angular/HttpClient';

// ReactiveFormsModule
// FormsModule
const MATERIALS = [
  AvatarModule, AvatarGroupModule, NzModalModule, DialogModule, ModalModule
]
// import { AdmDashboardView } from './adm-dashboard/adm-dashboard.view';
@NgModule({
  declarations: [

    AdmDashboardView,
    AdmHomeView,
    // UsuarioCrudView,
    NotificacionesView,
    ProductFormComponent,
    VentasComponent,
    PedidosComponent,
    AdminComponent,
    ProductoView,
    InicioView,
    TablaUsuarioComponent,
    UsuarioView,
    ComentariosView,
    PedidosView,
    ControlEntregasView,
    MapaClientsView,
    ClienteFormComponent,
    ClienteTablaComponent,
    MapaView,  
  ],
  imports: [MATERIALS, HttpClientModule,
    CommonModule, NzButtonModule, FormsModule,
    AdminRoutingModule, MaterialModule, ReactiveFormsModule
  ],
  providers: [
    SignupService,ClientesService]
})
export class AdminModule { }

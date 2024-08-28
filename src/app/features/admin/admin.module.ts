import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdmDashboardView } from './view/adm-dashboard/adm-dashboard.view';
import { AdmHomeView } from './view/adm-home/adm-home.view';
import { NotificacionesView } from './view/notificaciones/notificaciones.view';
import { ProductFormComponent } from './commons/components/product-form/product-form.component';
import { VentasComponent } from './commons/components/ventas/ventas.component';
import { PedidosComponent } from './commons/components/pedidos/pedidos.component';
import { MaterialModule } from './commons/material/material.module';
import { AdminComponent } from './admin.component';
import { InicioView } from './view/inicio/inicio.view';
import { TablaUsuarioComponent } from './commons/components/tabla-usuario/tabla-usuario.component';
import { UsuarioView } from './view/usuario/usuario.view';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ControlEntregasView } from './view/control-entregas/control-entregas.view';
import { MapaClientsView } from './view/mapa-clients/mapa-clients.view';
import { ClienteFormComponent } from './commons/components/cliente-form/cliente-form.component';
import { ClienteTablaComponent } from './commons/components/cliente-tabla/cliente-tabla.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogModule } from 'primeng/dialog';
import { MapaView } from './view/mapa/mapa.view';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SignupService } from '../../shared/services/signup.service';
import { TableModule } from 'primeng/table';

const MATERIALS = [TableModule,
  AvatarModule, AvatarGroupModule, DialogModule, ModalModule
]
@NgModule({ declarations: [
        AdmDashboardView,
        AdmHomeView,
        NotificacionesView,
        ProductFormComponent,
        VentasComponent,
        PedidosComponent,
        AdminComponent,
        InicioView,
        TablaUsuarioComponent,
        UsuarioView,
        ControlEntregasView,
        MapaClientsView,
        ClienteFormComponent,
        ClienteTablaComponent,
        MapaView,
    ], imports: [MATERIALS,
        CommonModule, FormsModule,
        AdminRoutingModule, MaterialModule, ReactiveFormsModule], providers: [
        SignupService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AdminModule { }

import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { InputIconModule } from 'primeng/inputicon';
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
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MaterialModule } from '../admin/commons/material/material.module';
import { ClientesService } from '../../shared/services/clientes.service';
import { SignupService } from '../../shared/services/signup.service';
import { PedidosView } from './view/pedidos/pedidos.view';
import { NotificacionesView } from './view/notificaciones/notificaciones.view';
import { ControlEntregasView } from './view/control-entregas/control-entregas.view';
import { ComentariosView } from './view/comentarios/comentarios.view';
import { MapaClientsView } from './view/mapa-clients/mapa-clients.view';
import { ClienteFormComponent } from './commons/components/cliente-form/cliente-form.component';
// import { VentasComponent } from './commons/components/ventas/ventas.component';
import { PedidosComponent } from './commons/components/pedidos/pedidos.component';
import { AdmPurificadoraComponent } from './adm-purificadora.component';
import { Grafica1Component } from './commons/components/grafica1/grafica1.component';
import { RepartidoresFormComponent } from './commons/components/repartidores-form/repartidores-form.component';
import { RepartidoresListadoComponent } from './commons/components/repartidores-listado/repartidores-listado.component';
import { RepartidoresView } from './view/repartidores/repartidores.view';
import { MapaClientUbicacionView } from './view/mapa-client-ubicacion/mapa.view';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RepartidoresService } from '../../shared/services/rapartidores.service';
import { RutaFormComponent } from './commons/components/ruta-form/ruta-form.component';
import { RutaListadoComponent } from './commons/components/ruta-listado/ruta-listado.component';
// import { RutaListadoComponent } from './commons/components/ruta-listado/ruta-listado.component';
import { RutaView } from './view/ruta/ruta.view';
import { VehiculosView } from './view/vehiculos/vehiculos.view';
import { VehiculoFormComponent } from './commons/components/vehiculo-form/vehiculo-form.component';
import { VehiculoListadoComponent } from './commons/components/vehiculo-listado/vehiculo-listado.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from 'primeng/checkbox';
import { ConsultasCOPOMEXService } from '../../shared/services/consultas-copomex.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { RutaDetalleComponent } from './commons/components/ruta-detalle/ruta-detalle.component';
import { StepperModule } from 'primeng/stepper';
import { SalidaView } from './view/salida/salida.view';
import { EntradaView } from './view/entrada/entrada.view';
import { PanelMenuModule } from 'primeng/panelmenu';
import { QRCodeModule } from 'angularx-qrcode';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { CalendarModule } from 'primeng/calendar';
import { SalidaListaComponent } from './commons/components/salida-lista/salida-lista.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { EntradaListaComponent } from './commons/components/entrada-lista/entrada-lista.component';
import { EntradaEditComponent } from './commons/components/entrada-edit/entrada-edit.component';
import { ResultadosListadoComponent } from './commons/components/resultados-listado/resultados-listado.component';
import { ResultadoEntregaView } from './view/resultado-entrega/resultado-entrega.view';
import { MiPerfilView } from './view/mi-perfil/mi-perfil.view';
import { MessageService } from 'primeng/api';
import { Toast } from '../../shared/services/toast.service';
import { FilterPipe } from '../../shared/pipes/filter.pipe';

import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ClienteRutaComponent } from './commons/components/cliente-ruta/cliente-ruta.component';
import { AsignarClientesRutaComponent } from './commons/components/asignar-clientes-ruta/asignar-clientes-ruta.component';
const MATERIALS = [CalendarModule, InputNumberModule, ToastModule,TabViewModule,
  AvatarModule, PaginatorModule,AvatarGroupModule, DialogModule, ModalModule,TableModule,IconFieldModule,InputIconModule
]



const PIPES=[FilterPipe]
@NgModule({
  declarations: [PIPES,
    AdmPurificadoraComponent,RepartidoresFormComponent,RepartidoresListadoComponent,
    AdmHomeView, PedidosView, NotificacionesView, MapaClientsView, ControlEntregasView, ComentariosView,
    AdmDashboardView, InicioView, PedidosComponent, RutaDetalleComponent,
    MapaView, MapaClientUbicacionView,ClienteTablaComponent,ClienteFormComponent, Grafica1Component, RepartidoresFormComponent, RepartidoresView, RutaFormComponent, RutaListadoComponent, RutaView, VehiculosView, VehiculoFormComponent, VehiculoListadoComponent,   SalidaView, EntradaView, SalidaListaComponent, EntradaListaComponent, EntradaEditComponent, ResultadosListadoComponent, ResultadoEntregaView, MiPerfilView, ClienteRutaComponent, AsignarClientesRutaComponent,
  ],
  imports: [MessagesModule,MATERIALS, QRCodeModule,HttpClientModule, CheckboxModule, TriStateCheckboxModule, StepperModule,
    CommonModule, FormsModule, DropdownModule, MultiSelectModule, ToggleButtonModule,
    AdmPurificadoraRoutingModule, MaterialModule, ReactiveFormsModule, PanelMenuModule,
  ],
  providers: [Toast,MessageService,provideClientHydration(), [provideHttpClient(withFetch())],
    SignupService, ClientesService, RepartidoresService, ConsultasCOPOMEXService]
})
export class AdmPurificadoraModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RepartidorRoutingModule } from './repartidor-routing.module';
import { RepartidorComponent } from './repartidor.component';
import { InicioView } from './view/inicio/inicio.view';
import { SignupService } from '../../shared/services/signup.service';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RepartidorHomeView } from './view/repartidor-home/repartidor-home.view';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { SidebarModule } from 'primeng/sidebar';
import { ClientesView } from './view/clientes/clientes.view';
import { RutaView } from './view/ruta/ruta.view';
import { PerfilView } from './view/perfil/perfil.view';
import { EntregasView } from './view/entregas/entregas.view';
import { OpcionesView } from './view/opciones/opciones.view';
import { CodigoqrView } from './view/codigoqr/codigoqr.view';
import { ScannerIneModule } from 'ngx-scanner';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

// import { ZXingScannerModule, ZXingScannerComponent } from '@zxing/ngx-scanner';
// import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanLOAD_WASMner-qrcode';
import { QRCodeModule } from 'angularx-qrcode';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { NotificacionesView } from './view/notificaciones/notificaciones.view';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Card, CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { Toast } from '../../shared/services/toast.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

const primeNg = [ReactiveFormsModule,MessagesModule,ToastModule,FormsModule,SidebarModule,DialogModule,DropdownModule,CardModule,InputNumberModule,ButtonModule,ZXingScannerModule]
const ngxScanner = [NgQrScannerModule]
@NgModule({
  declarations: [RepartidorComponent, InicioView,RepartidorHomeView, ClientesView, RutaView, PerfilView, EntregasView, OpcionesView, CodigoqrView, NotificacionesView],
  imports: [primeNg,
    CommonModule, QRCodeModule,
    RepartidorRoutingModule,
  ], providers: [Toast,MessageService,provideClientHydration(), [provideHttpClient(withFetch())],
    SignupService]
})

export class RepartidorModule { }


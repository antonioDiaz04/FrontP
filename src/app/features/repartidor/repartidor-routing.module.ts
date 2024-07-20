import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepartidorComponent } from './repartidor.component';
import { InicioView } from './view/inicio/inicio.view';
import { RepartidorHomeView } from './view/repartidor-home/repartidor-home.view';
import { ClientesView } from './view/clientes/clientes.view';
import { RutaView } from './view/ruta/ruta.view';
import { PerfilView } from './view/perfil/perfil.view';
import { EntregasView } from './view/entregas/entregas.view';
import { OpcionesView } from './view/opciones/opciones.view';
import { CodigoqrView } from './view/codigoqr/codigoqr.view';
import { NotificacionesView } from './view/notificaciones/notificaciones.view';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'entregas',
    pathMatch: 'full',
  },
  {
    path: '',
    component: RepartidorComponent,
    children: [
      {
        path: 'Home',
        component: InicioView,
      },
      {
        path: 'notificaciones',
        component: NotificacionesView,
      },
      {
        path: 'repartidor-home',
        component: RepartidorHomeView,
      },
      {
        path: 'ruta-entrega',
        component: RutaView,
      },
      {
        path: 'clientes',
        component: ClientesView,
      },
      {
        path: 'perfil',
        component: PerfilView,
      },
      {
        path: 'entregas',
        component: EntregasView,
      },
      {
        path: 'Opciones',
        component:  OpcionesView,
      },
      {
        path: 'qr',
        component:  CodigoqrView,
      }
    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepartidorRoutingModule { }

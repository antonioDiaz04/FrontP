import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteFormComponent } from './commons/components/cliente-form/cliente-form.component';
import { MapaClientsView } from './view/mapa-clients/mapa-clients.view';
import { PedidosView } from './view/pedidos/pedidos.view';
import { ComentariosView } from './view/comentarios/comentarios.view';
import { ControlEntregasView } from './view/control-entregas/control-entregas.view';
// import { AdmHomeView } from './view/adm-home/adm-home.view';
import { InicioView } from './view/inicio/inicio.view';
// import { AdminComponent } from '../admin/admin.component';
import { AdmPurificadoraComponent } from './adm-purificadora.component';
import { AdmHomeView } from './view/adm-home/adm-home.view';
import { RepartidoresFormComponent } from './commons/components/repartidores-form/repartidores-form.component';
import { RepartidoresListadoComponent } from './commons/components/repartidores-listado/repartidores-listado.component';
import { RepartidoresView } from './view/repartidores/repartidores.view';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdmPurificadoraComponent,
    children: [
      {
        path: 'Home',
        component: InicioView,
      },
      {
        path: 'admin-home',
        component: AdmHomeView,
      },
      {
        path: 'Control-entregas',
        component: ControlEntregasView,
      },
      {
        path: 'agregar-cliente',
        component: ClienteFormComponent,
      },
      
      {
        // path: 'detail/:id',
        path: 'comentarios',
        component: ComentariosView,
      },
      {
        // path: 'detail/:id',
        path: 'pedidos',
        component: PedidosView,
      },
      {
        // path: 'detail/:id',
        path: 'mapa-entregas',
        component: MapaClientsView,
      },
      {
        path: 'repartidores',
        component: RepartidoresView,
        children: [
          {
            path: 'agregar-repartidor',
            component: RepartidoresFormComponent,
          },
          {
            path: 'lista-repartidores',
            component: RepartidoresListadoComponent,
          },
          {
            path: '', // Ruta por defecto dentro de repartidores (opcional)
            redirectTo: 'lista-repartidores', // Redirigir a lista-repartidores por defecto
            pathMatch: 'full',
          }
        ]
      },
      
      // {
      //   title:"404",
      //   path: 'not-found',
      //   component: NotFondViews,
      // },
      // {
      //   title:"500",
      //   path: 'unknown',
      //   component: UnknownView ,
      // },
      // {
      //   title:"404",
      //   path: '**',
      //   component: NotFondViews,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmPurificadoraRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteFormComponent } from './commons/components/cliente-form/cliente-form.component';
import { MapaClientsView } from './view/mapa-clients/mapa-clients.view';
import { PedidosView } from './view/pedidos/pedidos.view';
import { ComentariosView } from './view/comentarios/comentarios.view';
import { ControlEntregasView } from './view/control-entregas/control-entregas.view';
import { InicioView } from './view/inicio/inicio.view';
import { AdmPurificadoraComponent } from './adm-purificadora.component';
import { AdmHomeView } from './view/adm-home/adm-home.view';
import { RepartidoresFormComponent } from './commons/components/repartidores-form/repartidores-form.component';
import { RepartidoresListadoComponent } from './commons/components/repartidores-listado/repartidores-listado.component';
import { RepartidoresView } from './view/repartidores/repartidores.view';
import { RutaView } from './view/ruta/ruta.view';
import { RutaFormComponent } from './commons/components/ruta-form/ruta-form.component';
import { RutaListadoComponent } from './commons/components/ruta-listado/ruta-listado.component';
import { VehiculosView } from './view/vehiculos/vehiculos.view';
import { VehiculoFormComponent } from './commons/components/vehiculo-form/vehiculo-form.component';
import { VehiculoListadoComponent } from './commons/components/vehiculo-listado/vehiculo-listado.component';
import { ClienteTablaComponent } from './commons/components/cliente-tabla/cliente-tabla.component';
import { RutaDetalleComponent } from './commons/components/ruta-detalle/ruta-detalle.component';
import { SalidaView } from './view/salida/salida.view';
import { EntradaView } from './view/entrada/entrada.view';
import { SalidaListaComponent } from './commons/components/salida-lista/salida-lista.component';
import { SalidaEditComponent } from './commons/components/salida-edit/salida-edit.component';
import { EntradaEditComponent } from './commons/components/entrada-edit/entrada-edit.component';
import { EntradaListaComponent } from './commons/components/entrada-lista/entrada-lista.component';
import { NotificacionesView } from './view/notificaciones/notificaciones.view';
import { ResultadoEntregaView } from './view/resultado-entrega/resultado-entrega.view';
import { ResultadosListadoComponent } from './commons/components/resultados-listado/resultados-listado.component';

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
        path: 'clientes',
        component: ControlEntregasView,
        children: [

          {
            path: 'lista-clientes',
            component: ClienteTablaComponent,
          },
          {
            path: 'agregar-cliente',
            component: ClienteFormComponent,
          },
          {
            path: '',
            redirectTo: 'lista-clientes',
            pathMatch: 'full',
          }
        ]
      },
      {
        path: 'salida',
        component: SalidaView,
        children: [
          {
            path: 'edit-salida/:id',
            component: SalidaEditComponent,
          },
          {
            path: 'salida-listado',
            component: SalidaListaComponent,
          },
          {
            path: '', // Ruta por defecto dentro de repartidores (opcional)
            redirectTo: 'salida-listado', // Redirigir a lista-repartidores por defecto
            pathMatch: 'full',
          }
        ]
      },

      {
        path: 'resultado',
        component: ResultadoEntregaView,
        children: [
          {
            path: 'resultadoListadoEntrega',
            component: ResultadosListadoComponent,
          },
          {
            path: '',
            redirectTo: 'resultadoListadoEntrega',
            pathMatch: 'full',
          }
        ]
      },
      {
        path: 'entrada',
        component: EntradaView,
        children: [
          {
            path: 'edit-entrada/:id',
            component: EntradaEditComponent,
          },
          {
            path: 'entrada-listado',
            component: EntradaListaComponent,
          },
          {
            path: '', // Ruta por defecto dentro de repartidores (opcional)
            redirectTo: 'entrada-listado', // Redirigir a lista-repartidores por defecto
            pathMatch: 'full',
          }
        ]
      },
      {
        // path: 'detail/:id',
        path: 'notificaciones',
        component: NotificacionesView,
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
      {
        path: 'vehiculo',
        component: VehiculosView,
        children: [
          {
            path: 'agregar-vehiculo',
            component: VehiculoFormComponent,
          },
          {
            path: 'lista-vehiculo',
            component: VehiculoListadoComponent,
          },
          {
            path: '', // Ruta por defecto dentro de repartidores (opcional)
            redirectTo: 'lista-vehiculo', // Redirigir a lista-repartidores por defecto
            pathMatch: 'full',
          }
        ]
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
      {
        path: 'rutas',
        component: RutaView,
        children: [
          {
            path: 'agregar-ruta',
            component: RutaFormComponent,
          },
          {
            path: 'lista-rutas',
            component: RutaListadoComponent,
          },
          {
            path: 'detalleByIdRutaFrom/:id',
            component: RutaDetalleComponent,
          },
          {
            path: '', // Ruta por defecto dentro de rutas (opcional)
            redirectTo: 'lista-rutas', // Redirigir a lista-repartidores por defecto
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

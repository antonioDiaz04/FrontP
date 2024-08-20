import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmHomeView } from './view/adm-home/adm-home.view';
import { AdminComponent } from './admin.component';
import { InicioView } from './view/inicio/inicio.view';
import { UsuarioView } from './view/usuario/usuario.view';
import { ComentariosView } from './view/comentarios/comentarios.view';
import { ControlEntregasView } from './view/control-entregas/control-entregas.view';
import { MapaClientsView } from './view/mapa-clients/mapa-clients.view';
import { ClienteFormComponent } from './commons/components/cliente-form/cliente-form.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'inicio',
        component: InicioView,
      },
      {
        path: 'admin-home',
        component: AdmHomeView,
      },
      {
        // path: 'detail/:id',
        path: 'Control-purificadoras',
        component: ControlEntregasView,
      },
      {
        // path: 'detail/:id',
        path: 'usuarios',
        component: UsuarioView,
      },
      {
        // path: 'detail/:id',
        path: 'comentarios',
        component: ComentariosView,
      },
     
      {
        // path: 'detail/:id',
        path: 'mapa-entregas',
        component: MapaClientsView,
      },
      {
        // path: 'detail/:id',
        path: 'agregar-cliente',
        component: ClienteFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {



 }

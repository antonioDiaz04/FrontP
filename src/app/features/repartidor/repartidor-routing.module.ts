import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepartidorComponent } from './repartidor.component';
import { InicioView } from './view/inicio/inicio.view';
import { RepartidorHomeView } from './view/repartidor-home/repartidor-home.view';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'Home',
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
        path: 'repartidor-home',
        component: RepartidorHomeView,
      },
    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepartidorRoutingModule { }

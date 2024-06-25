import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepartidorComponent } from './repartidor.component';
import { InicioView } from './commons/view/inicio/inicio.view';

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
      }
    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepartidorRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { HomeView } from './view/home/home.view';
import { RegitroPurificadoraView } from './view/regitro-purificadora/regitro-purificadora.view';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: 'home',
        component: HomeView,
      },
      {
        path: 'Registrar-purificadora',
        component: RegitroPurificadoraView,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

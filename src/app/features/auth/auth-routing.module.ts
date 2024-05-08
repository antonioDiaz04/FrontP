import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { IniciarSesionView } from './view/iniciar-sesion/iniciar-sesion.view';

const routes: Routes = [


  {
    path: '',
    component: AuthComponent,
    children: [
      // {
      //   path: 'sign-up',
      //   component: SignUpView,
      // },
      {
        // path: 'detail/:id',
        path: 'login',
        component: IniciarSesionView,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

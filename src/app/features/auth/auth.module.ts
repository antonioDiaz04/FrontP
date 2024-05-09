import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { IniciarSesionView } from './view/iniciar-sesion/iniciar-sesion.view';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AuthComponent,
    IniciarSesionView
  ],
  imports: [
    ReactiveFormsModule,FormsModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }

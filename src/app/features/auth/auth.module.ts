import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { IniciarSesionView } from './view/iniciar-sesion/iniciar-sesion.view';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SignInService } from './commons/services/sign-in.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  providers: [
    SignInService
  ],
  declarations: [
    AuthComponent,
    IniciarSesionView
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,FormsModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }

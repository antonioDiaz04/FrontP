import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { IniciarSesionView } from './view/iniciar-sesion/iniciar-sesion.view';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SignInService } from './commons/services/sign-in.service';
import { HttpClientModule } from '@angular/common/http';
import { SignUpComponent } from './commons/components/sign-up/sign-up.component';
@NgModule({
  providers: [
    SignInService
  ],
  declarations: [
    AuthComponent,
    IniciarSesionView,
    SignUpComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,FormsModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }

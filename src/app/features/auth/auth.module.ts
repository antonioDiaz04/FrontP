import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { IniciarSesionView } from './view/iniciar-sesion/iniciar-sesion.view';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SignInService } from './commons/services/sign-in.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SignUpComponent } from './commons/components/sign-up/sign-up.component';
import { NgxLoadingModule } from "ngx-loading";
@NgModule({ declarations: [
        AuthComponent,
        IniciarSesionView,
        SignUpComponent
    ], imports: [ReactiveFormsModule, FormsModule,
        CommonModule,
        AuthRoutingModule, NgxLoadingModule.forRoot({})], providers: [
        SignInService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AuthModule { }

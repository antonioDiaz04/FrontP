import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { ComponentsComponent } from './commons/components/components.component';
import { HomeView } from './view/home/home.view';
import { HttpClientModule } from '@angular/common/http';
import { RegitroPurificadoraView } from './view/regitro-purificadora/regitro-purificadora.view';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../../shared/services/clientes.service';
import { SignupService } from '../../shared/services/signup.service';
// DialogModule, ButtonModule

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
const VIEW_COMPONENTS = [
    RegitroPurificadoraView,
HomeView
];

@NgModule({
  declarations: [VIEW_COMPONENTS,
    ComponentsComponent,
  ],
  imports: [
    CommonModule, HttpClientModule, DialogModule, ButtonModule,
    PublicRoutingModule, FormsModule, ReactiveFormsModule
  ],
  providers: [
    SignupService, ClientesService]
})
export class PublicModule { }

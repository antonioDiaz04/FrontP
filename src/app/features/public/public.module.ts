import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { ComponentsComponent } from './commons/components/components.component';
import { HomeView } from './view/home/home.view';
import { HttpClientModule } from '@angular/common/http';



const VIEW_COMPONENTS = [
HomeView
];

@NgModule({
  declarations: [VIEW_COMPONENTS,
    ComponentsComponent
  ],
  imports: [
    CommonModule, HttpClientModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }

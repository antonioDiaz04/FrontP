import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { ComponentsComponent } from './commons/components/components.component';
import { HomeView } from './view/home/home.view';



const VIEW_COMPONENTS = [
HomeView
];

@NgModule({
  declarations: [VIEW_COMPONENTS,
    ComponentsComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }

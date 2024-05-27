import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoRoutingModule } from './empleado-routing.module';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmpleadoRoutingModule, ChartModule 
  ]
})
export class EmpleadoModule { }

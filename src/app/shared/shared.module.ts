import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterNamePipe } from './pipes/filter-name.pipe';
// import { UsuarioModel } from './models/usuario.model';



@NgModule({
  declarations: [
    // UsuarioModel
  
    FilterNamePipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }

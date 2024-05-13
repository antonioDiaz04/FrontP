import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialModule } from './material/material.ModalModule';
import { CoreComponentsModule } from './components.module';

@NgModule({
  exports: [

    CoreComponentsModule
    // ...COMPONENTS
  ],
})
export class CoreCommonsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { HeaderComponent } from './header/header.component';
// import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../material/material.module';
// const COMPONENTS = [ ]; // Agrega los componentes
// const COMPONENTS = [HeaderComponent, FooterComponent]; // Agrega los componentes

@NgModule({
  declarations: [],
  exports: [BrowserAnimationsModule, ],
  imports: [CommonModule, BrowserAnimationsModule,MaterialModule],
  providers: [],
})
export class CoreComponentsModule {}

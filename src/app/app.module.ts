import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './core/commons/components/footer/footer.component';
import { HeaderComponent } from './core/commons/components/header/header.component';
import { SigninComponent } from './features/auth/commons/components/signin/signin.component';
import { PublicComponent } from './features/public/public.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SigninComponent,
    PublicComponent,
  ],
  imports: [
    
    SidebarModule,
    BrowserModule, ButtonModule, BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [[provideHttpClient(withFetch())],
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

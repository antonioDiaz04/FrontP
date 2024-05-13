import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.view.html',
  styleUrl: './home.view.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeView {
  

  constructor(private router:Router) {}

  redirectTo(route: string): void {

    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      this.router.navigate(['/public', route]) // Navegación hacia otras páginas públicas
    }
  }
}

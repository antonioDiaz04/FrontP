import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-repartidor-home',
  templateUrl: './repartidor-home.view.html',
  styleUrl: './repartidor-home.view.css'
})
export class RepartidorHomeView {

  constructor(private router: Router) { }

  redirectToAdminPurificadora(route: string): void {
    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/repartidor', route]) // Navegación hacia otras páginas públicas
    }
  }
  
  sidebarVisible: boolean= false;
  
}

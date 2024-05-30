import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.view.html',
  styleUrl: './ruta.view.css'
})
export class RutaView {
  constructor(private router: Router) { }

  redirectToAdminPurificadora(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/rutas', route]) // Navegación hacia otras páginas públicas
    }
  }
}

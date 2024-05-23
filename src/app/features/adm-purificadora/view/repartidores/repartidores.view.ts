import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repartidores',
  templateUrl: './repartidores.view.html',
  styleUrl: './repartidores.view.css',
  encapsulation: ViewEncapsulation.None
})
export class RepartidoresView {

  

  constructor(private router: Router) { }

  redirectToAdminPurificadora(route: string): void {

    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm', route]) // Navegación hacia otras páginas públicas
    }
  }

}

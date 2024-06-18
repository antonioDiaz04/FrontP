import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.view.html',
  styleUrl: './vehiculos.view.scss'
})
export class VehiculosView {

  

  constructor(private router:Router) {
  
}

  redirectToVehiculos(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/vehiculo', route]) // Navegación hacia otras páginas públicas
    }
  }
}

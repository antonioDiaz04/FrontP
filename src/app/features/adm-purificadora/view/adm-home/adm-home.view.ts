import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.view.html',
  styleUrls: ['./adm-home.view.scss', './menuLateral.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmHomeView {
  openSubmenu: string | null = null;

  toggleSubmenu(submenuId: string) {
    this.openSubmenu = this.openSubmenu === submenuId ? null : submenuId;
  }

  constructor(private router: Router) { }



  redirectToAdminPurificadora(route: string): void {

    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm', route]) // Navegación hacia otras páginas públicas
    }
  }





  redirectToCotrolClientes(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/clientes', route]) // Navegación hacia otras páginas públicas
    }
  }
  redirectToCotrolRepartidores(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/repartidores', route]) // Navegación hacia otras páginas públicas
    }
  }
  redirectToCotrolRutas(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/rutas', route]) // Navegación hacia otras páginas públicas
    }
  }

  redirectToCotrolVehiculo(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/vehiculo', route]) // Navegación hacia otras páginas públicas
    }
  }


}

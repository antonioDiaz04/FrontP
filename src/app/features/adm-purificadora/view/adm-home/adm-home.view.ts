import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.view.html',
  styleUrls: ['./adm-home.view.scss', './menuLateral.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmHomeView implements OnInit {
  openSubmenu: string | null = null;

  toggleSubmenu(submenuId: string) {
    this.openSubmenu = this.openSubmenu === submenuId ? null : submenuId;
  }


  fecha: string;
  fechaTexto: string;
  fechaSeleccionada: Date;
  mostrarCalendario: boolean = false;

 
  constructor(private router: Router) { 
    this.fechaSeleccionada = new Date(); // Puedes inicializar con la fecha actual o la que necesites
    this.fecha = this.obtenerFechaYYYYMMDD()
    this.fechaTexto = this.obtenerFechaTexto()
  }


   toggleCalendar() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }


  ngOnInit() {
  console.log(this.obtenerFechaYYYYMMDD()); // Output: "Viernes / Junio / 2024" (para la fecha actual)
  }




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
 obtenerFechaYYYYMMDD() {
  let fecha = new Date();
  let año = fecha.getFullYear();
  let mes = String(fecha.getMonth() + 1).padStart(2, '0');
  let dia = String(fecha.getDate()).padStart(2, '0');

  return `${dia}-${mes}-${año}`;
}

// Ejemplo de uso



  obtenerFechaTexto() {
    let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    let fecha = new Date();
    let diaSemana = diasSemana[fecha.getDay()];
    let mes = meses[fecha.getMonth()];
    let año = fecha.getFullYear();

    return `${diaSemana} / ${mes} / ${año}`;
  }




}

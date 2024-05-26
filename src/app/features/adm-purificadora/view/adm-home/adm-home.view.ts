import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.view.html',
  styleUrl: './adm-home.view.css',
  encapsulation: ViewEncapsulation.None
})
export class AdmHomeView {



  // basicData: any;

  // basicOptions: any;

  constructor(private router: Router){}

  

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


}

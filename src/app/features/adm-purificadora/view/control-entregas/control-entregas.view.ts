import { Component, ViewEncapsulation, OnInit } from '@angular/core';
// import { UsuariosclientesService } from '../../../../shared/services/usuariosclientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-entregas',
  templateUrl: './control-entregas.view.html',
  // styleUrl: '../../adm-purificadora.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ControlEntregasView {
  constructor(private router: Router) { }

  redirectToCotrolClientes(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/clientes', route]) // Navegación hacia otras páginas públicas
    }
  }

}

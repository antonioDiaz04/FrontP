import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RepartidoresService } from '../../../../shared/services/rapartidores.service';
import { SessionService } from '../../../../core/commons/components/service/session.service';
import { Salida } from '../../../../shared/models/salida.model';
@Component({
  selector: 'app-repartidor-home',
  templateUrl: './repartidor-home.view.html',
  styleUrl: './repartidor-home.view.css'
})
export class RepartidorHomeView {

  constructor(private router: Router, private ngxService: NgxUiLoaderService,
    private sessionService: SessionService,
    private repService: RepartidoresService,) { }

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
  id!: string;

  tienesSalidaProgramada!: boolean;
  estado!: string;
  sidebarVisible: boolean= false;
  @Input() data!: Salida[] | any; // data es un array de Salida

   getData(): void {
    this.ngxService.start();

    const userData = this.sessionService.getId();

    if (userData) {
      this.id = userData;
      if (this.id) {
        this.repService.detalleUsuarioSalidaById(this.id).subscribe(
          (data) => {
            this.data = data;
            // this.idSalida = data[0]._id;
            this.estado=data[0].estado
            if (this.data == null || this.estado=='finalizada') {
              this.tienesSalidaProgramada = false;
            } else {
              this.tienesSalidaProgramada = true;
            }
          }
          
          
        );
        console.log(this.estado)
      }
    }
  }
}

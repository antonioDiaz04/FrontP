import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutaService } from '../../../../shared/services/ruta.service';
import { DetalleEntregaInterface } from '../../../../shared/interfaces/detalle-entrega-schema.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Repartidor } from '../../../../shared/interfaces/repartidor.interface';
import { RepartidoresService } from '../../../../shared/services/rapartidores.service';

@Component({
  selector: 'app-salida',
  templateUrl: './salida.view.html',
  // styleUrls: ['../../adm-purificadora.component.css', '../../form.scss']

})
export class SalidaView implements OnInit {
  
  
  ngOnInit(): void {
  }

  constructor(private router: Router) {
  }

  
  redirectToSalida(route:string) {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/salida', route]) // Navegación hacia otras páginas públicas
    }



  }
  
}

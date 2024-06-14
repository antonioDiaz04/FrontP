import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutaService } from '../../../../../shared/services/ruta.service';
// import { Ruta } from '../../../../../shared/models/ruta.model';
import { Repartidor } from '../../../../../shared/models/repartidor.model';
import { DetalleEntregaInterface } from '../../../../../shared/interfaces/detalle-entrega-schema.interface';
// import { Ruta } from '../../../../../shared/interfaces/ruta.interface';
// import { Repartidor } from '../../interfaces/repartidores/repartidores.interface';

@Component({
  selector: 'app-ruta-listado',
  templateUrl: './ruta-listado.component.html',
  styleUrl: './ruta-listado.component.css'
})
export class RutaListadoComponent  implements OnInit{
  allRutas?: DetalleEntregaInterface[]=[];
 
 
 
  constructor(private rutaS: RutaService, private router: Router) {
  }


ngOnInit(): void {
  this.obtenerRutas();   
}

  obtenerRutas() {
    this.rutaS.getDetallesEntregasRutas().subscribe(
      data => {
        this.allRutas = data;
        // this.allRepartidorData = data.repartidorId;
        console.log(this.allRutas);
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  eliminarRuta(id: any) {
    this.rutaS.eliminarRuta(id).subscribe(data => {
      console.log("eliminado")
      this.obtenerRutas();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  detalleById(id: any) {
    this.rutaS.detalleRutaById(id).subscribe(data => {
      console.log("detallado...")
      this.router.navigate(['/purificadoraAdm/rutas/detalleByIdRutaFrom/' ,id]) // Navegación hacia otras páginas públicas
    }, error => {
      console.log("ocurrio un error", error)
    })
  }
  
}

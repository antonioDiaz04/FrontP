import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { Ruta } from '../../../../../shared/models/ruta.model';

@Component({
  selector: 'app-ruta-listado',
  templateUrl: './ruta-listado.component.html',
  styleUrl: './ruta-listado.component.css'
})
export class RutaListadoComponent  implements OnInit{
  // getRutas


  allRutas?: Ruta[];


  constructor(private rutaS:RutaService) {
    
  }
ngOnInit(): void {
  this.obtenerRutas();   
}

  obtenerRutas() {
    this.rutaS.getRutas().subscribe(
      data => {
        this.allRutas = data;
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
  
}

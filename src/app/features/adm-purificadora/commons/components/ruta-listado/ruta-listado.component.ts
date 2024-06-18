import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { DetalleEntregaInterface } from '../../../../../shared/interfaces/detalle-entrega-schema.interface';

@Component({
  selector: 'app-ruta-listado',
  templateUrl: './ruta-listado.component.html',
  styleUrl: '../../../adm-purificadora.component.scss',
})
export class RutaListadoComponent implements OnInit {
  allRutas: DetalleEntregaInterface[] = [];


  paginatedRutasDetalles: DetalleEntregaInterface[] = []
  clientAll!: DetalleEntregaInterface;
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

  constructor(private rutaS: RutaService, private router: Router) {
  }


  ngOnInit(): void {
    this.obtenerRutas();
    this.updatePaginatedRutasDetalles();
  }

  obtenerRutas() {
    this.rutaS.getDetallesEntregasRutas().subscribe(
      data => {
        this.allRutas = data;
        this.clientAll = data;
        this.totalRecords = this.allRutas.length;
        this.updatePaginatedRutasDetalles()
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
      this.router.navigate(['/purificadoraAdm/rutas/detalleByIdRutaFrom/', id]) // Navegación hacia otras páginas públicas
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedRutasDetalles();
  }

  updatePaginatedRutasDetalles() {
    this.paginatedRutasDetalles = this.allRutas.slice(
      this.first,
      this.first + this.rows
    );
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleEntregaInterface } from '../../../../../shared/interfaces/detalle-entrega-schema.interface';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entrada-lista',
  templateUrl: './entrada-lista.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss', '../../../form.scss']
})
export class EntradaListaComponent implements  OnInit{




  allRutas: DetalleEntregaInterface[] = [];
  date2: Date | undefined;

  paginatedRutasDetalles: DetalleEntregaInterface[] = []
  clientAll!: DetalleEntregaInterface;
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;

  ngOnInit(): void {
    this.obtenerRutas();
  }

  constructor(private rutaS: RutaService, private router: Router, private fb: FormBuilder) {
  }

  obtenerRutas() {
    this.rutaS.getRutasSalidas().subscribe(
      data => {
        // Filtrar los datos para solo incluir los que tienen fechaProgramada
        const rutasConFechaProgramada = data.filter((ruta:any) => ruta.fechaInicio);

        this.allRutas = rutasConFechaProgramada;
        this.clientAll = rutasConFechaProgramada;
        this.totalRecords = this.allRutas.length;
        this.updatePaginatedRutasDetalles();
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }



  updatePaginatedRutasDetalles() {
    this.paginatedRutasDetalles = this.allRutas.slice(
      this.first,
      this.first + this.rows
    );
  }



  eliminarRuta(id: any) {
    this.rutaS.eliminarRuta(id).subscribe(data => {
      this.obtenerRutas();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  editar(id: any) {
    this.router.navigate(['/purificadoraAdm/salida/edit-salida/', id]) // Navegación hacia otras páginas públicas
  }


}

import { Component } from '@angular/core';
import { DetalleEntregaInterface } from '../../../../../shared/interfaces/detalle-entrega-schema.interface';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SessionService } from '../../../../../core/commons/components/service/session.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-resultados-listado',
  templateUrl: './resultados-listado.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss']

})
export class ResultadosListadoComponent {



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

  constructor( private ngxUiLoaderService: NgxUiLoaderService,
    private sessionService: SessionService,private rutaS: RutaService, private router: Router, private fb: FormBuilder) {
  }

  obtenerRutas() {
    
    this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
    const idPurificadora = userData;
    this.rutaS.getRutasSalidasByIdPurificadora(idPurificadora).subscribe(
      data => {
        // Filtrar los datos para solo incluir los que tienen fechaProgramada
        const rutasConFechaProgramada = data.filter((ruta: any) => ruta.fechaInicio);

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

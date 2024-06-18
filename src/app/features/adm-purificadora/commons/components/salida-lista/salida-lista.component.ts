import { Component } from '@angular/core';
import { DetalleEntregaInterface } from '../../../../../shared/interfaces/detalle-entrega-schema.interface';
import { Repartidor } from '../../../../../shared/interfaces/repartidor.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salida-lista',
  templateUrl: './salida-lista.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss', '../../../form.scss']

})
export class SalidaListaComponent {

  visible: boolean = false

  allRutas: DetalleEntregaInterface[] = [];
  date2: Date | undefined;
  frmEditarEntrega: FormGroup

  paginatedRutasDetalles: DetalleEntregaInterface[] = []
  clientAll!: DetalleEntregaInterface;
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual
  allRepartidores: Repartidor[] = [];

  ngOnInit(): void {
    this.obtenerRutas();
  }

  constructor(private repService: RepartidoresService, private rutaS: RutaService, private router: Router, private fb: FormBuilder) {
    this.frmEditarEntrega = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      numCasa: ['', Validators.required],
      selectedRepartidor: ['', Validators.required],
      telefono: ['', Validators.required],
    })
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

  getRepartidores() {
    this.repService.getRepartidores().subscribe(
      (data: Repartidor[]) => {
        this.allRepartidores = data;
        console.log(this.allRepartidores);
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }
  updatePaginatedRutasDetalles() {
    this.paginatedRutasDetalles = this.allRutas.slice(
      this.first,
      this.first + this.rows
    );
  }

  onRepartidorSelectionChange() {
    const selectedId = this.frmEditarEntrega.get('selectedRepartidor')?.value;
    console.log('ID del repartidor seleccionado:', selectedId);
  }

  eliminarRuta(id: any) {
    this.rutaS.eliminarRuta(id).subscribe(data => {
      this.obtenerRutas();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  editar(id: any) {
    // this.rutaS.detalleRutaById(id).subscribe(data => {
      this.router.navigate(['/purificadoraAdm/salida/edit-salida/', id]) // Navegación hacia otras páginas públicas
    // }, error => {
      // console.log("ocurrio un error", error)
    // })
  }
  // editar() {
  //   this.visible = true
  // }




}

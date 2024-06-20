import { RutaService } from './../../../../../shared/services/ruta.service';
import { Location } from '@angular/common';
import { Component, Renderer2, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Repartidor } from '../../../../../shared/models/repartidor.model';
import { Ruta } from '../../../../../shared/interfaces/ruta.interface';
import { Vehiculo } from '../../../../../shared/models/vehiculo.model';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import { DetalleEntregaInterface } from './../../../../../shared/interfaces/detalle-entrega-schema.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  host: { ngSkipHydration: 'true' },
  selector: 'app-salida-edit',
  templateUrl: './salida-edit.component.html',
  styleUrls: ['./salida-edit.component.scss', './checkbox.scss']
})
export class SalidaEditComponent implements OnInit {
  listDetalle?: DetalleEntregaInterface;

  registroRepartidores!: FormGroup;
  allRepartidores: Repartidor[] = [];
  allVehiculos: Vehiculo[] = [];
  allNombreRuta: Ruta[] = [];
  id!: string | null;
  idDetalle!: string | any;
  date2: Date | undefined;

  value3: number = 25;

  constructor(
    private router: ActivatedRoute,
    private vehiculoService: VehiculoService,
    private repService: RepartidoresService,
    private rutaSe: RutaService,
    private rutaService: RutaService,
    private render2: Renderer2,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.registroRepartidores = this.formBuilder.group({
      nombreRuta: ['', Validators.required],
      selectedRepartidor: ['', Validators.required],
      selectedVehiculo: ['', Validators.required],
      fecha: ['', Validators.required],
      cantidadPedido: ['', Validators.required]
    });
    this.idDetalle = this.router.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getRepartidores();
    this.getVehiculos();
    this.getAllNombresRutas();
    this.esEditar();
  }

  volverAtras() {
    this.location.back();
    console.log("presionado atras");
  }

  onRutaNombreSelectionChange() {
    const selectedId = this.registroRepartidores.get('nombreRuta')?.value;
    console.log('ID del ruta seleccionado:', selectedId);
  }

  onRepartidorSelectionChange() {
    const selectedId = this.registroRepartidores.get('selectedRepartidor')?.value;
    console.log('ID del repartidor seleccionado:', selectedId);
  }

  onVehiculoSelectionChange() {
    const selectedId = this.registroRepartidores.get('selectedVehiculo')?.value;
    console.log('ID del vehiculo seleccionado:', selectedId);
  }

  getRepartidores() {
    this.repService.getRepartidores().subscribe(
      (data: Repartidor[]) => {
        this.allRepartidores = data;
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  getAllNombresRutas() {
    this.rutaSe.getNombreRutas().subscribe(
      (data: Ruta[]) => {
        this.allNombreRuta = data;
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  getVehiculos() {
    this.vehiculoService.getVehiculos().subscribe(
      (data: Vehiculo[]) => {
        this.allVehiculos = data;
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  esEditar() {
    if (this.idDetalle !== null) {
      this.rutaSe.detalleRutaById(this.idDetalle).subscribe((data) => {
        this.listDetalle = data;
      }, error => {
        console.error('Error fetching details:', error);
      });
    }
  }


  actualizarEntrega() {
    console.log("....")
    // if (this.registroRepartidores.valid) {
    let formValue = this.registroRepartidores?.get('fecha')?.value;
    if (formValue) {
      formValue = this.formatDate(formValue);
    }
      const updateData = {
        rutaId: this.registroRepartidores?.get('nombreRuta')?.value,
        repartidorId: this.registroRepartidores?.get('selectedRepartidor')?.value,
        vehiculoId: this.registroRepartidores?.get('selectedVehiculo')?.value,
        fechaInicio: formValue,
        cantidadBotellas: this.registroRepartidores?.get('cantidadPedido')?.value
      };

      this.rutaSe.updateRutaEntregaDetalle(this.idDetalle, updateData).subscribe(response => {
        console.log('Update successful', response);
        // this.router.navigate(['/success-page']);
      }, error => {
        console.error('Update failed', error);
      });
    // }
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

}

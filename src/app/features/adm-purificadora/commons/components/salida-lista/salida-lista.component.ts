import { Component, OnInit } from '@angular/core';
import { DetalleEntregaInterface } from '../../../../../shared/interfaces/detalle-entrega-schema.interface';
import { Repartidor } from '../../../../../shared/interfaces/repartidor.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ruta } from '../../../../../shared/interfaces/ruta.interface';
import { Vehiculo } from '../../../../../shared/interfaces/vehiculo.interface';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salida-lista',
  templateUrl: './salida-lista.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss', './modal.scss', '../../../form.scss']
})
export class SalidaListaComponent implements OnInit {
  visible: boolean = false;
  id!: string;
  salidaForm!: FormGroup;
  selectedNombreRuta: Ruta | any;
  // selectedNombreRuta: Ruta | null = null;
  selectedVehiculo: Vehiculo | null = null;
  // fechaInicio: Date = new Date("2024-06-03");
  selectedRepartidor: Repartidor | null = null;
  allNombreRuta: Ruta[] = [];
  allVehiculos: Vehiculo[] = [];

  allRutas: DetalleEntregaInterface[] = [];
  date2: Date | undefined;
  paginatedRutasDetalles: DetalleEntregaInterface[] = []
  clientAll!: DetalleEntregaInterface;
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual
  allRepartidores: Repartidor[] = [];
  date: Date[] | undefined;

  ngOnInit(): void {
    this.obtenerRutas();
    this.getRepartidores();
    this.getAllNombresRutas();
    this.getVehiculos();
    this.updatePaginatedRutasDetalles();
  }

  constructor(
    private aRouter: ActivatedRoute,
    private repService: RepartidoresService,
    private vehiculoService: VehiculoService,
    private rutaS: RutaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.salidaForm = this.fb.group({
      nombreRuta: ['', Validators.required],
      selectedRepartidor: ['', Validators.required],
      selectedVehiculo: ['', Validators.required],
      cantidadBotellas: ['', Validators.required],
      fecha: ['', Validators.required]
    });
    // this.id = this.aRouter.snapshot.paramMap.get('id');
  }


  mostrarToastError(text: string) {
    Swal.fire({
      title: 'Error',
      text: text,
      icon: 'error',
      position: 'bottom-left', // Mostrar el alerta en la parte superior
      toast: true, // Hacer que el alerta sea tipo toast
      timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
    });
    // return;
  }

  obtenerFechaYHoraActualFormateada(): string {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const día = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${día}`;
  }

  obtenerRutas() {
    console.log(this.obtenerFechaYHoraActualFormateada());
    this.rutaS.getDetallesEntregasRutas().subscribe(
      data => {
        this.allRutas = data;
        this.clientAll = data;
        this.totalRecords = this.allRutas.length;
        this.updatePaginatedRutasDetalles();
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
    this.selectedRepartidor = this.salidaForm.get('selectedRepartidor')?.value;
    console.log('ID del repartidor seleccionado:', this.selectedRepartidor);
  }
  onVehiculoSelectionChange() {
    this.selectedVehiculo = this.salidaForm.get('selectedVehiculo')?.value;
    console.log('ID del vehiculo seleccionado:', this.selectedVehiculo);
  }
  eliminarRuta(id: any) {
    this.rutaS.eliminarRuta(id).subscribe(data => {
      this.obtenerRutas();
    }, error => {
      console.log("ocurrio un error", error);
    });
  }

  editar(_id: any) {
    this.id = _id;
    console.log("esEditar", _id);
    if (_id) {
      this.rutaS.detalleRutaById(this.id).subscribe((data) => {
        this.selectedNombreRuta = data.rutaId;
        this.selectedRepartidor = data.repartidorId;
        this.selectedVehiculo = data.vehiculoId;

        this.salidaForm.patchValue({
          nombreRuta: data.rutaId,
          selectedRepartidor: data.repartidorId,
          selectedVehiculo: data.vehiculoId,
          cantidadBotellas: data.cantidadBotellas

        });
 
        if (data.fechaInicio !== null && data.fechaInicio !== undefined) {
          let fechaInicioDate = data.fechaInicio instanceof Date ? data.fechaInicio : new Date(data.fechaInicio);
          const fechaFormateada = fechaInicioDate.toISOString().substring(0, 10);
          this.salidaForm.patchValue({
            fecha: fechaFormateada,
          });
        } else {
          this.salidaForm.patchValue({
            fecha: null,
          });
        }



        console.log("Fecha inicio:", data.fechaInicio); // Verifica que el valor es correcto

        // Mueve la ruta seleccionada al principio del array
        this.allNombreRuta = this.allNombreRuta.filter(ruta => ruta._id !== data.rutaId._id);
        this.allNombreRuta.unshift(data.rutaId);

        this.allRepartidores = this.allRepartidores.filter(repartidor => repartidor._id !== data.repartidorId._id);
        this.allRepartidores.unshift(data.repartidorId);

        this.allVehiculos = this.allVehiculos.filter(vehiculo => vehiculo._id !== data.vehiculoId._id);
        this.allVehiculos.unshift(data.vehiculoId);

      });
    }
    this.visible = true;
  }


  guardarCambios() {
    // Obtener los valores del formulario
    const nombreRuta = this.salidaForm.get('nombreRuta')?.value;
    const selectedRepartidor = this.salidaForm.get('selectedRepartidor')?.value;
    const selectedVehiculo = this.salidaForm.get('selectedVehiculo')?.value;
    const cantidadBotellas = this.salidaForm.get('cantidadBotellas')?.value;
    const fecha = this.salidaForm.get('fecha')?.value;

  
    const data = {
      rutaId: nombreRuta._id,
      repartidorId: selectedRepartidor._id,
      vehiculoId: selectedVehiculo._id,
      cantidadBotellas: cantidadBotellas,
      fechaInicio: fecha
    };

    console.log(data)

    this.rutaS.updateRutaEntregaDetalle(this.id, data).subscribe(response => {
      console.log('Update successful', response);
      this.visible = false;
      this.obtenerRutas();

      Swal.fire({
        title: '¡Perfecto!',
        text: 'Se han actualizado los datos correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: false,
      });
    


    }, error => {
      this.visible = true;
        Swal.fire("Error", error, 'error');
      console.error('Update failed', error);
    });

  }
  getAllNombresRutas() {
    this.rutaS.getNombreRutas().subscribe(
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




  // this.selectedNombreRuta is undefined
  onRutaNombreSelectionChange() {
    this.selectedNombreRuta = this.salidaForm.get('nombreRuta')?.value;
    console.log('ID del ruta seleccionado:', this.selectedNombreRuta);
  }


  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedClients();
  }

  updatePaginatedClients() {
    this.paginatedRutasDetalles = this.allRutas.slice(this.first, this.first + this.rows);
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { RutaService } from "../../../../../shared/services/ruta.service";
import { Subscription, interval } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EntregaService } from "../../services/entrega.service";

export interface ClienteInterface {
  _id: string;
  nombre: string;
  email: string;
  longitud: string;
  latitud: string;
  telefono: string;
  numCasa: string;
  municipio: string;
  colonia: string;
  estatus: string;
  rol: string;
  password1: string;
  fechaDeRegistro: string;
  __v: number;
}

export interface PuntoDeEntregaInterface {
  _id: string;
  clientePresente: boolean;
  cantidadEntregada?: number; // Hacerlo opcional
  clienteId: ClienteInterface;
}

export interface RepartidorInterface {
  _id: string;
  nombre: string;
  email: string;
  password1: string;
  telefono: string;
  numCasa: string;
  fechaDeAgregacion: string;
  rol: string;
  __v: number;
  diasAsignados: string[];
}

export interface VehiculoInterface {
  _id: string;
  marca: string;
  modelo: string;
  anio: number;
  placas: string;
  __v: number;
  diasAsignados: string[];
}

export interface DetalleEntregaInterface {
  _id: string;
  nombreRuta: any;
  repartidorId: RepartidorInterface;
  vehiculoId: VehiculoInterface;
  estado: string;
  cantidadBotellas: number;
  cantidadContada?: number; // Hacerlo opcional
  puntosDeEntrega: PuntoDeEntregaInterface[];
  diasSalida: string;
  fechaSalida: string;
  __v: number;
  diasAsignados: string;
  esSalida: boolean;
}

@Component({
  selector: "app-entrada-lista",
  templateUrl: "./entrada-lista.component.html",
  styleUrls: [
    "../../../tablePrime.scss",
    "./modal.scss",
    "../../../form.scss",
  ],
})
export class EntradaListaComponent implements OnInit, OnDestroy {
  allRutas: DetalleEntregaInterface[] = [];
  paginatedRutasDetalles: DetalleEntregaInterface[] = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;

  filterText:string=''
  estadoinput: boolean = true;
  ruta!: DetalleEntregaInterface[];
  inputNumberValue: number | null = null; // Valor del campo de entrada
  mostrarBotonGuardar: boolean = false; // Controla la visibilidad del botón
  visible: boolean = false;
  // rutaSeleccionada!: DetalleEntregaInterface;
  cantidadInvalida: boolean = false;
  rutaSeleccionada: DetalleEntregaInterface | null = null; // Asegúrate de que sea null al iniciar

  private pollingSubscription: Subscription | undefined;

  constructor(
    private rutaS: RutaService,
    private router: Router,
    private fb: FormBuilder,
    private entregaS: EntregaService // Inyecta el servicio EntregaService
  ) {}

  ngOnInit(): void {
    this.obtenerRutas();
    // this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

   onGlobalFilter(event: Event) {
    // // const value = event.target as HTMLInputElement;
    // const value = (event.target as HTMLInputElement).value.toLowerCase();

    // if (value) {
    //   const filteredData = this.allClients.filter(
    //     (c) =>
    //       c.nombre.toLowerCase().includes(value) ||
    //       c.email.toLowerCase().includes(value) ||
    //       c.telefono.toLowerCase().includes(value) ||
    //       c.municipio.toLowerCase().includes(value) ||
    //       c.colonia.toLowerCase().includes(value)
    //   );

    //   this.totalRecords = filteredData.length;
    //   this.paginatedUser = filteredData.slice(
    //     this.first,
    //     this.first + this.rows
    //   );
    // } else {
    //   this.totalRecords = this.allClients.length;
    //   this.paginatedUser = this.allClients.slice(
    //     this.first,
    //     this.first + this.rows
    //   );

    //   // this.dt2.filterGlobal(input.value, "contains");
    // }
  }
  obtenerRutas() {
    this.rutaS.getRutasSalidas().subscribe(
      (data: DetalleEntregaInterface[]) => {
        this.ruta = data;
        // Filtrar los datos para solo incluir los que tienen fechaSalida
        const rutasConFechaSalida = data.filter(
          (ruta: DetalleEntregaInterface) => ruta.fechaSalida
        );
        this.allRutas = rutasConFechaSalida;

  // this.totalEntregado = item.puntosDeEntrega.reduce(
  //                   (total, dt: any) => {
  //                     return total + dt.cantidadEntregada;
  //                   },
  //                   0
  //                 );
  // cantidadBotellas: number;
  // cantidadContada?: number; // Hacerlo opcional

//  cantidadBotellas: number;
  // cantidadContada?: number;

        this.totalRecords = this.allRutas.length;
        this.updatePaginatedRutasDetalles();
      },
      (error) => {
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

  calcularSobrantes(ruta: DetalleEntregaInterface): number {
    let totalEntregado = 0;
    ruta.puntosDeEntrega.forEach((punto: PuntoDeEntregaInterface) => {
      totalEntregado += punto.cantidadEntregada || 0;
    });
    const cantidadBotellas = ruta.cantidadBotellas || 0;
    return cantidadBotellas - totalEntregado;
  }

  eliminarRuta(id: string) {
    this.rutaS.eliminarRuta(id).subscribe(
      () => {
        this.obtenerRutas();
      },
      (error) => {
        console.log("Ocurrió un error", error);
      }
    );
  }

  editar(id: string) {
    this.router.navigate(["/purificadoraAdm/salida/edit-salida/", id]);
  }

  disablein(estado: string): boolean {
    return estado === "terminado" ? false : true;
  }

  getEstado(ruta: DetalleEntregaInterface): string {
    return ruta.estado === "recibido" ? "en proceso" : ruta.estado;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedRutasDetalles();
  }

  calcularCantidadTotalEntregada(ruta: DetalleEntregaInterface): number {
    if (!ruta.puntosDeEntrega) return 0;
    return ruta.puntosDeEntrega.reduce(
      (total: number, punto: PuntoDeEntregaInterface) => {
        return total + (punto.cantidadEntregada || 0);
      },
      0
    );
  }

  recibirRuta(id: string) {
    this.estadoinput = false;
    this.mostrarBotonGuardar = true;
  }

  startPolling() {
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.obtenerRutas();
    });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
  guardarEntrega() {
    if (this.rutaSeleccionada === null) {
      console.error("No se ha seleccionado ninguna ruta.");
      return;
    }

    console.log(this.rutaSeleccionada);

    const cantidadBotellasSobrantes =
      this.rutaSeleccionada.cantidadBotellas -
      this.calcularCantidadTotalEntregada(this.rutaSeleccionada);

    const puntosDeEntrega = this.rutaSeleccionada.puntosDeEntrega.map(
      (punto: any) => ({
        clientePresente: punto.clientePresente,
        cantidadEntregada: punto.cantidadEntregada,
        clienteId: punto.clienteId._id,
      })
    );

    const fechaEntrada = new Date().toISOString().split("T")[0];
    const [year, month, day] = fechaEntrada.split("-");
    const fechaEntradaFormatted = `${day}-${month}-${year}`;
    // !aqui corregir
    const entrega = {
      nombreRuta: this.rutaSeleccionada.nombreRuta,
      repartidorId: this.rutaSeleccionada.repartidorId._id,
      vehiculoId: this.rutaSeleccionada.vehiculoId._id,
      estado: this.rutaSeleccionada.estado,
      cantidadBotellas: this.rutaSeleccionada.cantidadBotellas,
      cantidadBotellasSobrantes: cantidadBotellasSobrantes,
      contados: this.inputNumberValue,
      puntosDeEntrega: puntosDeEntrega,
      diasEntrada: this.rutaSeleccionada.diasSalida,
      fechaEntrada: fechaEntradaFormatted,
    };

    console.log("Datos de la entrega:", entrega);

    this.entregaS.crearEntrega(entrega).subscribe(
      (response) => {
        console.log("Entrega creada exitosamente", response);
        console.log(
          "confirm",
          this.rutaSeleccionada?.nombreRuta,
          entrega.fechaEntrada
        );

        this.entregaS
          .confirmarSalida(
            this.rutaSeleccionada?.nombreRuta,
            entrega.fechaEntrada
          )
          .subscribe(
            (confirmResponse) => {
              console.log("Salida confirmada exitosamente", confirmResponse);
              this.obtenerRutas();
              this.visible = false;
            },
            (error) => {
              console.error("Error al confirmar la salida", error);
            }
          );
      },
      (error) => {
        console.error("Error al crear la entrega", error);
      }
    );
  }

  cancelarRecibo() {
    this.estadoinput = true;
    this.inputNumberValue = null; // Resetea el valor del input
    this.cantidadInvalida = false; // Oculta el mensaje de error
    this.mostrarBotonGuardar = false; // Oculta los botones de guardar y cancelar
  }

  // Método para mostrar el modal
  mostrarModal(ruta: DetalleEntregaInterface) {
    this.rutaSeleccionada = ruta;
    this.visible = true;
  }
}

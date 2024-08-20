import { Component, Input } from "@angular/core";
import { Message } from "primeng/api";
import { Cliente } from "../../../../../shared/interfaces/client.interface";
import { Ruta } from "../../../../../shared/models/ruta.model";
import { Vehiculo } from "../../../../../shared/models/vehiculo.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Repartidor } from "../../../../../shared/models/repartidor.model";
// import { DetalleEntregaInterface } from '../entrada-lista/entrada-lista.component';
import { ActivatedRoute, Router } from "@angular/router";
import { RepartidoresService } from "../../../../../shared/services/rapartidores.service";
import { VehiculoService } from "../../../../../shared/services/vehiculo.service";
import { RutaService } from "../../../../../shared/services/ruta.service";
import { Toast } from "../../../../../shared/services/toast.service";
import Swal from "sweetalert2";
import { Salida } from "../../../../../shared/models/salida.model";
import {
  PuntoDeEntregaInterface,
  RepartidorInterface,
  VehiculoInterface,
} from "../entrada-lista/entrada-lista.component";

export interface DetalleEntregaInterface {
  _id: string;
  nombreRuta: any;
  repartidorId: RepartidorInterface;
  vehiculoId: VehiculoInterface;
  estado: string;
  cantidadBotellas: number;
  cantidadContada?: number; // Hacerlo opcional
  puntosDeEntrega: PuntoDeEntregaInterface[];
  diasEntrada: string;
  fechaEntrada: string;
  __v: number;
}

export interface PuntoDeEntrega {
  clienteId?: Cliente;
  clientePresente?: boolean;
  cantidadEntregada?: number;
  _id: string;
}
@Component({
  selector: "app-historial-entrega",
  templateUrl: "./historial-entrega.component.html",
  styleUrls:[ "../../../tablePrime.scss", "../../../form.scss"]
})
export class HistorialEntregaComponent {
  messages!: Message[];
  @Input() data!: any; // data es un array de Salida

  visible: boolean = false;
  id!: string;
  cantidadForm!: FormGroup;
  allClients: Cliente[] = [];
  selectedNombreRuta: Ruta | any;
  // selectedNombreRuta: Ruta | null = null;
  selectedVehiculo: Vehiculo | null = null;
  // fechaInicio: Date = new Date("2024-06-03");
  selectedRepartidor: Repartidor | null = null;
  allNombreRuta: Ruta[] = [];
  allVehiculos: Vehiculo[] = [];

  allEntregas: DetalleEntregaInterface[] = [];
  date2: Date | undefined;
  paginatedEntregas: DetalleEntregaInterface[] = [];
  clientAll!: DetalleEntregaInterface;
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual
  allRepartidores: Repartidor[] = [];
  date: Date[] | undefined;
  diaTexto: string;

  fecha: string;
  totalAsignado: number = 0;
  totalEntregado: number = 0;
  totalSobrado: number = 0;
  rutaActual: any;
  listClientes: Cliente[] | any;
  filterText: string = "";
  ngOnInit(): void {
    this.obtenerEntregas();
    this.updatePaginatedEntregas();
    // this.getRepartidores();
    // this.getAllNombresRutas();
    // this.getVehiculos();
  }

  constructor(
    private aRouter: ActivatedRoute,
    private repService: RepartidoresService,
    private vehiculoService: VehiculoService,
    private rutaS: RutaService,
    private router: Router,
    private fb: FormBuilder,
    private toast: Toast
  ) {
    this.cantidadForm = this.fb.group({
      // nombreRuta: ['', Validators.required],
      // selectedRepartidor: ['', Validators.required],
      // selectedVehiculo: ['', Validators.required],
      cantidadBotellas: [0, Validators.required],
      // fecha: ['', Validators.required]
    });
    this.fecha = this.obtenerFechaYYYYMMDD();
    this.diaTexto = this.obtenerDiaTexto();
    // this.id = this.aRouter.snapshot.paramMap.get('id');
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

  obtenerFechaYYYYMMDD() {
    let fecha = new Date();
    let año = fecha.getFullYear();
    let mes = String(fecha.getMonth() + 1).padStart(2, "0");
    let dia = String(fecha.getDate()).padStart(2, "0");

    return `${dia}-${mes}-${año}`;
  }

  obtenerFechaYHoraActualFormateada(): string {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const día = fecha.getDate().toString().padStart(2, "0");
    return `${año}-${mes}-${día}`;
  }

  obtenerDiaTexto() {
    let diasSemana = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    let fecha = new Date();
    return diasSemana[fecha.getDay()];
  }

  obtenerEntregas() {
    this.rutaS.getEntregas().subscribe(
      (data) => {
        this.allEntregas = data;
        this.clientAll = data;
        this.totalRecords = this.allEntregas.length;
        this.updatePaginatedEntregas();
      },
      (error) => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  calculateTotals() {
    this.totalAsignado = this.data.reduce(
      (sum: any, item: any) => sum + item.cantidadBotellas,
      0
    );
    this.totalEntregado = this.data.reduce(
      (sum: any, item: any) =>
        sum + (item.cantidadBotellas - item.cantidadBotellasSobrantes),
      0
    );
    this.totalSobrado = this.data.reduce(
      (sum: any, item: any) => sum + item.cantidadBotellasSobrantes,
      0
    );
  }
  //!aqui
  getData(id: string): void {
    console.log("aquI");
    if (id) {
      this.rutaS.detalleEntregaById(id).subscribe(
        (data) => {
          this.data = data;
          // this.showLoader = false;
          // console.log("Data received:", this.data); // Check what `data` contains

          this.calculateTotals();

          if (Array.isArray(data)) {
            data.forEach((item: Salida) => {
              if (item.puntosDeEntrega && Array.isArray(item.puntosDeEntrega)) {
                const clientes = item.puntosDeEntrega.map(
                  (entrega: PuntoDeEntrega) => entrega
                );

                // / Suponiendo que item.puntosDeEntrega es un array de objetos
                // this.cantidadEntregadaTotal = item.puntosDeEntrega.reduce(
                //   (total, dt: any) => {
                //     return total + dt.cantidadEntregada;
                //   },
                //   0
                // );
                // console.log(this.cantidadEntregadaTotal);
                // const diferencia =
                //   data[0].cantidadBotellas - this.cantidadEntregadaTotal;
                // this.botellasSobrantes = diferencia;

                this.listClientes = clientes;
                // Suponiendo que item.puntosDeEntrega es un array de objetos
                // Show the modal after data is loaded
                this.visible = true;
                // console.log(cantidadEntregadaTotal);
              } else {
                console.log(
                  "No hay puntos de entrega disponibles para este item."
                );
              }
            });
          } else {
            console.log("La respuesta no es un array.");
          }
        },
        (error) => {
          console.error("Error al actualizar el usuario:", error);
        }
      );
    }
  }

  updatePaginatedEntregas() {
    this.paginatedEntregas = this.allEntregas.slice(
      this.first,
      this.first + this.rows
    );
  }

  eliminarRuta(id: any) {
    this.rutaS.eliminarRuta(id).subscribe(
      (data) => {
        this.obtenerEntregas();
      },
      (error) => {
        console.log("ocurrio un error", error);
      }
    );
  }

  cancelarSalida(id: any) {
    const estado = "cancelado";
    this.rutaS.updateEstadoSalida(id, estado).subscribe(
      (response) => {
        console.log("Status updated:", response);
        this.obtenerEntregas();
      },
      (error) => {
        console.error("Error updating status:", error);
      }
    );
  }

  editar(ruta: any) {
    this.rutaActual = ruta;
    this.cantidadForm.controls["cantidadBotellas"].setValue(
      ruta.cantidadBotellas || 0
    );
    this.visible = true;
  }

  selectToastSwal(ruta: any) {
    // this.getRepartidores();
    const selectHTML = `
    <select id="swal-select" class="swal2-input" formControlName="selectedRepartidor" (click)="onVehiculoSelectionChange()">
      <option value="" disabled selected>Selecciona un Repartidor</option>
      ${this.allRepartidores
        .map(
          (repartidor) => `
        <option value="${repartidor._id}" ${
            repartidor._id === ruta.repartidorId?._id ? "selected" : ""
          }>
          ${repartidor.nombre}
        </option>
      `
        )
        .join("")}
    </select>
  `;

    Swal.fire({
      title: "Select a Repartidor",
      html: selectHTML,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const selectedValue = (
          Swal.getPopup()?.querySelector("#swal-select") as HTMLSelectElement
        ).value;
        if (!selectedValue) {
          Swal.showValidationMessage("Please select a repartidor");
        }
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedRepartidorId = result.value;
        const selectedRepartidor = this.allRepartidores.find(
          (repartidor) => repartidor._id === selectedRepartidorId
        );

        // Actualiza la ruta con el vehículo seleccionado
        ruta.repartidorId = selectedRepartidor;

        Swal.fire(`Repartidor seleccionado: ${selectedRepartidor?.nombre}`);
      }
    });
  }

  selectToastCambiarVehiculoSwal(ruta: any) {
    // this.getVehiculos();
    const selectHTML = `
    <select id="swal-select" class="swal2-input" formControlName="selectedVehiculo" (click)="onVehiculoSelectionChange()">
      <option value="" disabled selected>Selecciona el vehiculo</option>
      ${this.allVehiculos
        .map(
          (vehiculo) => `
        <option value="${vehiculo._id}" ${
            vehiculo._id === ruta.vehiculoId?._id ? "selected" : ""
          }>
          ${vehiculo.placas}
        </option>
      `
        )
        .join("")}
    </select>
  `;
    Swal.fire({
      title: "Select un vehiculo",
      html: selectHTML,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const selectedValue = (
          Swal.getPopup()?.querySelector("#swal-select") as HTMLSelectElement
        ).value;
        if (!selectedValue) {
          Swal.showValidationMessage("Por favor selecciona un vehiculo");
        }
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedVehiculoId = result.value;
        const selectedVehiculo = this.allVehiculos.find(
          (vehiculo) => vehiculo._id === selectedVehiculoId
        );
        // Actualiza la ruta con el vehículo seleccionado
        ruta.vehiculoId = selectedVehiculo;
        Swal.fire(`Vehículo seleccionado: ${selectedVehiculo?.placas}`);
      }
    });
  }

  obtenerTodosLosClientes(ruta: any) {
    // Verifica si la ruta tiene puntos de entrega y es un array
    if (!Array.isArray(ruta.puntosDeEntrega)) {
      return [];
    }

    //   clienteId: allClients

    const clientesSeleccionados = ruta.puntosDeEntrega.map((punto: any) => {
      const cliente = punto.clienteId;

      return cliente && typeof cliente === "object" && cliente._id
        ? cliente._id
        : cliente;
    });

    // Filtra valores undefined o null
    return clientesSeleccionados.filter((clienteId: any) => clienteId);
  }

  close() {
    this.visible = false;
  }

  guardarCambios() {
    if (this.rutaActual) {
      this.rutaActual.cantidadBotellas =
        this.cantidadForm.controls["cantidadBotellas"].value;
      this.visible = false;
    }
  }

  enviar(data: any, esSalida: any) {
    // if (ruta) {
    const nombreRuta = data.nombreRuta;
    const selectedRepartidor = data.repartidorId;
    const selectedVehiculo = data.vehiculoId;
    const cantidadBotellas = data.cantidadBotellas;
    const puntosDeEntrega = this.obtenerTodosLosClientes(data);

    if (!cantidadBotellas) {
      this.toast.showToastPmNgWarn("Por favor ingresa la cantidad");
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "swal2-confirm btn-success",
        cancelButton: "swal2-cancel btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "¿Estás seguro?",
        text: "¿Deseas enviar los datos con los cambios realizados?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, enviar!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (data && !esSalida) {
            const SALIDA: Salida = {
              nombreRuta: nombreRuta,
              repartidorId: selectedRepartidor,
              vehiculoId: selectedVehiculo,
              cantidadBotellas: cantidadBotellas,
              puntosDeEntrega: puntosDeEntrega,
              estado: "enviado",
            };
            console.log("no es salida");

            this.rutaS.addSalida(SALIDA).subscribe(
              (response) => {
                this.visible = false;
                this.obtenerEntregas();
                this.toast.showToastSwalSuccess(
                  "Se ha agregado correctamente."
                );

                this.router.navigate([
                  "/purificadoraAdm/salida/salida-listado",
                ]); // Navegación hacia otras páginas públicas
              },
              (error) => {
                console.error(error); // Imprime el error en la consola para depuración
                let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
                if (error && error.error && error.error.message) {
                  errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
                }
                this.toast.showToastSwalError(errorMessage); // Mostramos el mensaje de error en la alerta
              }
            );
          } else if (data && esSalida) {
            console.log("es salida");

            const SALIDAUPDATE: Salida = {
              nombreRuta: nombreRuta,
              repartidorId: selectedRepartidor,
              vehiculoId: selectedVehiculo,
              cantidadBotellas: cantidadBotellas,
              puntosDeEntrega: puntosDeEntrega,
              estado: "enviado",
            };
            this.rutaS.updateSalida(data._id, SALIDAUPDATE).subscribe(
              (response) => {
                this.visible = false;
                this.obtenerEntregas();
                this.toast.showToastSwalSuccess(
                  "Se ha actualizado correctamente."
                );

                this.router.navigate([
                  "/purificadoraAdm/salida/salida-listado",
                ]); // Navegación hacia otras páginas públicas
              },
              (error) => {
                console.error(error); // Imprime el error en la consola para depuración
                let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
                if (error && error.error && error.error.message) {
                  errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
                }
                this.toast.showToastSwalError(errorMessage); // Mostramos el mensaje de error en la alerta
              }
            );
          }

          // Aquí puedes agregar la lógica para enviar los datos al servidor
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "Los cambios no se han enviado.",
            icon: "error",
          });
        }
      });
    // }
  }

  // getVehiculos() {
  //   this.vehiculoService.getVehiculos().subscribe(
  //     (data: Vehiculo[]) => {
  //       this.allVehiculos = data;
  //     },
  //     (error) => {
  //       console.log("ocurrió un error al obtener la información", error);
  //     }
  //   );
  // }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedClients();
  }

  updatePaginatedClients() {
    this.paginatedEntregas = this.allEntregas.slice(
      this.first,
      this.first + this.rows
    );
  }
}

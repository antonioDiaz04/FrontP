import { Component, OnInit } from "@angular/core";
import { DetalleEntregaInterface } from "../../../../../shared/interfaces/detalle-entrega-schema.interface";
import { Repartidor } from "../../../../../shared/interfaces/repartidor.interface";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { RepartidoresService } from "../../../../../shared/services/rapartidores.service";
import { RutaService } from "../../../../../shared/services/ruta.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Ruta } from "../../../../../shared/interfaces/ruta.interface";
import { Vehiculo } from "../../../../../shared/interfaces/vehiculo.interface";
import { VehiculoService } from "../../../../../shared/services/vehiculo.service";
import Swal from "sweetalert2";
import { Toast } from "../../../../../shared/services/toast.service";
import { Salida } from "../../../../../shared/models/salida.model";
import { Cliente } from "../../../../../shared/interfaces/client.interface";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SessionService } from "../../../../../core/commons/components/service/session.service";
@Component({
  selector: "app-salida-lista",
  templateUrl: "./salida-lista.component.html",
  styleUrls: [
    "../../../colorsClass.scss",
    "../../../tablePrime.scss",
    "../../../tooltip.scss",
    "./modal.scss",
    "../../../form.scss",
  ],
})
export class SalidaListaComponent implements OnInit {
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
  idPurificadora!: string;
  allRutas: DetalleEntregaInterface[] = [];
  date2: Date | undefined;
  paginatedRutasDetalles: DetalleEntregaInterface[] = [];
  clientAll!: DetalleEntregaInterface;
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual
  allRepartidores: Repartidor[] = [];
  date: Date[] | undefined;
  diaTexto: string;

  fecha: string;

  rutaActual: any;

  ngOnInit(): void {
    this.obtenerRutas();
    this.updatePaginatedRutasDetalles();

    this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
    if (userData) {
      this.idPurificadora = userData;
    }
  }

  constructor(
    private aRouter: ActivatedRoute,
    private repService: RepartidoresService,
    private vehiculoService: VehiculoService,
    private rutaS: RutaService,
    private router: Router,
    private fb: FormBuilder,
    private toast: Toast,
    private ngxUiLoaderService: NgxUiLoaderService,
    private sessionService: SessionService
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

  obtenerRutas() {
    this.rutaS.getRutasSalidas().subscribe(
      (data) => {
        this.allRutas = data;
        this.clientAll = data;
        this.totalRecords = this.allRutas.length;
        this.updatePaginatedRutasDetalles();
      },
      (error) => {
        // console.log("ocurrió un error al obtener la información", error);
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
    this.rutaS.eliminarRuta(id).subscribe(
      (data) => {
        this.obtenerRutas();
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
        this.obtenerRutas();
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
    const clientesSeleccionados = ruta.puntosDeEntrega.map((punto: any) => {
      const cliente = punto.clienteId;

      return cliente && typeof cliente === "object" && cliente._id
        ? cliente._id
        : cliente;
    });
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
              idPurificadora: this.idPurificadora,
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
                this.obtenerRutas();
                this.toast.showToastSwalSuccess(
                  "Se ha agregado correctamente."
                );
                this.router.navigate([
                  "/purificadoraAdm/salida/salida-listado",
                ]);
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
              idPurificadora: this.idPurificadora,
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
                this.obtenerRutas();
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
    this.paginatedRutasDetalles = this.allRutas.slice(
      this.first,
      this.first + this.rows
    );
  }
}

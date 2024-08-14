import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Salida } from "../../../../shared/models/salida.model";
import { StorageService } from "../../../../core/commons/components/service/storage.service";
import { SessionService } from "../../../../core/commons/components/service/session.service";
import { RepartidoresService } from "../../../../shared/services/rapartidores.service";
import { RutaService } from "../../../../shared/services/ruta.service";
import Swal from "sweetalert2";

export interface PuntoDeEntrega {
  cantidadEntregada?: number;
  _id: string;
}

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.view.html",
  styleUrl: "./inicio.view.css",
})
export class InicioView implements OnInit {
  @Input() data!: Salida[] | any; // data es un array de Salida
  id!: string;
  idSalida!: any;
  botellasSobrantes: number = 10;
  editMode: boolean = false;
  buttonText: string = "Recibir";
  enviado!: any;
  buttonColor: string = "#379b91";
  cantidadEntregadaTotal!: number;
  sidebarVisible: boolean = false;
  tienesSalidaProgramada!: boolean;
  estado!: string;

  constructor(
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private repService: RepartidoresService,
    private salidaService: RutaService,
    private storageService: StorageService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.getData();
  }

  toggleEditMode(salidaId: string): void {
    if (!this.editMode) {
      this.editMode = !this.editMode;
      const estado = "recibido";
      this.buttonText = "Recibido";
      this.salidaService.updateEstadoSalida(salidaId, estado).subscribe(
        (response) => {
          console.log("Status updated:", response);
          this.getData();
        },
        (error) => {
          console.error("Error updating status:", error);
        }
      );
    }
  }

  //  setIdSalida(id: string): void {
  //   this.storageService.setIdSalida(this.idSalida);
  // }

  redirectToAdminPurificadora(route: string): void {
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      console.log("Llegaste a purificadoraAdm");
      this.router.navigate(["/repartidor", route]); // Navegación hacia otras páginas públicas
    }
  }

  logout() {
    if (typeof localStorage !== "undefined") {
      // Eliminar el token del almacenamiento
      localStorage.removeItem("token"); // o sessionStorage.removeItem('token');
    }
    // Opcional: hacer una solicitud al backend para manejar cualquier estado del lado del servidor
    this.router.navigate(["/auth/login"]); // Redirigir a la página de inicio de sesión
  }

  getData(): void {
    this.ngxService.start();

    const userData = this.sessionService.getId();

    if (userData) {
      this.id = userData;
      if (this.id) {
        this.repService.detalleUsuarioSalidaById(this.id).subscribe(
          (data) => {
            this.data = data;
            this.idSalida = data[0]._id;
            // this.idSalida = data[0]._id;
            this.estado=data[0].estado
            this.storageService.setIdSalida(data[0]._id);
            this.storageService.setCantidadSalida(data[0].cantidadBotellas);

            if (this.data == null || data[0].estado=='finalizada') {
              this.tienesSalidaProgramada = false;
            } else {
              this.tienesSalidaProgramada = true;
            }

            if (Array.isArray(data)) {
              data.forEach((item: Salida) => {
                if (
                  item.puntosDeEntrega &&
                  Array.isArray(item.puntosDeEntrega)
                ) {
                  const clientes = item.puntosDeEntrega.map(
                    (entrega: PuntoDeEntrega) => entrega
                  );

                  // Suponiendo que item.puntosDeEntrega es un array de objetos
                  this.cantidadEntregadaTotal = item.puntosDeEntrega.reduce(
                    (total, dt: any) => {
                      return total + dt.cantidadEntregada;
                    },
                    0
                  );
                  console.log(this.cantidadEntregadaTotal);
                  const diferencia =
                    data[0].cantidadBotellas - this.cantidadEntregadaTotal;
                  this.botellasSobrantes = diferencia;

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
  }

  calculateCantidadEntregas(salida: any): any {
    // Lógica para calcular la cantidad de entregas realizadas
    // Esto es solo un ejemplo, ajusta la lógica según tus necesidades
    // return salida.puntosDeEntrega.filter(punto => punto.entregado).length;
    return null;
  }

  terminarEntrega(salidaId: string) {
     const estado = "finalizada";
      this.salidaService.updateEstadoSalida(this.idSalida, estado).subscribe(
        (response) => {
          console.log("Status updated:", response);
          this.getData();
        },
        (error) => {
          console.error("Error updating status:", error);
        }
      );
  }

  enviarEntreada() {
    const selectHTML = `
    <input id="swal-input1" class="swal2-input">
    <input id="swal-input2" class="swal2-input">`;
    Swal.fire({
      title: "Multiple inputs",
      html: selectHTML,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const selectedValue = (
          Swal.getPopup()?.querySelector("#swal-select") as HTMLSelectElement
        ).value;
        if (!selectedValue) {
          Swal.showValidationMessage("Por favor selecciona un vehículo");
        }
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedVehiculoId = result.value;
      }
    });
  }
}

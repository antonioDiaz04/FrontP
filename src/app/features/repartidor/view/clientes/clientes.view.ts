import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientesService } from "../../../../shared/services/clientes.service";
import { Cliente } from "../../../../shared/interfaces/client.interface";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SessionService } from "../../../../core/commons/components/service/session.service";
import { RepartidoresService } from "../../../../shared/services/rapartidores.service";
import { Salida, PuntoDeEntrega } from "../../../../shared/models/salida.model";
import Swal from "sweetalert2";
import { RutaService } from "../../../../shared/services/ruta.service";
import { Toast } from "../../../../shared/services/toast.service";
@Component({
  selector: "app-cliente-tabla",
  templateUrl: "./clientes.view.html",
  styleUrls: ["./clientes.view.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientesView implements OnInit {
  @Input() data!: Salida[] | any; // data es un array de Salida
  // data: Salida | null = null;
  listUsuario?: Cliente;
  idCliente!: string;
  id!: string | null;
  showLoader: boolean = true; // Propiedad para controlar la visibilidad del loader

  clienteForm!: FormGroup;

  showLoaderCamera: boolean = false;
  listClientes: Cliente[] | any;
  allClients: Cliente[] | any;
  paginatedClients: Cliente[] = [];
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

  visible: boolean = false;
  isVisible = false;

  value2: number = 10.5;

  idSalida!: string | null;
  tienesSalidaProgramada!: boolean;
  clienteId!: string;
  cantidadAsignada: any; // Valor inicial asignado
  cantidadIngresada: number = 0; // Cantidad que se va ingresando
  cantidadActual!: number;
  title = "qr-reader";
  public cameras: MediaDeviceInfo[] = [];
  public myDevice!: MediaDeviceInfo;
  public scannerEnabled = false;
  public results: string[] = [];

  // @ViewChild("asGeocoder") asGeocoder!: ElementRef;

  constructor(
    private render2: Renderer2,
    private fb: FormBuilder,
    private UserS: ClientesService,
    private repService: RepartidoresService,
    private router: ActivatedRoute,
    private rou: Router,
    private ngxService: NgxUiLoaderService,
    private salidaService: RutaService,
    private toast: Toast,
    private sessionService: SessionService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", Validators.required],
      estatus: ["", Validators.required],
      numCasa: ["", Validators.required],
      telefono: ["", Validators.required],
    });
    this.cantidadForm = this.fb.group({
      cantidadIngresada: [0, [Validators.required, Validators.min(0)]]
    });
    this.id = this.router.snapshot.paramMap.get("id");
  }
  isModal: boolean = false;
  showScanner = false;
  scannedData!: string;
  cantidadForm!: FormGroup;
  ngOnInit(): void {
    // this.getUsers();
    this.cantidadAsignada = this.sessionService.getCantidadSalida();
    console.log(this.cantidadAsignada);
    // this.updatePaginatedClients();
      this.idSalida = this.sessionService.getIdSalida();
      console.log(this.idSalida)
    this.getData();
  }

  redirectToAdmin(route: string): void {
    console.log(route);
    if (route === "login") {
      this.rou.navigate(["/auth/login"]);
    } else {
      this.rou.navigate(["/purificadoraAdm", route]);
    }
  }

  onCantidadChange(event: any) {
    const nuevaCantidad = event.value;
    this.cantidadActual = nuevaCantidad;

    // Validar que la cantidad ingresada sea válida
    if (nuevaCantidad <= this.cantidadAsignada && nuevaCantidad >= 0) {
      this.cantidadAsignada -= nuevaCantidad;
      this.cantidadIngresada = 0; // Resetea el valor del input
    } else {
      // Mostrar un error o notificación si la cantidad es inválida
      console.error("Cantidad inválida.");
    }
  }

  enviarEntrada(): void {
    // Obtén el idSalida desde la sesión
    const idSalida =this.idSalida;
    // Validar que idSalida no sea null
    if (!idSalida) {
      this.toast.showToastPmNgError(
        "No se pudo obtener idSalida. Inténtalo de nuevo."
      );
      return;
    } 
    const cantidadIngresada = this.cantidadForm.get('cantidadIngresada')?.value;

    const cantidadActual=this.cantidadAsignada-cantidadIngresada;
    // Mostrar en la consola los valores antes de enviar
    console.log("idSalida:", idSalida);
    console.log("clienteId:", this.clienteId);
    console.log("cantidadIngresada:", cantidadIngresada);
    // Crear el objeto con los datos a enviar
    const body = {
      idSalida: idSalida,
      clienteId: this.clienteId,
      cantidad: cantidadIngresada,
      
    };
    console.log(body)
    this.salidaService.enviarCantidad(body).subscribe(
      (response) => {
        // Manejar la respuesta si es necesario

        this.isModal = false;
        this.toast.showToastPmNgSuccess("Se envio la cantidad");
        // Desactivar el escáner
        this.scannerEnabled = false;
      },
      (error) => {
        // Manejar el error si es necesario
        this.toast.showToastPmNgSuccess(`Error al enviar la cantidad:${error}`);

        this.isModal = true;

        console.error("Error al enviar la cantidad:", error);
      }
    );
  }

  // enviarEntreada() {
  //   const selectHTML = `
  //   <input id="swal-input1" class="swal2-input">
  //   <input id="swal-input2" class="swal2-input">`;
  //   Swal.fire({
  //     title: "Multiple inputs",
  //     html: selectHTML,
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     preConfirm: () => {
  //       const selectedValue = (
  //         Swal.getPopup()?.querySelector("#swal-select") as HTMLSelectElement
  //       ).value;
  //       if (!selectedValue) {
  //         Swal.showValidationMessage("Por favor selecciona un vehículo");
  //       }
  //       return selectedValue;
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const selectedVehiculoId = result.value;
  //     }
  //   });
  // }

  editar(id: any) {
    this.visible = true;
    this.idCliente = this.router.snapshot.params["id"];
    if (id !== null) {
      this.UserS.detalleClienteById(id).subscribe((data) => {
        this.listUsuario = data;
        this.clienteForm.setValue({
          nombre: data.nombre,
          email: data.email,
          estatus: data.estatus,
          numCasa: data.numCasa,
          telefono: data.telefono,
        });
      });
    }
  }

  actualizarCliente(id: any) {
    if (this.clienteForm.valid) {
      this.UserS.updateUsuario(id, this.clienteForm.value).subscribe(
        (response) => {
          // this.getUsers();
          this.visible = false;
          console.log("Usuario actualizado:", response);
        },
        (error) => {
          console.error("Error al actualizar el usuario:", error);
        }
      );
    }
  }

  // aqui es para obtener los clientes
  getData(): void {
    this.ngxService.start();

    const userData = this.sessionService.getId();

    if (userData) {
      this.id = userData;
      if (this.id) {
        this.repService.detalleUsuarioSalidaById(this.id).subscribe(
          (data) => {
            this.data = data;
            this.showLoader = false;
            // console.log("Data received:", this.data); // Check what `data` contains
            if (Array.isArray(data)) {
              data.forEach((item: Salida) => {
                if (
                  item.puntosDeEntrega &&
                  Array.isArray(item.puntosDeEntrega)
                ) {
                  const clientes = item.puntosDeEntrega.map(
                    (entrega: PuntoDeEntrega) => entrega.clienteId
                  );
                  this.listClientes = clientes;
                  // console.log("Clientes:", this.listClientes);
                  // console.log("Clientes:", clientes);
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

  camerasFoundHandler(cameras: MediaDeviceInfo[]) {
    this.cameras = cameras;
    if (cameras.length > 0) {
      this.selectCamera(this.cameras[0].deviceId);
      this.showLoaderCamera = false; // Ocultar el loader si se encuentran cámaras
    } else {
      this.showLoaderCamera = true; // muestra el loader encuentran cámaras
    }
  }

  // scanSuccessHandler(event: string) {
  //   console.log(event);
  //   this.results.unshift(event);
  // }

  scanSuccessHandler(event: string) {
    // console.log(event);
    this.results.unshift(event);
    this.showScanner = false; // Ocultar el scanner/modal
    this.scannerEnabled = false; // Desactiva el escáner

    // Mostrar SweetAlert para confirmar la acción
    Swal.fire({
      title: "QR detectado",
      text: `¿Deseas continuar con la entrega al usuario ${event}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.entregar(event); // Llamar a la función de entrega si se confirma
      } else {
        this.showScanner = false; // Volver a mostrar el scanner si se cancela
      }
    });
  }

  selectCamera(deviceId: string) {
    const selectedCamera = this.cameras.find(
      (camera) => camera.deviceId === deviceId
    );
    if (selectedCamera) {
      this.myDevice = selectedCamera;
      this.showScanner = true; //

      // console.log("Using camera: ", this.myDevice.label);
      this.scannerEnabled = true;
    } else {
      console.error("Camera not found!");
    }
  }
  // getUsers() {
  //   this.UserS.obtenerCLientes().subscribe(
  //     (data) => {
  //       this.allClients = data;
  //       this.totalRecords = this.allClients.length;
  //       this.updatePaginatedClients();
  //     },
  //     (error) => {
  //       console.log("ocurrió un error al obtener la información", error);
  //     }
  //   );
  // }

  // onPageChange(event: any) {
  //   this.first = event.first;
  //   this.rows = event.rows;
  //   this.updatePaginatedClients();
  // }

  // updatePaginatedClients() {
  //   this.paginatedClients = this.allClients.slice(
  //     this.first,
  //     this.first + this.rows
  //   );
  // }

  eliminarUsuario(id: any) {
    this.UserS.eliminarCliente(id).subscribe(
      (data) => {
        console.log("eliminado");
        // this.getUsers();
      },
      (error) => {
        console.log("ocurrio un error", error);
      }
    );
  }

  // Función para redireccionar al formulario nuevo|
  redireccionar() {
    this.rou.navigateByUrl("repartidor/Opciones");
  }
  escanearQR(id: any) {
    this.clienteId = id;
    this.showScanner = true; // muestra el modal
    this.scannerEnabled = true; // activa el escáner
  }

  closeScanner() {
    this.isModal = false;

    this.showScanner = false; // Oculta el modal
    // Opcionalmente, desactiva el escáner
    this.scannerEnabled = false;
  }

  entregar(id: any) {
    this.isModal = true;

    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You won't be able to revert this!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, delete it!",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     Swal.fire({
    //       title: "Deleted!",
    //       text: "Your file has been deleted.",
    //       icon: "success",
    //     });
    //   }
    // });
  }

  handleQrCodeResult(result: string): void {
    this.scannedData = result;
    console.log("Scanned QR Code Data:", result);
    this.closeScanner();
  }

  verRuta(cliente: any) {
    // Lógica para ver ruta
    console.log("Ver ruta de", cliente.nombre);
  }
}

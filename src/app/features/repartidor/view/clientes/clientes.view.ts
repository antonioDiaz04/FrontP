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

  clienteForm!: FormGroup;

  listClientes: Cliente[] | any;
  allClients: Cliente[] | any;
  paginatedClients: Cliente[] = [];
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

  visible: boolean = false;
  isVisible = false;

  idSalida!: string;
  tienesSalidaProgramada!: boolean;

  @ViewChild("asGeocoder") asGeocoder!: ElementRef;

  constructor(
    private render2: Renderer2,
    private fb: FormBuilder,
    private UserS: ClientesService,
    private repService: RepartidoresService,
    private router: ActivatedRoute,
    private rou: Router,
    private ngxService: NgxUiLoaderService,
    private sessionService: SessionService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", Validators.required],
      estatus: ["", Validators.required],
      numCasa: ["", Validators.required],
      telefono: ["", Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get("id");
  }
  showScanner = false;
  scannedData!: string;
  ngOnInit(): void {
    // this.getUsers();
    // this.updatePaginatedClients();
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

            console.log("Data received:", this.data); // Check what `data` contains
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
                  console.log("Clientes:", clientes);
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

  // Función para redireccionar al formulario nuevo
  redireccionar() {
    this.rou.navigateByUrl("repartidor/Opciones");
  }
  escanearQR(route: any) {
    this.showScanner = true;

    this.rou.navigate(["/repartidor", route]);
  }

  closeScanner() {
    this.showScanner = false;
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

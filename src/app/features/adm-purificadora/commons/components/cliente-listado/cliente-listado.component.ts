import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { UsuariosclientesService } from "../../../../../shared/services/usuariosclientes.service";
import { ClientesService } from "../../../../../shared/services/clientes.service";
import { Cliente } from "../../../../../shared/interfaces/client.interface";
import { MapaService } from "../../services/mapa.service";
import { Usuario } from "../../../../../shared/models/usuario.model";
import { MapaClientDetailUbacionService } from "../../services/mapaClientDetalle.service";
import { Table } from "primeng/table";
import { Toast } from "../../../../../shared/services/toast.service";
import { finalize, tap } from "rxjs";
import { SessionService } from "../../../../../core/commons/components/service/session.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-cliente-listado',
  templateUrl: './cliente-listado.component.html',
    styleUrls: ["../../../tablePrime.scss", "../../../form.scss"],

})
export class ClienteListadoComponent {

  listUsuario?: Cliente;
  idCliente!: string;
  id!: string | null;
  clienteForm!: FormGroup;
  allClients: Cliente[] = [];
  selectedClient!: Cliente;
  paginatedUser: Cliente[] = [];

  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

  // puntosClientesUbicaciones: { longitud: string, latitud: string }[] = [];
  ngOnInit() {
    this.getUsers();
    this.updatePaginatedUser();
  }
  visible: boolean = false;
  isVisible = false;
  // @ViewChild('asGeocoder') asGeocoder!: ElementRef;
  constructor(
    private render2: Renderer2,
    private mapService: MapaClientDetailUbacionService,
    private fb: FormBuilder,
    private mapaService: MapaService,
    private UserS: ClientesService,
    private router: ActivatedRoute,
    private rou: Router,
    private toast: Toast,
    private ngxUiLoaderService: NgxUiLoaderService,
    private sessionService: SessionService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", Validators.required],
      estatus: ["", Validators.required],
      numCasa: ["", Validators.required],
      telefono: ["", Validators.required],
      longitud: ["", Validators.required],
      latitud: ["", Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get("id");
  }

  onGlobalFilter(event: Event) {
    // const value = event.target as HTMLInputElement;
    const value = (event.target as HTMLInputElement).value.toLowerCase();

    if (value) {
      const filteredData = this.allClients.filter(
        (c) =>
          c.nombre.toLowerCase().includes(value) ||
          c.email.toLowerCase().includes(value) ||
          c.telefono.toLowerCase().includes(value) ||
          c.municipio.toLowerCase().includes(value) ||
          c.colonia.toLowerCase().includes(value)
      );

      this.totalRecords = filteredData.length;
      this.paginatedUser = filteredData.slice(
        this.first,
        this.first + this.rows
      );
    } else {
      this.totalRecords = this.allClients.length;
      this.paginatedUser = this.allClients.slice(
        this.first,
        this.first + this.rows
      );

      // this.dt2.filterGlobal(input.value, "contains");
    }
  }

  redirectToAdmin(route: string): void {
    console.log(route);
    if (route === "login") {
      this.rou.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      this.rou.navigate(["/purificadoraAdm", route]); // Navegación hacia otras páginas públicas
    }
  }
  redirecTo(route: string): void {
    this.rou.navigate(["/purificadoraAdm/cliente/", route]);
  }

  editar(id: any) {
    this.visible = true;
    this.idCliente = this.router.snapshot.params["id"];
    if (id !== null) {
      console.log("actualizar....");
      this.UserS.detalleClienteById(id).subscribe((data) => {
        this.listUsuario = data;
        this.clienteForm.setValue({
          nombre: data.nombre,
          email: data.email,
          estatus: data.estatus,
          numCasa: data.numCasa,
          telefono: data.telefono,
          latitud: data.latitud,
          longitud: data.longitud,
        });
      });
    }
  }
  filterText: string = "";
  // resaltado de texto letra o palabra entonctrada
  highlightText(text: string): string {
    if (!this.filterText) {
      return text; // Si no hay texto a filtrar, regresa el texto original.
    }

    const regex = new RegExp(`(${this.filterText})`, "gi"); // Crea una expresión regular para encontrar el texto de búsqueda.
    return text.replace(regex, "<strong>$1</strong>"); // Reemplaza las coincidencias con el texto en negritas.
  }

  actualizarCliente(id: any) {
    if (this.clienteForm.valid) {
      this.UserS.updateUsuario(id, this.clienteForm.value).subscribe(
        (response) => {
          this.getUsers();
          this.visible = false;

          this.toast.showToastPmNgInfo("Usuario actualizado");

          console.log("Usuario actualizado:", response);
        },
        (error) => {
          console.error("Error al actualizar el usuario:", error);
        }
      );
    }
  }

  getUsers() { this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
      const idPurificadora = userData;
    
    this.UserS.obtenerCLientesByIdPurificadora(idPurificadora).subscribe(
      (data: Cliente[]) => {
        this.allClients = data;
        this.totalRecords = this.allClients.length;
        this.updatePaginatedUser();
      },
      (error) => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

 eliminarUsuario(id: any) {
  this.UserS.eliminarCliente(id).pipe(
    tap((data) => {
      // Aquí puedes manejar los datos de la respuesta si es necesario
      this.toast.showToastPmNgInfo('Eliminación exitosa')
    }),
    finalize(() => {
      // Acción a realizar al finalizar la operación, independientemente del éxito o error
      this.getUsers(); // Actualizar la lista de usuarios
    })
  ).subscribe(
    (data) => {
      // Acción a realizar en caso de éxito
      this.toast.showToastPmNgError('Eliminado del registro.');
    },
    (error) => {
      // Acción a realizar en caso de error
      console.error('Error al eliminar', error);
    }
  );
}
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedUser();
  }

  updatePaginatedUser() {
    this.paginatedUser = this.allClients.slice(
      this.first,
      this.first + this.rows
    );
  }

}

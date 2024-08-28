import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SessionService } from '../../../../core/commons/components/service/session.service';
import { ClientesService } from "../../../../shared/services/clientes.service";
import { MenuItem } from "primeng/api";
import { StorageService } from "../../../../core/commons/components/service/storage.service";

@Component({
  selector: "app-adm-home",
  templateUrl: "./adm-home.view.html",
  styleUrls: [
    "../../adm-purificadora.component.scss",
    "./adm-home.view.scss",
    "./menuLateral.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AdmHomeView implements OnInit {
  openSubmenu: string | null = null;
  activeLink: HTMLElement | null = null;
  setActiveLink(event: Event): void {
    const target = event.currentTarget as HTMLElement;

    if (this.activeLink) {
      this.activeLink.classList.remove("m-tree__itemContent__selected");
    }

    target.classList.add("m-tree__itemContent__selected");
    this.activeLink = target;
  }

  toggleSubmenu(submenuId: string) {
    this.openSubmenu = this.openSubmenu === submenuId ? null : submenuId;
  }

  fecha: string;
  fechaTexto: string;
  fechaSeleccionada: Date;
  mostrarCalendario: boolean = false;
  id!: string;
  data: any = {};

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;




  constructor(
    private storageService: StorageService,
    private clientesService: ClientesService
    , private router: Router, private sessionService: SessionService,
    private ngxService: NgxUiLoaderService,) {
    this.fechaSeleccionada = new Date(); // Puedes inicializar con la fecha actual o la que necesites
    this.fecha = this.obtenerFechaYYYYMMDD();
    this.fechaTexto = this.obtenerFechaTexto();
  }

  toggleCalendar() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  ngOnInit() {
    this.getData()
    this.items = [
      { label: 'Electronics' },
      { label: 'Computer' },
      { label: 'Accessories' },
      { label: 'Keyboard' },
      { label: 'Wireless' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    // console.log(this.obtenerFechaYYYYMMDD()); // Output: "Viernes / Junio / 2024" (para la fecha actual)
  }

  getData(): void {
    this.ngxService.start();
    const userData = this.sessionService.getId();
    console.log("userData=>", userData)
    if (userData) {
      this.id = userData;
      console.log("id=>", this.id)
      if (this.id) {
        this.clientesService.purificadora(this.id).subscribe((data) => {
          this.data = data;
          console.log(data)
        })
      }
    }
  }


  redirectToAdminPurificadora(route: string): void {
    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm");
      this.router.navigate(["/purificadoraAdm", route]); // Navegación hacia otras páginas públicas
    }
  }

  logout() {
    this.storageService.removeItem('token');
    // Opcional: hacer una solicitud al backend para manejar cualquier estado del lado del servidor
    this.router.navigate(["/auth/login"]); // Redirigir a la página de inicio de sesión
  }

  redirectToCotrolClientes(route: string): void {
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm");
      this.router.navigate(["/purificadoraAdm/cliente", route]); // Navegación hacia otras páginas públicas
    }
  }
  redirectToRolEmpleado(route: string): void {
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm");
      this.router.navigate(["/purificadoraAdm/cliente", route]); // Navegación hacia otras páginas públicas
    }
  }

  redirectToCotrolRepartidores(route: string): void {
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm");
      this.router.navigate(["/purificadoraAdm/repartidor", route]); // Navegación hacia otras páginas públicas
    }
  }
  redirectToCotrolRutas(route: string): void {
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm");
      this.router.navigate(["/purificadoraAdm/ruta", route]); // Navegación hacia otras páginas públicas
    }
  }

  redirectToCotrolVehiculo(route: string): void {
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm");
      this.router.navigate(["/purificadoraAdm/vehiculo", route]); // Navegación hacia otras páginas públicas
    }
  }
  obtenerFechaYYYYMMDD() {
    let fecha = new Date();
    let año = fecha.getFullYear();
    let mes = String(fecha.getMonth() + 1).padStart(2, "0");
    let dia = String(fecha.getDate()).padStart(2, "0");

    return `${dia}-${mes}-${año}`;
  }

  obtenerFechaTexto() {
    let diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    let meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    let fecha = new Date();
    let diaSemana = diasSemana[fecha.getDay()];
    let mes = meses[fecha.getMonth()];
    let año = fecha.getFullYear();
    return `${diaSemana} / ${mes} / ${año}`;
  }
}

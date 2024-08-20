import { Component, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-adm-home",
  templateUrl: "./adm-home.view.html",
  styleUrls: ["./adm-home.view.scss", "./menu.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AdmHomeView {
  openSubmenu: string | null = null;
  activeLink: HTMLElement | null = null;

  mostrarCalendario: boolean = false;

  constructor(private router: Router) {
  }
   activeMenu: string = '';


  ngOnInit() {}
  toggleMenu(menu: string): void {
    this.activeMenu = this.activeMenu === menu ? '' : menu;
  }

 
navigateTo(event: Event, route: string): void {
  event.stopPropagation(); // Evitar la propagación del clic
  this.router.navigate([route]);
}

  redirectToAdmin(route: string): void {
    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route);
    if (route === "login") {
      this.router.navigate(["/auth/login"]); // Navegación hacia la página de inicio de sesión
    } else {
      this.router.navigate(["/admin", route]); // Navegación hacia otras páginas públicas
    }
  }
  


  setActiveLink(event: Event): void {
    const target = event.currentTarget as HTMLElement;

    if (this.activeLink) {
      this.activeLink.classList.remove("m-tree__itemContent__selected");
    }

    target.classList.add("m-tree__itemContent__selected");
    this.activeLink = target;
  }
  logout() {
    // Eliminar el token del almacenamiento
    localStorage.removeItem("token"); // o sessionStorage.removeItem('token');
    // Opcional: hacer una solicitud al backend para manejar cualquier estado del lado del servidor
    this.router.navigate(["/auth/login"]); // Redirigir a la página de inicio de sesión
  }
}

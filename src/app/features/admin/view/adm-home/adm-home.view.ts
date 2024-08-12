import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.view.html',
  styleUrls: ['./adm-home.view.scss','./menu.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmHomeView {

  openSubmenu: string | null = null;
activeLink: HTMLElement | null = null;


  fecha: string;
  fechaTexto: string;
  fechaSeleccionada: Date;
  mostrarCalendario: boolean = false;

  // basicData: any;

  // basicOptions: any;

  constructor(private router: Router){

      this.fechaSeleccionada = new Date(); // Puedes inicializar con la fecha actual o la que necesites
    this.fecha = this.obtenerFechaYYYYMMDD();
    this.fechaTexto = this.obtenerFechaTexto();
  }

  
  ngOnInit() {
    // const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');
    // const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    // const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // this.basicData = {
    //   labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    //   datasets: [
    //     {
    //       label: 'Sales',
    //       data: [540, 325, 702, 620],
    //       backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
    //       borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
    //       borderWidth: 1
    //     }
    //   ]
    // };

  //   this.basicOptions = {
  //     plugins: {
  //       legend: {
  //         labels: {
  //           color: textColor
  //         }
  //       }
  //     },
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //         ticks: {
  //           color: textColorSecondary
  //         },
  //         grid: {
  //           color: surfaceBorder,
  //           drawBorder: false
  //         }
  //       },
  //       x: {
  //         ticks: {
  //           color: textColorSecondary
  //         },
  //         grid: {
  //           color: surfaceBorder,
  //           drawBorder: false
  //         }
  //       }
  //     }
  //   };
   }


  redirectToAdmin(route: string): void {

    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      this.router.navigate(['/admin', route]) // Navegación hacia otras páginas públicas
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


setActiveLink(event: Event): void {
    const target = event.currentTarget as HTMLElement;

    if (this.activeLink) {
      this.activeLink.classList.remove('m-tree__itemContent__selected');
    }

    target.classList.add('m-tree__itemContent__selected');
    this.activeLink = target;
  }
  logout() {
    // Eliminar el token del almacenamiento
    localStorage.removeItem("token"); // o sessionStorage.removeItem('token');
    // Opcional: hacer una solicitud al backend para manejar cualquier estado del lado del servidor
    this.router.navigate(["/auth/login"]); // Redirigir a la página de inicio de sesión
  }
}

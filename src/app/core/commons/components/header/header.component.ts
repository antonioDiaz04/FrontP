import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  sidebarVisible: boolean = false;
  visle: boolean = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.visle = false;

  }

  constructor(private renderer: Renderer2, private router: Router) {
    // this.checkIsMobile()
    // window.addEventListener('scroll', () => {
    //   this.isScrolled = window.scrollY > 0
    // })
    // window.addEventListener('resize', () => {
    //   this.checkIsMobile()
    // })
  }


  sidebarVisible2: boolean = false;

  // constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  ngOnInit() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    if (window.innerWidth < 768) { // Cambia el valor a tu criterio para determinar cuándo consideras que es un dispositivo móvil
      this.sidebarVisible2 = true;
    } else {
      this.sidebarVisible2 = false;
    }
  }

  redirectTo(route: string): void {

    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      this.router.navigate(['/public', route]) // Navegación hacia otras páginas públicas
    }
  }
}

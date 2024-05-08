import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  constructor( private router: Router) {
    // this.checkIsMobile()
    // window.addEventListener('scroll', () => {
    //   this.isScrolled = window.scrollY > 0
    // })
    // window.addEventListener('resize', () => {
    //   this.checkIsMobile()
    // })
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

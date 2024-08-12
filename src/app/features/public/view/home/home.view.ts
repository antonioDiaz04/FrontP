import { Component, HostListener, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.view.html',
  styleUrl: './home.view.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeView implements OnInit {

  constructor(private router: Router,private renderer: Renderer2) { }

  ngOnInit(): void {
    // this.checkButtonPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkButtonPosition();
  }
checkButtonPosition() {

    const button = this.renderer.selectRootElement('#vibrating-title', true);

    if ( button) {

      const buttonTop = button.getBoundingClientRect().top;

      // Si el botón está cerca del top del header (ajusta el margen según sea necesario)
      if (buttonTop <=  50) {
        this.renderer.addClass(button, 'vibrate');
      } else {
        this.renderer.removeClass(button, 'vibrate');
      }
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

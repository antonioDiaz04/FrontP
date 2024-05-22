import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-purificadora',
  templateUrl: './adm-purificadora.component.html',
  styleUrl: './adm-purificadora.component.css'
})
export class AdmPurificadoraComponent {


  constructor(private router: Router) { }

  redirectTo(route: string): void {
    // this.sidebarVisible = false;
    this.router.navigate(['/purificadoraAdm', route]); // Utiliza la navegación de Angular
  }

  
}

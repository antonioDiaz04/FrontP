import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.view.html',
  styleUrls: ['./entregas.view.css']  // Asegúrate de que sea "styleUrls" en plural
})
export class EntregasView {
  constructor(private router: Router) {}

  navigateToList() {
    this.router.navigate(['repartidor/clientes']);  // Ajusta esta ruta según tus necesidades
  }
}

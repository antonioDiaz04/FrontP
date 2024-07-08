import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.view.html',
  styleUrls: ['./opciones.view.css']
})
export class OpcionesView {

  constructor(private router: Router) {}

  rutaAsignada() {
    this.router.navigate(['repartidor/ruta-entrega']);  // Ajusta esta ruta según tus necesidades
  }

  rutaPredeterminada() {
    this.router.navigate(['repartidor/qr']);  // Ajusta esta ruta según tus necesidades
  }

}

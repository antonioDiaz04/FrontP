import { Component, ViewEncapsulation, OnInit } from '@angular/core';
// import { UsuariosclientesService } from '../../../../shared/services/usuariosclientes.service';

@Component({
  selector: 'app-control-entregas',
  templateUrl: './control-entregas.view.html',
  styleUrl: './control-entregas.view.css',
  encapsulation: ViewEncapsulation.None
})
export class ControlEntregasView implements OnInit{

  
  ngOnInit() {
    this.getDetalleClienteyEntrega()
  }
  
getDetalleClienteyEntrega(){


}


}

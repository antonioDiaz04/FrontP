import { Component, ViewEncapsulation, OnInit } from '@angular/core';
// import { UsuariosclientesService } from '../../../../shared/services/usuariosclientes.service';

@Component({
  selector: 'app-control-entregas',
  templateUrl: './control-entregas.view.html',
  styleUrl: './control-entregas.view.scss',
  encapsulation: ViewEncapsulation.None
})
export class ControlEntregasView implements OnInit{

  // constructor(private UserS:UsuariosclientesService)
  // {

  // }

  ngOnInit() {
    this.getDetalleClienteyEntrega()
  }
  
getDetalleClienteyEntrega(){


  // console.log("ocurrio un error al obtener la información");
  // // getUsuarios
  // this.UserS.getUsuarios().subscribe(data => {
    
  //   console.log(data)
  // }, error=>{
  //   console.log("ocurrio un error", error)
  // }
  // )
  
}


}

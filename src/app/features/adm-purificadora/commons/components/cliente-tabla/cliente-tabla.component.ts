import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { UsuariosclientesService } from '../../../../../shared/services/usuariosclientes.service';
import { ClientesService } from '../../../../../shared/services/clientes.service';

@Component({
  selector: 'app-cliente-tabla',
  templateUrl: './cliente-tabla.component.html',
  styleUrl: './cliente-tabla.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ClienteTablaComponent implements OnInit{
  
  ngOnInit(): void {
    this.getUsers();
  }
  
  isVisible = false;

  constructor(private UserS:ClientesService,private router:Router) { }
redirectToAdmin(route: string): void {

    // this.sidebarVisible2 = !this.sidebarVisible2
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      this.router.navigate(['/admin', route]) // Navegación hacia otras páginas públicas
    }
  }
  



  getUsers() {
   console.log("ocurrio un error al obtener la información");
  // getUsuarios
    this.UserS.obtenerPurificadoras().subscribe(data => {
    
    console.log(data)
  }, error=>{
    console.log("ocurrio un error", error)
  }
  )
    
}


}

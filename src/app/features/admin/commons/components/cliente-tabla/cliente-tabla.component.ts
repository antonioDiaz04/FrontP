import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { Purificadora } from '../../../../../shared/models/purificadora.model';

@Component({
  selector: 'app-cliente-tabla',
  templateUrl: './cliente-tabla.component.html',
  styleUrls:[ './cliente-tabla.component.scss','./p-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteTablaComponent implements OnInit {



  allPurificadoras: Purificadora[] = [] // Mantén una copia original de todos los productos

  ngOnInit(): void {
    this.getUsers();
  }


  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  isVisible = false;

  constructor( private renderer2:Renderer2,private UserS: ClientesService, private router: Router) { }
  redirectToAdmin(route: string): void {
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


      this.allPurificadoras = data;
      console.log("nombre", data.purificadoraNombre)
    }, error => {
      console.log("ocurrio un error", error)
    }
    )

  }

  eliminarUsuario(id: any) {
    this.UserS.eliminarPurificadora(id).subscribe(data => {
      console.log("eliminado")
      this.getUsers();

    }, error => {
      console.log("ocurrio un error", error)
      
    })
    
  }

}

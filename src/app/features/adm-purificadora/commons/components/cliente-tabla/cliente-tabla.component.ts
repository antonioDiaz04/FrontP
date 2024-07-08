import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UsuariosclientesService } from '../../../../../shared/services/usuariosclientes.service';
import { ClientesService } from '../../../../../shared/services/clientes.service';
import { Cliente } from '../../../../../shared/interfaces/client.interface';
import { MapaService } from '../../services/mapa.service';
import { Usuario } from '../../../../../shared/models/usuario.model';
import { MapaClientDetailUbacionService } from '../../services/mapaClientDetalle.service';
@Component({
  selector: 'app-cliente-tabla',
  templateUrl: './cliente-tabla.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss', '../../../form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteTablaComponent implements OnInit {
  listUsuario?: Cliente;
  idCliente!: string
  id!: string | null
  clienteForm!: FormGroup;
  allClients: Cliente[] = []
  // puntosClientesUbicaciones: { longitud: string, latitud: string }[] = [];
  ngOnInit(){
    this.getUsers();
    // this.mapaService.setUbicaciones(this.puntosClientesUbicaciones)
  }
  visible: boolean = false;
  isVisible = false;
  // @ViewChild('asGeocoder') asGeocoder!: ElementRef;
  constructor(private render2: Renderer2, private mapService: MapaClientDetailUbacionService, private fb: FormBuilder, private mapaService: MapaService, private UserS: ClientesService, private router: ActivatedRoute, private rou: Router) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      estatus: ['', Validators.required],
      numCasa: ['', Validators.required],
      telefono: ['', Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get('id');
  }

  redirectToAdmin(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.rou.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      this.rou.navigate(['/purificadoraAdm', route]) // Navegación hacia otras páginas públicas
    }
  }

  editar(id: any) {

    this.visible = true;
    this.idCliente = this.router.snapshot.params['id'];
    if (id !== null) {
      console.log("actualizar....")
      this.UserS.detalleClienteById(id).subscribe((data) => {
        this.listUsuario = data;
        this.clienteForm.setValue({
          nombre: data.nombre,
          email: data.email,
          estatus: data.estatus,
          numCasa: data.numCasa,
          telefono: data.telefono
        });
      });
    }
  }

  actualizarCliente(id: any) {
    if (this.clienteForm.valid) {
      this.UserS.updateUsuario(id, this.clienteForm.value)
        .subscribe(response => {
          this.getUsers()
          this.visible = false;
          console.log('Usuario actualizado:', response);
        }, error => {
          console.error('Error al actualizar el usuario:', error);
        });
    }
  }

  getUsers() {
    this.UserS.obtenerCLientes().subscribe(
      (data: Cliente[]) => {
        this.allClients = data;
     
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  eliminarUsuario(id: any) {
    this.UserS.eliminarCliente(id).subscribe(data => {
      console.log("eliminado")
      this.getUsers();
      // this.mapaService.setUbicaciones(this.puntosClientesUbicaciones)
    }, error => {
      console.log("ocurrio un error", error)
    })
  }


}

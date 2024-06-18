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
  // styleUrls: ['./cliente-tabla.component.css', './form.scss', './p-dialog.scss'],
  styleUrls: ['../../../adm-purificadora.component.scss', './form.scss', './p-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteTablaComponent implements OnInit {
  listUsuario?: Cliente;
  idCliente!: string
  id!: string | null

  clienteForm!: FormGroup;

  allClients: Cliente[] = []
  paginatedClients: Cliente[] = []
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

  visible: boolean = false;
  isVisible = false;

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;


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
  ngOnInit(): void {
    this.getUsers();
    this.updatePaginatedClients();
  }
  redirectToAdmin(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.rou.navigate(['/auth/login'])
    } else {
      this.rou.navigate(['/purificadoraAdm', route])
    }
  }

  editar(id: any) {
    this.visible = true;
    this.idCliente = this.router.snapshot.params['id'];
    if (id !== null) {
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
          this.getUsers();
          this.visible = false;
          console.log('Usuario actualizado:', response);
        }, error => {
          console.error('Error al actualizar el usuario:', error);
        });
    }
  }

  getUsers() {
    this.UserS.obtenerCLientes().subscribe(
      data=> {
        this.allClients = data;
        this.totalRecords = this.allClients.length;
        this.updatePaginatedClients();
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedClients();
  }

  updatePaginatedClients() {
    this.paginatedClients = this.allClients.slice(this.first, this.first + this.rows);
  }



  eliminarUsuario(id: any) {
    this.UserS.eliminarCliente(id).subscribe(data => {
      console.log("eliminado")
      this.getUsers();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

}

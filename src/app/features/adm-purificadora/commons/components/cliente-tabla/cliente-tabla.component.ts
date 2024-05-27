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

import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { UsuariosclientesService } from '../../../../../shared/services/usuariosclientes.service';
import { ClientesService } from '../../../../../shared/services/clientes.service';
import { Cliente } from '../../../../../shared/interfaces/client.interface';
import { MapaService } from '../../services/mapa.service';
import { Usuario } from '../../../../../shared/models/usuario.model';
import { MapaClientDetailUbacionService } from '../../services/mapaClientDetalle.service';
@Component({
  selector: 'app-cliente-tabla',
  templateUrl: './cliente-tabla.component.html',
  styleUrls: ['./cliente-tabla.component.css', './p-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteTablaComponent implements OnInit {
  listUsuario?: Cliente;
  idCliente!: string
  id!: string | null

  clienteForm!: FormGroup;

  allClients: Cliente[] = []
  puntosClientesUbicaciones: { longitud: string, latitud: string }[] = [];
  ngOnInit(): void {
    this.getUsers();
  }
  visible: boolean = false;
  isVisible = false;

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;


  constructor(private render2:Renderer2,private mapService: MapaClientDetailUbacionService,private fb: FormBuilder, private mapaService: MapaService, private UserS: ClientesService, private router: ActivatedRoute, private rou: Router) {
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
    this.mapService.buildMap()
      .then(({ geocoder, map }) => {
        this.render2.appendChild(this.asGeocoder.nativeElement, geocoder.onAdd(map));
        console.log('Perfecto |');
      })
      .catch((err) => {
        console.log('Error *** ', err);
      });
    this.mapService.cbAddress.subscribe((getPoint) => {

      console.log('*** getPoint', getPoint)
    })

    this.visible = true;
      this.idCliente = this.router.snapshot.params['id'];
    if (id !== null) {
    console.log("actualizar....")
      this.UserS.detalleProductoById(id).subscribe((data) => {
            this.listUsuario = data;
        this.clienteForm.setValue({
          nombre: data.nombre,
          email: data.email,
          estatus: data.estatus,
          numCasa: data.numCasa,
          telefono: data.telefono
          // imagen: data.imagen
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
        this.puntosClientesUbicaciones = data.map(cliente => ({
          longitud: cliente.longitud,
          latitud: cliente.latitud
        }));
        console.log("longitudes y latitudes =>", this.puntosClientesUbicaciones);
        this.mapaService.setUbicaciones(this.puntosClientesUbicaciones)
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
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  iniciarMapa(){
    this.mapService.latitudLongitudCambiadas.subscribe(({ latitud, longitud }) => {
      this.clienteForm.get('latitud')?.setValue(latitud);
      this.clienteForm.get('longitud')?.setValue(longitud);
    });



    this.mapService.buildMap()
      .then(({ geocoder, map }) => {
        this.render2.appendChild(this.asGeocoder.nativeElement, geocoder.onAdd(map));
        console.log('Perfecto |');
      })
      .catch((err) => {
        console.log('Error *** ', err);
      });
    this.mapService.cbAddress.subscribe((getPoint) => {

      console.log('*** getPoint', getPoint)
    })


  }
}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { Repartidor } from '../../../../../shared/interfaces/repartidor.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-repartidores-listado',
  templateUrl: './repartidores-listado.component.html',
  styleUrls: ['./repartidores-listado.component.scss', './form.scss']
})
export class RepartidoresListadoComponent implements OnInit {
  visible: boolean = false;
  isVisible = false;
  id!: string | null
  allRepartidores?: Repartidor[];
  listRepartidor?: Repartidor;
  idRepartidor!: string
  usuarioForm!: FormGroup;
  reparitorForm!: FormGroup;
  constructor(private fb: FormBuilder, private repService: RepartidoresService, private render2: Renderer2, private router: ActivatedRoute, private rou: Router) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      numCasa: ['', Validators.required],
      telefono: ['', Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getRepartidores();
  }

  editar(id: any) {
    this.visible = true;
    this.idRepartidor = this.router.snapshot.params['id'];
    if (id !== null) {
      console.log("actualizar....")
      this.repService.detalleUsuarioById(id).subscribe((data) => {
        this.listRepartidor = data;
        this.usuarioForm.setValue({
          nombre: data.nombre,
          email: data.email,
          // estatus: data.estatus,
          numCasa: data.numCasa,
          telefono: data.telefono
        });
      });
    }
  }

  actualizarCliente(id: any) {
    if (this.usuarioForm.valid) {
      this.repService.updateRepartidora(id, this.usuarioForm.value)
        .subscribe(response => {
          this.getRepartidores()
          this.visible = false;
          console.log('Usuario actualizado:', response);
        }, error => {
          console.error('Error al actualizar el usuario:', error);
        });
    }
  }

  eliminarUsuario(id: any) {
    this.repService.eliminarRepartidores(id).subscribe(data => {
      console.log("eliminado")
      this.getRepartidores();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  getRepartidores() {
    this.repService.getRepartidores().subscribe(
      data => {
        this.allRepartidores = data;
        console.log(this.allRepartidores);
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }
}

import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehiculo } from '../../../../../shared/models/vehiculo.model';

@Component({
  selector: 'app-vehiculo-listado',
  templateUrl: './vehiculo-listado.component.html',
  styleUrls: ['./vehiculo-listado.component.css','./form.scss']
})
export class VehiculoListadoComponent {
  visible: boolean = false;
  isVisible = false;
  id!: string | null
  allRepartidores?: Vehiculo[];
  dataVehiculo?: Vehiculo;
  idRepartidor!: string
  vehiculoForm!: FormGroup;
  // reparitorForm!: FormGroup;
  constructor(private fb: FormBuilder, private repService: VehiculoService, private render2: Renderer2, private router: ActivatedRoute, private rou: Router) {
    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      placas: ['', Validators.required],
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
      this.repService.detalleVehiculoById(id).subscribe((data) => {
        this.dataVehiculo = data;
        this.vehiculoForm.setValue({
          marca: data.marca,
          modelo: data.modelo,
          anio: data.anio,
          placas: data.placas
        });
      });
    }
  }

  actualizarVehiculo(id: any) {
    if (this.vehiculoForm.valid) {
      this.repService.updateVehiculo(id, this.vehiculoForm.value)
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
    this.repService.eliminarVehiculo(id).subscribe(data => {
      console.log("eliminado")
      this.getRepartidores();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  getRepartidores() {
    this.repService.getVehiculos().subscribe(
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

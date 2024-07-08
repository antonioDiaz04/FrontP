import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehiculo } from '../../../../../shared/models/vehiculo.model';

@Component({
  selector: 'app-vehiculo-listado',
  templateUrl: './vehiculo-listado.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss', '../../../form.scss']
})
export class VehiculoListadoComponent {
  visible: boolean = false;
  isVisible = false;
  id!: string | null
  allVehiculos: Vehiculo[] =[];
  dataVehiculo?: Vehiculo;
  idRepartidor!: string
  vehiculoForm!: FormGroup;
  // reparitorForm!: FormGroup;


  paginatedClients: Vehiculo[] = []
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

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
    this.getVehiculos();
    this.updatePaginatedClients();
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
          this.getVehiculos()
          this.visible = false;
          console.log('Usuario actualizado:', response);
        }, error => {
          console.error('Error al actualizar el usuario:', error);
        });
    }
  }

  eliminar(id: any) {
    this.repService.eliminarVehiculo(id).subscribe(data => {
      console.log("eliminado")
      this.getVehiculos();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }


  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedClients();
  }

  updatePaginatedClients() {
    this.paginatedClients = this.allVehiculos.slice(this.first, this.first + this.rows);
  }


  
  getVehiculos() {
    this.repService.getVehiculos().subscribe(
      data => {
        this.allVehiculos = data;
        this.totalRecords = this.allVehiculos.length;
        this.updatePaginatedClients();
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }
}

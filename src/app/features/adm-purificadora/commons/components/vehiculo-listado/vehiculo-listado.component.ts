import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehiculo } from '../../../../../shared/models/vehiculo.model';
import { Toast } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-vehiculo-listado',
  templateUrl: './vehiculo-listado.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss', '../../../form.scss'],
})
export class VehiculoListadoComponent {
  visible: boolean = false;
  isVisible = false;
  id!: string | null;
  allVehiculos: Vehiculo[] = [];
  dataVehiculo?: Vehiculo;
  idRepartidor!: string;
  vehiculoForm!: FormGroup;
  // reparitorForm!: FormGroup;
  dias: string[] = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ];

  diasSeleccionados: string[] = [];

  diasAsignados: { [key: string]: boolean } = {};

  paginatedVehiculo: Vehiculo[] = [];
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

  constructor(
    private fb: FormBuilder,
    private toast: Toast,
    private repService: VehiculoService,
    private render2: Renderer2,
    private router: ActivatedRoute,
    private rou: Router
  ) {
    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placas: ['', Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getVehiculos();
    this.updatePaginatedVehiculo();
  }

  editar(id: any) {
    this.visible = true;
    this.idRepartidor = this.router.snapshot.params['id'];
    if (id !== null) {
      console.log('actualizar....');
      this.repService.detalleVehiculoById(id).subscribe((data) => {
        this.dataVehiculo = data;
        this.vehiculoForm.setValue({
          marca: data.marca,
          modelo: data.modelo,
          placas: data.placas,
        });
        this.diasAsignados = this.convertArrayToDiasAsignados(
          data.diasAsignados || []
        );
        this.diasSeleccionados = [...data.diasAsignados];
      });
    }
  }

  convertArrayToDiasAsignados(dias: string[]): { [key: string]: boolean } {
    const diasAsignados: { [key: string]: boolean } = {};
    this.dias.forEach((dia) => {
      diasAsignados[dia] = dias.includes(dia);
    });
    return diasAsignados;
  }
  actualizarVehiculo(id: any) {
    if (this.vehiculoForm.valid) {
      const marca = this.vehiculoForm.get('marca')?.value;
      const modelo = this.vehiculoForm.get('modelo')?.value;
      // const anio = this.vehiculoForm.get('anio')?.value;
      const placas = this.vehiculoForm.get('placas')?.value;
      const diasAsignados = this.diasSeleccionados;
      // Aquí puedes realizar las operaciones necesarias con el valor de 'marca'

      const VEHICULO: Vehiculo = {
        marca: this.vehiculoForm.get('marca')?.value,
        modelo: this.vehiculoForm.get('modelo')?.value,
        placas: this.vehiculoForm.get('placas')?.value,
        diasAsignados: diasAsignados,
      };

      this.repService.updateVehiculo(id, VEHICULO).subscribe(
        (response) => {
          this.getVehiculos();
          this.visible = false;

          this.toast.showToastPmNgSuccess('Se guardaron los cambios con exito');
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  eliminar(id: any) {
    this.repService.eliminarVehiculo(id).subscribe(
      (data) => {
        console.log('eliminado');
        this.getVehiculos();
      },
      (error) => {
        console.log('ocurrio un error', error);
      }
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedVehiculo();
  }

  updatePaginatedVehiculo() {
    this.paginatedVehiculo = this.allVehiculos.slice(
      this.first,
      this.first + this.rows
    );
  }

  getVehiculos() {
    this.repService.getVehiculos().subscribe(
      (data) => {
        this.allVehiculos = data;
        this.totalRecords = this.allVehiculos.length;
        this.updatePaginatedVehiculo();
      },
      (error) => {
        console.log('ocurrió un error al obtener la información', error);
      }
    );
  }

  onDiaSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    const dia = input.value;
    this.diasAsignados[dia] = isChecked;
    if (isChecked) {
      this.diasSeleccionados.push(dia);
    } else {
      const index = this.diasSeleccionados.indexOf(dia);
      if (index > -1) {
        this.diasSeleccionados.splice(index, 1);
      }
    }
    console.log('dias en as', this.diasAsignados[dia]);
    console.log('dias en seleccion', this.diasSeleccionados);
  }
}

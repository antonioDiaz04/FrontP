import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { Repartidor } from '../../../../../shared/interfaces/repartidor.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-repartidores-listado',
  templateUrl: './repartidores-listado.component.html',
  styleUrls: ['../../../adm-purificadora.component.scss', '../../../form.scss'],
})
export class RepartidoresListadoComponent implements OnInit {
  visible: boolean = false;
  isVisible = false;
  id!: string | null;
  allRepartidores: Repartidor[] = [];
  listRepartidor?: Repartidor;
  idRepartidor!: string;
  diasSeleccionados: string[] = [];

  diasAsignados: { [key: string]: boolean } = {};

  paginatedRepartidores: Repartidor[] = [];
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual
  dias: string[] = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ];
  // diasAsignados: { [key: string]: boolean } = {};

  usuarioForm!: FormGroup;
  reparitorForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toast: Toast,
    private repService: RepartidoresService,
    private render2: Renderer2,
    private router: ActivatedRoute,
    private rou: Router
  ) {
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
    this.updatePaginatedRepartidores();
  }

  editar(id: any) {
    let selectedRepartidor;
    this.visible = true;
    this.idRepartidor = this.router.snapshot.params['id'];

    if (id !== null) {
      console.log('actualizar....');

      this.repService.detalleUsuarioById(id).subscribe((data) => {
        this.listRepartidor = data;

        this.usuarioForm.setValue({
          nombre: data.nombre,
          email: data.email,
          numCasa: data.numCasa,
          telefono: data.telefono,
        });

        // Inicializar los checkboxes según los días asignados
        this.diasAsignados = this.convertArrayToDiasAsignados(
          data.diasAsignados || []
        );
        this.diasSeleccionados = [...data.diasAsignados];
      });
    }
  }

  // marcarCheckboxes(dos: string[]) {

  convertArrayToDiasAsignados(dias: string[]): { [key: string]: boolean } {
    const diasAsignados: { [key: string]: boolean } = {};
    this.dias.forEach((dia) => {
      diasAsignados[dia] = dias.includes(dia);
    });
    return diasAsignados;
  }
  // }

  actualizarCliente(id: any) {
    const diasAsignados = this.diasSeleccionados;

    const REPARTIDOR: Repartidor = {
      nombre: this.usuarioForm.get('nombre')?.value,
      email: this.usuarioForm.get('email')?.value,
      telefono: this.usuarioForm.get('telefono')?.value,
      password1: this.usuarioForm.get('password1')?.value,
      diasAsignados: diasAsignados,
    };

    this.repService.updateRepartidora(id, REPARTIDOR).subscribe(
      (response) => {
        this.visible = false;

        this.toast.showToastPmNgSuccess('Se guardaron los cambios con exito');
        // console.log('Usuario actualizado:', response);
        this.getRepartidores();
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
    // }
  }

  eliminarUsuario(id: any) {
    this.repService.eliminarRepartidores(id).subscribe(
      (data) => {
        this.getRepartidores();
      },
      (error) => {
        console.log('ocurrio un error', error);
      }
    );
  }

  getRepartidores() {
    this.repService.getRepartidores().subscribe(
      (data) => {
        this.allRepartidores = data;
        this.totalRecords = this.allRepartidores.length;
        this.updatePaginatedRepartidores();
      },
      (error) => {
        console.log('ocurrió un error al obtener la información', error);
      }
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedRepartidores();
  }

  updatePaginatedRepartidores() {
    this.paginatedRepartidores = this.allRepartidores.slice(
      this.first,
      this.first + this.rows
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

  // onRepartidorSelectionChange() {
  //   const selectedId = this.registroRuta.get('selectedRepartidor')?.value;
  //   console.log('ID del repartidor seleccionado:', selectedId);

  //   // Encuentra el repartidor seleccionado en la lista
  //   const selectedRepartidor = this.allRepartidores.find(repartidor => repartidor._id === selectedId);

  //   if (selectedRepartidor) {
  //     this.diasAsignados = {};
  //     selectedRepartidor.diasAsignados.forEach(dia => {
  //       this.diasAsignados[dia] = true;

  //       console.log(this.diasAsignados[dia])
  //     });
  //   } else {
  //     this.diasAsignados = {};
  //   }
  // }
}

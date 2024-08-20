import { Component, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VehiculoService } from "../../../../../shared/services/vehiculo.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Vehiculo } from "../../../../../shared/models/vehiculo.model";
import { Toast } from "../../../../../shared/services/toast.service";
import { Table } from "primeng/table";
import { SessionService } from "../../../../../core/commons/components/service/session.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-vehiculo-listado",
  templateUrl: "./vehiculo-listado.component.html",
  styleUrls: ["../../../tablePrime.scss", "../../../form.scss"],
})
export class VehiculoListadoComponent {
  @ViewChild("dt2") dt2!: Table;

  visible: boolean = false;
  isVisible = false;
  id!: string | null;
  allVehiculos: Vehiculo[] = [];
  dataVehiculo?: Vehiculo;
  idRepartidor!: string;
  vehiculoForm!: FormGroup;
  // reparitorForm!: FormGroup;
  dias: string[] = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  diasSeleccionados: string[] = [];

  diasAsignados: { [key: string]: boolean } = {};

  paginatedVehiculo: Vehiculo[] = [];
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual
  idPurificadora!: string;

  filterText: string = "";

  constructor(
    private fb: FormBuilder,
    private toast: Toast,
    private repService: VehiculoService,
    private render2: Renderer2,
    private router: ActivatedRoute,
    private rou: Router,
    private ngxUiLoaderService: NgxUiLoaderService,
    private sessionService: SessionService
  ) {
    this.vehiculoForm = this.fb.group({
      marca: ["", Validators.required],
      modelo: ["", Validators.required],
      placas: ["", Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.getVehiculos();
    this.updatePaginatedVehiculo();
    this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
    if (userData) {
      this.idPurificadora = userData;
    }
  }

  highlightText(text: string): string {
    if (!this.filterText) {
      return text; // Si no hay texto a filtrar, regresa el texto original.
    }

    const regex = new RegExp(`(${this.filterText})`, "gi"); // Crea una expresión regular para encontrar el texto de búsqueda.
    return text.replace(regex, "<strong>$1</strong>"); // Reemplaza las coincidencias con el texto en negritas.
  }

  redirecTo(route: string): void {
    this.rou.navigate(["/purificadoraAdm/vehiculo/", route]);
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();

    if (value) {
      const filteredData = this.allVehiculos.filter(
        (v) =>
          v.marca.toLowerCase().includes(value) ||
          v.modelo.toLowerCase().includes(value) ||
          v.placas.toLowerCase().includes(value)
      );

      this.totalRecords = filteredData.length;
      this.paginatedVehiculo = filteredData.slice(
        this.first,
        this.first + this.rows
      );
    } else {
      this.totalRecords = this.allVehiculos.length;
      this.paginatedVehiculo = this.allVehiculos.slice(
        this.first,
        this.first + this.rows
      );
    }
  }

  editar(id: any) {
    this.visible = true;
    this.idRepartidor = this.router.snapshot.params["id"];
    if (id !== null) {
      console.log("actualizar....");
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
      const marca = this.vehiculoForm.get("marca")?.value;
      const modelo = this.vehiculoForm.get("modelo")?.value;
      // const anio = this.vehiculoForm.get('anio')?.value;
      const placas = this.vehiculoForm.get("placas")?.value;
      const diasAsignados = this.diasSeleccionados;
      // Aquí puedes realizar las operaciones necesarias con el valor de 'marca'

      const VEHICULO: Vehiculo = {
      idPurificadora: this.idPurificadora,

        marca: this.vehiculoForm.get("marca")?.value,
        modelo: this.vehiculoForm.get("modelo")?.value,
        placas: this.vehiculoForm.get("placas")?.value,
        diasAsignados: diasAsignados,
      };

      this.repService.updateVehiculo(id, VEHICULO).subscribe(
        (response) => {
          this.getVehiculos();
          this.visible = false;

          this.toast.showToastPmNgSuccess("Se guardaron los cambios con exito");
        },
        (error) => {
          console.error("Error al actualizar el vehiculo:", error);
        }
      );
    }
  }

  eliminar(id: any) {
    this.repService.eliminarVehiculo(id).subscribe(
      (data) => {
        this.toast.showToastPmNgInfo("Eliminado con exito");
        this.getVehiculos();
      },
      (error) => {
        console.log("ocurrio un error", error);
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
    this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
    if (userData) {
      const idPurificadora = userData;
      this.repService.getVehiculosByIdPurificadora(idPurificadora).subscribe(
        (data) => {
          this.allVehiculos = data;
          this.totalRecords = this.allVehiculos.length;
          this.updatePaginatedVehiculo();
        },
        (error) => {
          console.log("ocurrió un error al obtener la información", error);
        }
      );
    }
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
    console.log("dias en as", this.diasAsignados[dia]);
    console.log("dias en seleccion", this.diasSeleccionados);
  }
}

import { Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RepartidoresService } from "../../../../../shared/services/rapartidores.service";
import { Repartidor } from "../../../../../shared/interfaces/repartidor.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Toast } from "../../../../../shared/services/toast.service";
import { Table } from "primeng/table";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SessionService } from "../../../../../core/commons/components/service/session.service";

@Component({
  selector: "app-repartidores-listado",
  templateUrl: "./repartidores-listado.component.html",
  styleUrls: ["../../../tablePrime.scss", "../../../form.scss"],
})
export class RepartidoresListadoComponent implements OnInit {
  visible: boolean = false;
  isVisible = false;
  id!: string | null;
  allRepartidores: Repartidor[] = [];
  listRepartidor?: Repartidor;
  idRepartidor!: string;
  diasSeleccionados: string[] = [];
  @ViewChild("dt2") dt2!: Table;

  diasAsignados: { [key: string]: boolean } = {};

  paginatedRepartidores: Repartidor[] = [];
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual
  dias: string[] = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];
  // diasAsignados: { [key: string]: boolean } = {};
  filterText: string = "";
  usuarioForm!: FormGroup;
  reparitorForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toast: Toast,
    private repService: RepartidoresService,
    private render2: Renderer2,
    private router: ActivatedRoute,
    private rou: Router,
    private ngxUiLoaderService: NgxUiLoaderService,
    private sessionService: SessionService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", Validators.required],
      numCasa: ["", Validators.required],
      telefono: ["", Validators.required],
      password1: ["", Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getRepartidores();
    this.updatePaginatedRepartidores();
  }
  redirecTo(route: string): void {
    this.rou.navigate(["/purificadoraAdm/repartidor/", route]);
  }

  onGlobalFilter(event: Event) {
    // const value = event.target as HTMLInputElement;
    const value = (event.target as HTMLInputElement).value.toLowerCase();

    if (value) {
      const filteredData = this.allRepartidores.filter(
        (v) =>
          v.nombre.toLowerCase().includes(value) ||
          v.telefono.toLowerCase().includes(value) ||
          v.email.toLowerCase().includes(value)
      );

      this.totalRecords = filteredData.length;
      this.paginatedRepartidores = filteredData.slice(
        this.first,
        this.first + this.rows
      );
    } else {
      this.totalRecords = this.allRepartidores.length;
      this.paginatedRepartidores = this.allRepartidores.slice(
        this.first,
        this.first + this.rows
      );
    }
  }
  highlightText(text: string): string {
    //  console.log(`El tipo de dato de 'text' es: ${typeof text}`); // Esto mostrará el tipo de dato de 'text' en la consola.
    if (!this.filterText) {
      // console.log("aqui pasa")
      return text; // Si no hay texto a filtrar, regresa el texto original.
    }

    const regex = new RegExp(`(${this.filterText})`, "gi"); // Crea una expresión regular para encontrar el texto de búsqueda.
    return text.replace(regex, '<strong class="resaltado">$1</strong>'); // Reemplaza las coincidencias con el texto en negritas.
  }

  editar(id: any) {
    let selectedRepartidor;
    this.visible = true;
    this.idRepartidor = this.router.snapshot.params["id"];

    if (id !== null) {
      this.repService.detalleUsuarioById(id).subscribe((data) => {
        this.listRepartidor = data;

        this.usuarioForm.setValue({
          nombre: data.nombre,
          email: data.email,
          numCasa: data.numCasa,
          telefono: data.telefono,
          password1: data.password1,
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

  // getData(): void {
  //   this.ngxUiLoaderService.start();
  //   const userData = this.sessionService.getId();
  //   if (userData) {
  //     this.idPurificadora = userData;

  //     if (this.idPurificadora) {
  //       this.clientesService
  //         .purificadora(this.idPurificadora)
  //         .subscribe((data) => {
  //           this.data = data;
  //           this.municipioId = data.municipioId._id;
  //           this.selectedMunicipio = data.municipioId.municipio;
  //           console.log(data.municipioId._id);
  //           console.log(this.municipioId);

  //           if (this.municipioId) {
  //             this.consultasCOPOMEX
  //               .getColoniaXMunicipio(this.municipioId)
  //               .subscribe(
  //                 (data1) => {
  //                   this.allColoniaXMuncipio = data1[0].colonias;
  //                 },
  //                 (error) => {
  //                   console.log(
  //                     "Ocurrió un error al obtener la información",
  //                     error
  //                   );
  //                 }
  //               );
  //           }
  //         });
  //     }
  //   }
  // }

  actualizarRepartidor(id: any) {
    const diasAsignados = this.diasSeleccionados;

    const REPARTIDOR: Repartidor = {
      nombre: this.usuarioForm.get("nombre")?.value,
      email: this.usuarioForm.get("email")?.value,
      telefono: this.usuarioForm.get("telefono")?.value,
      password1: this.usuarioForm.get("password1")?.value,
      numCasa: this.usuarioForm.get("numCasa")?.value,
      diasAsignados: diasAsignados,
    };

    this.repService.updateRepartidora(id, REPARTIDOR).subscribe(
      (response) => {
        console.log(response);
        this.getRepartidores();
        this.visible = false;

        this.toast.showToastPmNgInfo("Se ha actualizado correctamente.");
        // console.log('Usuario actualizado:', response);
      },
      (error) => {
        console.error("Error al actualizar el usuario:", error);
      }
    );
    // }
  }

  eliminarUsuario(id: any) {
    this.repService.eliminarRepartidores(id).subscribe(
      (data) => {
        this.toast.showToastPmNgError("Eliminado del registro.");



        this.getRepartidores();


      },
      (error) => {
        console.log("ocurrio un error", error);
      }
    );
  }

  

  getRepartidores() {
    console.log("Llamando a getRepartidores");
    this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
    if (userData) {
      const idPurificadora = userData;
      this.repService.getRepartidoresByIdPurificadora(idPurificadora).subscribe(
        (data: Repartidor[]) => {
          this.allRepartidores = data;
          this.totalRecords = this.allRepartidores.length;
          this.updatePaginatedRepartidores();
        },
        (error) => {
          console.log("ocurrió un error al obtener la información", error);
        }
      );
    }
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
    console.log("dias en as", this.diasAsignados[dia]);
    console.log("dias en seleccion", this.diasSeleccionados);
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

import { Location } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { RutaService } from "../../../../../shared/services/ruta.service";
import { Ruta } from "../../../../../shared/models/ruta.model";
import { RepartidoresService } from "../../../../../shared/services/rapartidores.service";

import { Repartidor } from "../../../../../shared/models/repartidor.model";
import { MapaClientDetailUbacionService } from "../../services/mapaClientDetalle.service";
import { VehiculoService } from "../../../../../shared/services/vehiculo.service";
import { Vehiculo } from "../../../../../shared/models/vehiculo.model";
import { ConsultasCOPOMEXService } from "../../../../../shared/services/consultas-copomex.service";

import { ClientesService } from "../../../../../shared/services/clientes.service";
import { Cliente } from "../../../../../shared/interfaces/client.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { DetalleEntregaInterface } from "../../../../../shared/interfaces/detalle-entrega-schema.interface";
import { Toast } from "../../../../../shared/services/toast.service";
import { Message, MessageService } from "primeng/api";

@Component({
  selector: "app-ruta-form",
  templateUrl: "./ruta-form.component.html",
  styleUrls: ["./ruta-form.component.css", "./checkbox.scss", "./tabla.scss"],
})
export class RutaFormComponent implements OnInit {
  messages!: Message[];
  allClients: Cliente[] = [];
  titulo = "Registro de  ruta";
  btnTitle = "Registrar";
  accion = "Seleccionar";
  detalleRuta?: DetalleEntregaInterface;
  clienteFormAdd!: FormGroup;
  id: any;
  checked: boolean = true;
  visible: boolean = false;
  showOverlay: boolean = false;
  clienteForm!: FormGroup;
  diasSeleccionados: string[] = [];
  selectedMunicipio: any;
  selectedColonia: any;
  selectedClients: any[] = [];
  allRepartidores: Repartidor[] = [];
  allVehiculos: Vehiculo[] = [];
  selectedRepartidor: Repartidor | null = null;
  selectedVehiculo: Vehiculo | null = null;

  diasAsignados: { [key: string]: boolean } = {};

  allMunicipioXEstado: any;
  allColoniaXMuncipio: any;
  filas!: FormArray;
  registroRuta!: FormGroup;
  diasDisponiblesR: { [key: string]: boolean } = {};
  diasDisponiblesV: { [key: string]: boolean } = {};

  customDropdownStyle = {
    width: "300px",
    border: "1px solid #ccc",
    "border-radius": "5px",
    "background-color": "#fff",
    color: "#333",
  };
  customDropdownClass = "custom-dropdown"; // Agrega tus clases de estilo personalizadas aquí
  constructor(
    private toast: Toast,
    private aRouter: ActivatedRoute,
    private router: Router,
    private UserS: ClientesService,
    private consultasCOPOMEX: ConsultasCOPOMEXService,
    private vehiculoService: VehiculoService,
    private repService: RepartidoresService,
    private rutaService: RutaService,
    private render2: Renderer2,
    private location: Location,
    private formBuilder: FormBuilder,
    private mapService: MapaClientDetailUbacionService,
    private messageService: MessageService // private toas
  ) {
    this.registroRuta = this.formBuilder.group({
      nombreRuta: ["", Validators.required],
      fechaInicio: ["", Validators.required],
      selectedRepartidor: [0],
      selectedVehiculo: [0],
      diasAsignados: this.formBuilder.array([]),
      filas: this.formBuilder.array([]),
    });

    this.clienteFormAdd = this.formBuilder.group({
      selectedMunicipio: ["", Validators.required],
      selectedColonia: ["", Validators.required],
      selectedClientAdd: ["", Validators.required],
    });
    this.diasSeleccionados = [];
    this.id = this.aRouter.snapshot.paramMap.get("id");
    this.filas = this.registroRuta.get("filas") as FormArray;
  }
  // onRepartidorSelectionChange() {
  //   //1- lo que permitirá que el usuario seleccione un repartidor
  //   let selectedId = this.registroRuta.get("selectedRepartidor")?.value;
  //   if (selectedId && typeof selectedId === "object") {
  //     selectedId = selectedId._id;
  //   }
  //   //2- o mantener el anterior seleccionado
  //   else if (this.selectedRepartidor) {
  //     selectedId = this.selectedRepartidor?._id;
  //   }

  //   //3- lo que hace aqui es filtrar los datos del repartidor con el id seleccionado
  //   const selectedRepartidor = this.allRepartidores.find(
  //     (repartidor) => repartidor._id === selectedId
  //   );
  //   this.diasDisponiblesR = {};
  //   //4-lo cual no permitirá acceder a los dias disponibles que tiene dicho repartidor seleccionado
  //   if (selectedRepartidor) {
  //     // 4.1- setear los dias disponibles para el repartidor seleccionado
  //     selectedRepartidor.diasAsignados.forEach((dia) => {
  //       this.diasDisponiblesR[dia] = true;
  //     });
  //   } else {
  //     this.diasDisponiblesR = {};
  //   }

  //   this.diasSeleccionados = [];
  //   // Actualiza diasAsignados según la disponibilidad
  //   for (let dia in this.diasAsignados) {
  //     if (
  //       this.diasAsignados[dia] &&
  //       (this.diasDisponiblesR[dia] || this.diasDisponiblesV[dia])
  //     ) {
  //       this.diasSeleccionados.push(dia);
  //     } else {
  //       this.diasAsignados[dia] = false;
  //     }
  //   }
  // }

  onRepartidorSelectionChange(): void {
    let selectedId = this.registroRuta.get("selectedRepartidor")?.value;
    if (selectedId && typeof selectedId === "object") {
      selectedId = selectedId._id;
    } else if (this.selectedRepartidor) {
      selectedId = this.selectedRepartidor?._id;
    }

    const selectedRepartidor = this.allRepartidores.find(
      (repartidor) => repartidor._id === selectedId
    );

    if (selectedRepartidor) {
      this.rutaService.getRutasByRepartidor(selectedId).subscribe(
        (diasOcupados: string[]) => {
          const diasOcupadosSet = new Set(diasOcupados);

          // Setear los días disponibles excluyendo los días ocupados
          this.diasDisponiblesR = selectedRepartidor.diasAsignados.reduce(
            (acc, dia) => {
              acc[dia] = !diasOcupadosSet.has(dia);
              return acc;
            },
            {} as { [key: string]: boolean }
          );

          // Actualiza diasAsignados y diasSeleccionados según la disponibilidad
          this.diasSeleccionados = [];
          for (let dia in this.diasAsignados) {
            if (this.diasAsignados[dia] && this.diasDisponiblesR[dia]) {
              this.diasSeleccionados.push(dia);
            } else {
              this.diasAsignados[dia] = false;
            }
          }
        },
        (error) => {
          console.error(
            "Error al obtener los días ocupados del repartidor:",
            error
          );
        }
      );
    } else {
      this.diasDisponiblesR = {};
    }
  }

  // onRepartidorSelectionChange() {
  //   let selectedRepartidorId =
  //     this.registroRuta.get("selectedRepartidor")?.value;

  //   // Filtrar repartidor seleccionado
  //   const selectedRepartidor = this.allRepartidores.find(
  //     (repartidor) => repartidor._id === selectedRepartidorId
  //   );

  //   if (selectedRepartidor) {
  //     console.log("entro aqui");
  //     // Obtener las rutas asociadas al repartidor
  //     this.rutaService.getRutasByRepartidor(selectedRepartidorId).subscribe(
  //       (rutas: any[]) => {
  //         const diasAsignados = new Set<string>();

  //         console.log("entro aqui 2");
  //         // Agregar los días asignados en las rutas
  //         rutas.forEach((ruta) => {
  //           console.log("entro aqui 3");

  //           ruta.diasAsignados.forEach((dia: string) => {
  //             diasAsignados.add(dia);
  //           });
  //         });

  //         this.diasDisponiblesR = {};

  //         // Marcar días asignados como no disponibles
  //         diasAsignados.forEach((dia) => {
  //           this.diasDisponiblesR[dia] = false;
  //         });

  //         // Actualiza días seleccionados según la disponibilidad
  //         this.diasSeleccionados = [];
  //         for (let dia in this.diasAsignados) {
  //           if (this.diasAsignados[dia] && !this.diasDisponiblesR[dia]) {
  //             this.diasSeleccionados.push(dia);
  //           }
  //         }
  //       },
  //       (error) => {
  //         console.log(
  //           "Ocurrió un error al obtener las rutas del repartidor",
  //           error
  //         );
  //       }
  //     );
  //   } else {
  //     this.diasDisponiblesR = {};
  //     this.diasSeleccionados = [];
  //   }
  // }

  onVehiculoSelectionChange() {
    let selectedId = this.registroRuta.get("selectedVehiculo")?.value;
    // let selectedId = this.registroRuta.get("selectedVehiculo")?.value;

    // console.log("ID del vehiculo seleccionado:", selectedId);

    if (selectedId && typeof selectedId === "object") {
      selectedId = selectedId._id;
    } else if (this.selectedVehiculo) {
      selectedId = this.selectedVehiculo?._id;
      // console.log("idV", selectedId)
    }

    // Encuentra el repartidor seleccionado en la lista
    const selectedVehiculo = this.allVehiculos.find(
      (vehiculo) => vehiculo._id === selectedId
    );

    // this.diasDisponiblesV = {};
    if (selectedVehiculo) {
      this.rutaService.getRutasByVehiculo(selectedId).subscribe(
        (diasOcupados: string[]) => {
          const diasOcupadosSet = new Set(diasOcupados);

          // Setear los días disponibles excluyendo los días ocupados
          this.diasDisponiblesV = selectedVehiculo.diasAsignados.reduce(
            (acc, dia) => {
              acc[dia] = !diasOcupadosSet.has(dia);
              return acc;
            },
            {} as { [key: string]: boolean }
          );

          // Actualiza diasAsignados y diasSeleccionados según la disponibilidad
          this.diasSeleccionados = [];
          for (let dia in this.diasAsignados) {
            if (this.diasAsignados[dia] && this.diasDisponiblesV[dia]) {
              this.diasSeleccionados.push(dia);
            } else {
              this.diasAsignados[dia] = false;
            }
          }
        },
        (error) => {
          console.error(
            "Error al obtener los días ocupados del repartidor:",
            error
          );
        }
      );
    } else {
      this.diasDisponiblesV = {};
    }
  }

  // !

  volverAtras() {
    this.location.back();
    console.log("presionado atras");
  }

  ngOnInit(): void {
    this.esEditar();
    this.todo();
    this.getRepartidores();
    this.getVehiculos();
    this.getMunicipioPorExtado();
    this.getColoniaPorMunicipio();
    this.getUsers();

    this.messages = [
      // { severity: "success", summary: "Success", detail: "Message Content" },
      { severity: "info", summary: "Info", detail: "Message Content" },
    ];
  }

  // this.toas.add({ severity: "success", summary: "Success", detail: "Message Content" });
  show(): void {
    console.log("1222");
    this.toast.showToastPmNgInfo(
      "selecciona el repartidor y el vehiculo para que se habiliten los dias"
    );
    return;
  }

  getRepartidores() {
    this.repService.getRepartidores().subscribe(
      (data: Repartidor[]) => {
        this.allRepartidores = data;
        // this.show();
      },
      (error) => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
    // }
  }

  getVehiculos() {
    this.vehiculoService.getVehiculos().subscribe(
      (data: Vehiculo[]) => {
        this.allVehiculos = data;
        // console.log(this.allVehiculos);
        if (data) {
          this.toast.showToastPmNgInfo(
            "selecciona el repartidor y el vehiculo para habilitar los dias"
          );
          return;
        }
      },
      (error) => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  getUsers() {
    this.UserS.obtenerCLientes().subscribe(
      (data: Cliente[]) => {
        this.allClients = data;
      },
      (error) => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  onColoniaSelectionChange(event: any, index: number) {
    const filaFormGroup = this.filas.at(index) as FormGroup;
    // Obtén el valor seleccionado de selectedColonia en esa fila
    const selectedColoniaValue = filaFormGroup.get("selectedColonia")?.value;
    // const selectedColoniaValue = this.registroRuta.get('selectedColonia')?.value; // Obtener el valor seleccionado del formulario
    console.log("Colonia seleccionado:", selectedColoniaValue);
    if (selectedColoniaValue === null) {
      return "No ha seleccionado ninguna colonia!"; // Retorna una matriz vacía si el valor seleccionado es nulo
    }
    let filtered: any[] = [];
    for (let colonia of this.allColoniaXMuncipio) {
      if (
        colonia.toLowerCase().indexOf(selectedColoniaValue.toLowerCase()) == 0
      ) {
        filtered.push(colonia);
      }
    }
    return filtered;
  }

  onMunicipioSelectionChange(event: any, index: number) {
    const filaFormGroup = this.filas.at(index) as FormGroup;
    // Obtén el valor seleccionado de selectedColonia en esa fila
    const selectedMunicipioValue =
      filaFormGroup.get("selectedMunicipio")?.value;
    // const selectedMunicipioValue = this.registroRuta.get('selectedMunicipio')?.value; // Obtener el valor seleccionado del formulario
    console.log("Municipio seleccionado:", selectedMunicipioValue);
    if (selectedMunicipioValue === null) {
      return "No ha seleccionado ningun Municipio!"; // Retorna una matriz vacía si el valor seleccionado es nulo
    }
    let filtered: any[] = [];
    for (let municipios of this.allMunicipioXEstado) {
      if (
        municipios
          .toLowerCase()
          .indexOf(selectedMunicipioValue.toLowerCase()) == 0
      ) {
        filtered.push(municipios);
      }
    }
    return filtered;
  }

  onClientSelectionChange(event: any) {
    this.selectedClients = event.value;
  }

  getColoniaPorMunicipio() {
    this.consultasCOPOMEX.getColoniaXMunicipio().subscribe(
      (data) => {
        this.allColoniaXMuncipio = data.Colonias;
      },
      (error) => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  obtenerTodosLosMunicipios() {
    const municipiosSeleccionados = this.filas.controls.map(
      (fila) => fila.get("selectedMunicipio")?.value
    );
    return municipiosSeleccionados;
  }

  obtenerTodosLasColonias() {
    const coloniasSeleccionados = this.filas.controls.map(
      (fila) => fila.get("selectedColonia")?.value
    );
    return coloniasSeleccionados;
  }
  obtenerTodosLasClientes() {
    const clientesSeleccionados = this.filas.controls.map(
      (fila) => fila.get("selectedClient")?.value
    );

    return clientesSeleccionados;
  }

  AgregarClienteRuta() {
    const allMunicipios = this.obtenerTodosLosMunicipios();
    const allColonias = this.obtenerTodosLasColonias();
    const allClients = this.obtenerTodosLasClientes();
    const nombreRuta = this.registroRuta.get("nombreRuta")?.value;
    const selectedVehiculo = this.registroRuta.get("selectedVehiculo")?.value;
    const selectedRepartidor =
      this.registroRuta.get("selectedRepartidor")?.value;

    const diasAsignados = this.diasSeleccionados;

    console.log("dias en registro", diasAsignados);

    if (!nombreRuta) {
      this.toast.showToastPmNgWarn("Ingresa el nombre de la ruta");
      return;
    }

    if (!selectedRepartidor || selectedRepartidor == 0) {
      this.toast.showToastPmNgWarn("Seleccione un repartidor");
      return;
    }
    if (!selectedVehiculo || selectedVehiculo == 0) {
      this.toast.showToastPmNgWarn("Selecciona un vehiculo");
      return;
    }

    if (!allColonias) {
      this.toast.showToastPmNgWarn("Ingresa tu colonia :AgregarClienteRuta ");
      return;
    }

    if (this.id == null) {
      if (allClients.length === 0) {
        this.toast.showToastPmNgWarn("No ha seleccionado ningun cliente!");
        console.log("No ha seleccionado ningun cliente!");
        return;
      }
    }
    if (!allMunicipios) {
      this.toast.showToastPmNgWarn("Por favor ingresa tu municipio");
      return;
    }
    if (!diasAsignados) {
      this.toast.showToastPmNgWarn("selecciona los dias");
      return;
    }

    const puntosDeEntrega = allClients.map((clienteId, index) => ({
      municipio: allMunicipios[index],
      colonia: allColonias[index],
      clienteId: allClients,
    }));

    const RUTA: Ruta = {
      nombreRuta: nombreRuta,
      repartidorId: selectedRepartidor,
      vehiculoId: selectedVehiculo,
      estado: "pendiente",
      puntosDeEntrega: puntosDeEntrega,
      diasAsignados: diasAsignados,
    };

    if (this.id !== null) {
      // Si es una edición, llamar al método editarProducto con el ID y el objeto formData
      this.rutaService.updateRuta(this.id, RUTA).subscribe(
        () => {
          this.toast.showToastSwalSuccess("Ruta actualizado con éxito!");
          this.router.navigate(["/purificadoraAdm/ruta/lista-rutas"]); // Navegación hacia otras páginas públicas
        },
        (error) => {
          console.log("Ocurrió un error al actualizar", error);
          // Muestra el error usando el servicio de notificación
          this.toast.showToastSwalError(
            "Error al actualizar la ruta: " +
              (error.error.message || "Error desconocido")
          );
        }
      );
    } else {
      console.log(RUTA);
      this.rutaService.addRuta(RUTA).subscribe(
        (response) => {
          this.visible = false;
          this.toast.showToastSwalSuccess("Se ha agregado correctamente.");
          this.router.navigate(["/purificadoraAdm/ruta/lista-rutas"]); // Navegación hacia otras páginas públicas
        },
        (error) => {
          console.error(error); // Imprime el error en la consola para depuración
          let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
          }
          this.toast.showToastSwalError(errorMessage); // Mostramos el mensaje de error en la alerta
        }
      );
    }
  }

  getMunicipioPorExtado() {
    this.consultasCOPOMEX.getMunicipioXEstado().subscribe(
      (data) => {
        this.allMunicipioXEstado = data.municipios;
        // console.log(this.allMunicipioXEstado);
      },
      (error) => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  agregarFila() {
    this.filas.push(
      this.formBuilder.group({
        selectedMunicipio: [""], // Aquí deberías inicializar los valores según tus necesidades
        selectedColonia: [""],
        selectedClient: [""],
      })
    );
  }

  eliminarFila(index: number) {
    (this.registroRuta.get("filas") as FormArray).removeAt(index);
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = "Editar ruta";
      this.btnTitle = "Actualizar";
      this.accion = "Cambiar";
      this.rutaService.detalleRutaById(this.id).subscribe((data) => {
        let selectedNombreRuta = data.nombreRuta;
        this.selectedRepartidor = data.repartidorId;
        this.selectedVehiculo = data.vehiculoId;
        this.registroRuta.patchValue({
          nombreRuta: selectedNombreRuta,
          selectedRepartidor: data.repartidorId,
          selectedVehiculo: data.vehiculoId,
        });
      });
    }
  }

  eliminarPuntoUbicacion(id: any) {
    this.rutaService.eliminarPuntoEntrega(id).subscribe(
      (data) => {
        this.todo();
        console.log(this.detalleRuta);
      },
      (error) => {
        console.log("ocurrio un error", error);
      }
    );
  }

  todo(): void {
    if (this.id !== null) {
      this.rutaService.detalleRutaById(this.id).subscribe(
        (data: DetalleEntregaInterface) => {
          this.detalleRuta = data;
          this.onVehiculoSelectionChange();
          this.onRepartidorSelectionChange();
          if (this.detalleRuta.diasAsignados) {
            this.diasAsignados = this.convertArrayToDiasAsignados(
              this.detalleRuta.diasAsignados
            );
            this.diasSeleccionados = [...this.detalleRuta.diasAsignados]; // Initialize the selected days array
          } else {
            this.diasAsignados = this.initializeDiasAsignados();
          }
          console.log("dias=>", this.diasAsignados);
        },
        (error) => {
          console.log("ocurrio un error", error);
        }
      );
    }
  }

  onColoniaSelectionChangeId(event: any) {
    const selectedColoniaValue = event.value;
    console.log("Colonia seleccionado:", selectedColoniaValue);
    if (selectedColoniaValue === null) {
      return "No ha seleccionado ninguna colonia!"; // Retorna una matriz vacía si el valor seleccionado es nulo
    }
    let filtered: any[] = [];
    for (let colonia of this.allColoniaXMuncipio) {
      if (
        colonia.toLowerCase().indexOf(selectedColoniaValue.toLowerCase()) == 0
      ) {
        filtered.push(colonia);
      }
    }
    return filtered;
  }

  agregarCliente() {
    this.visible = true;
    if (this.visible) {
      this.clienteFormAdd.reset({
        selectedMunicipio: "",
        selectedColonia: "",
        selectedClientAdd: "",
      });
    }
  }

  agregarClienteEnRuta() {
    this.visible = true;
    const selectedClientAdd =
      this.clienteFormAdd.get("selectedClientAdd")?.value;
    if (!selectedClientAdd) {
      this.toast.showToastPmNgWarn("Selecciona el cliente");
      return;
    }
    function generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);
    }

    const newPuntosDeEntrega = {
      clienteId: selectedClientAdd._id,
      _id: generateUniqueId(),
    };

    this.rutaService
      .addPuntoEntregaRutaById(this.id, newPuntosDeEntrega)
      .subscribe(
        (response) => {
          this.visible = false;
          this.toast.showToastSwalSuccess("Se ha agregado correctamente.");
          this.todo();
        },
        (error) => {
          console.error(error); // Imprime el error en la consola para depuración
          let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
          }
          this.toast.showToastSwalError(errorMessage);
        }
      );
  }
  convertArrayToDiasAsignados(dias: string[]): { [key: string]: boolean } {
    const diasAsignados: { [key: string]: boolean } = {};
    const allDias = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    allDias.forEach((dia) => {
      diasAsignados[dia] = dias.includes(dia);
    });
    return diasAsignados;
  }

  initializeDiasAsignados(): { [key: string]: boolean } {
    const diasAsignados: { [key: string]: boolean } = {};
    const allDias = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    allDias.forEach((dia) => {
      diasAsignados[dia] = false;
    });
    return diasAsignados;
  }

  // funcion de seleccion de dias en caso de que sea actualizacion
  onDiaSeleccionadoupdate(event: Event): void {
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
    console.log("dias en seleccion", this.diasSeleccionados);
  }

  getSelectedDias(): string[] {
    return Object.keys(this.diasAsignados).filter(
      (dia) => this.diasAsignados[dia]
    );
  }

  onDiaSeleccionado(event: any, dia: string) {
    // Maneja la selección/deselección de un día por el administrador
    this.diasAsignados[dia] = event.target.checked;

    if (!this.diasSeleccionados.includes(dia)) {
      this.diasSeleccionados.push(dia);
    } else {
      const index = this.diasSeleccionados.indexOf(dia);
      if (index > -1) {
        this.diasSeleccionados.splice(index, 1);
      }
    }

    console.log(`Día seleccionado: ${dia}, Estado: ${event.target.checked}`);
  }

  getAvailabilityMessage(dia: string): string {
    const repartidor = this.registroRuta.get("selectedRepartidor")?.value;
    const vehiculo = this.registroRuta.get("selectedVehiculo")?.value;

    if (!repartidor && !vehiculo) {
      return "Seleccione un repartidor o un vehículo.";
    }

    if (repartidor && vehiculo) {
      if (this.diasDisponiblesR[dia] && this.diasDisponiblesV[dia]) {
        return "Este día está disponible para el repartidor y el vehículo.";
      } else if (!this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia]) {
        return "Este día no está disponible ni para el repartidor ni para el vehículo.";
      } else if (!this.diasDisponiblesR[dia] && this.diasDisponiblesV[dia]) {
        return "Este día no está disponible para el repartidor, pero sí para el vehículo.";
      } else if (!this.diasDisponiblesV[dia] && this.diasDisponiblesR[dia]) {
        return "Este día no está disponible para el vehículo, pero sí para el repartidor.";
      }
    }

    if (repartidor && !vehiculo) {
      if (this.diasDisponiblesR[dia]) {
        return "Este día está disponible para el repartidor.";
      } else {
        return "Este día no está disponible para el repartidor.";
      }
    }

    if (vehiculo && !repartidor) {
      if (this.diasDisponiblesV[dia]) {
        return "Este día está disponible para el vehículo.";
      } else {
        return "Este día no está disponible para el vehículo.";
      }
    }

    return "";
  }
  isDiaNoDisponible(dia: string): boolean {
    return (
      (!this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia]) ||
      (!this.diasDisponiblesR[dia] && this.diasDisponiblesV[dia]) ||
      (this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia])
    );
  }
}

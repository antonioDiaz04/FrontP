import { Location } from "@angular/common";
import {
  Component,
  ElementRef,
  Input,
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
import { Municipio } from "../../../../../shared/models/DireccionSchema.model";
interface PuntoDeEntrega {
  clienteId: {
    _id: string;
    colonia: string;
    nombre: string;
  };
  // Puedes agregar más propiedades si existen en la respuesta.
}

interface City {
  name: string;
  code: string;
}
interface ClienteOption {
  nombre: string;
  value: string; // o el tipo adecuado según tu `Cliente.id`
}

@Component({
  selector: "app-ruta-form",
  templateUrl: "./ruta-form.component.html",
  styleUrls: [
    "./ruta-form.component.css",
    "../../../loadign.css",
    "./checkbox.scss",
    "./tabla.scss",
  ],
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
  isLoading: boolean = true;
  esEdit: boolean = false;
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
  placeholders: string[] = [];
  // diasAsignados: { [key: string]: boolean } = {};
  filteredColoniasXMuncipio: any[] = []; // Array con colonias filtradas
  allMunicipioXEstado: any;
  allColoniaXMuncipio: any;
  filas!: FormArray;
  registroRuta!: FormGroup;
  currentIndex: number = 0; // Índice de la fila actual
  // diasDisponiblesR: { [key: string]: boolean } = {};
  // diasDisponiblesV: { [key: string]: boolean } = {};
  // clientesPorFila: { [key: number]: any[] } = {};
  clientesPorFila: any[][] = [];

  colonias: { label: string; value: string }[] = [];
  clientes: { _id: string; nombre: string }[] = [];
  // clientesPorFila: { [key: number]: ClienteOption[] } = [];
  @Input() diasDisponiblesR: { [key: string]: boolean } = {};
  @Input() diasDisponiblesV: { [key: string]: boolean } = {};
  @Input() diasAsignados: { [key: string]: boolean } = {};
  selectedColonias: any[] = []; // Array para almacenar las colonias seleccionadas

  diasSemana = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  customDropdownStyle = {
    width: "300px",
    border: "1px solid #ccc",
    "border-radius": "5px",
    "background-color": "#fff",
    color: "#333",
  };

  selectedRepartidorId!: any;
  selectedVehiculoId!: any;
  cities!: City[];
  si: boolean = false;
  selectedCities!: City[];
  customDropdownClass = "custom-dropdown";

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
    private formBuilder: FormBuilder
  ) {
    this.esEdit = false;
    this.registroRuta = this.formBuilder.group({
      nombreRuta: ["", Validators.required],
      fechaInicio: ["", Validators.required],
      selectedRepartidor: [0],
      selectedVehiculo: [0],
      diasAsignados: this.formBuilder.array([]),
      filas: this.formBuilder.array([
        this.createFilaGroup(), // Inicializa con una fila si es necesario
      ]),

      // filas: this.formBuilder.array([
      //   this.formBuilder.group({
      //     addSelectedColonia: [""],
      //     addSelectedClient: [""],
      //     editSelectedColonia: [""],
      //     editSelectedClient: [""],
      //   }),
      // ]),
    });

    this.diasSeleccionados = [];
    this.id = this.aRouter.snapshot.paramMap.get("id");
    this.filas = this.registroRuta.get("filas") as FormArray;
  }

  createFilaGroup(): FormGroup {
    return this.formBuilder.group({
      addSelectedColonia: [""],
      addSelectedClient: [""],
      editSelectedColonia: [""],
      editSelectedClient: [""],
    });
  }
  ngOnInit(): void {
    this.placeholders = [];
    this.esEditar();
    this.todo();
    this.getRepartidores();
    this.getVehiculos();
    this.getMunicipioPorExtado();
    this.getColoniaPorMunicipio();
    // this.filtrarColoniasDisponibles()
    // this.initializeAllDiasDisponibles()

    this.messages = [
      // { severity: "success", summary: "Success", detail: "Message Content" },
      { severity: "info", summary: "Info", detail: "Message Content" },
    ];
  }

  initializeAllDiasDisponibles(): void {
    // Inicializa los días disponibles para el repartidor
    this.diasDisponiblesR = {};
    this.selectedRepartidorId.diasAsignados.forEach((dia: string) => {
      this.diasDisponiblesR[dia] = true;
    });

    // Inicializa los días disponibles para el vehículo
    this.diasDisponiblesV = {};
    this.selectedVehiculoId.diasAsignados.forEach((dia: string) => {
      this.diasDisponiblesV[dia] = true;
    });

    // Inicializa los días seleccionados
    this.diasSeleccionados = [];
    for (let dia of this.diasSemana) {
      if (this.diasAsignados[dia]) {
        this.diasSeleccionados.push(dia);
      }
    }
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
  onRepartidorSelectionChange() {
    let selectedId = this.registroRuta.get("selectedRepartidor")?.value;
    this.selectedRepartidorId = selectedId;

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

          // Verifica que detalleRuta y sus propiedades no sean undefined
          if (
            this.detalleRuta &&
            this.detalleRuta.diasAsignados &&
            this.detalleRuta.repartidorId === selectedId
          ) {
            this.diasDisponiblesR = this.detalleRuta.diasAsignados.reduce(
              (acc, dia) => {
                acc[dia] = true;
                return acc;
              },
              {} as { [key: string]: boolean }
            );
          } else {
            this.diasDisponiblesR = selectedRepartidor.diasAsignados.reduce(
              (acc, dia) => {
                acc[dia] = !diasOcupadosSet.has(dia);
                return acc;
              },
              {} as { [key: string]: boolean }
            );
          }

          // this.diasSeleccionados = [];
          // for (let dia of this.diasSemana) {
          //   if (this.diasAsignados[dia] && this.diasDisponiblesR[dia]) {
          //     this.diasSeleccionados.push(dia);
          //   } else {
          //     this.diasAsignados[dia] = false;
          //   }
          // }
        },
        (error) => {
          console.error(
            "Error al obtener los días ocupados del repartidor:",
            error
          );
        }
      );
    }
  }

  // ?esto es funcional
  // onRepartidorSelectionChange() {
  //   let selectedId = this.registroRuta.get("selectedRepartidor")?.value;
  //     this.selectedRepartidorId=selectedId

  //   if (selectedId && typeof selectedId === "object") {
  //     selectedId = selectedId._id;
  //   } else if (this.selectedRepartidor) {
  //     selectedId = this.selectedRepartidor?._id;
  //   }

  //   const selectedRepartidor = this.allRepartidores.find(
  //     (repartidor) => repartidor._id === selectedId
  //   );

  //   if (selectedRepartidor) {
  //     // if (!this.id) {
  //       this.rutaService.getRutasByRepartidor(selectedId).subscribe(
  //         (diasOcupados: string[]) => {
  //           const diasOcupadosSet = new Set(diasOcupados);

  //           this.diasDisponiblesR = selectedRepartidor.diasAsignados.reduce(
  //             (acc, dia) => {
  //               acc[dia] = !diasOcupadosSet.has(dia);
  //               return acc;
  //             },
  //             {} as { [key: string]: boolean }
  //           );

  //           this.diasSeleccionados = [];
  //           for (let dia of this.diasSemana) {
  //             if (this.diasAsignados[dia] && this.diasDisponiblesR[dia]) {
  //               this.diasSeleccionados.push(dia);
  //             } else {
  //               this.diasAsignados[dia] = false;
  //             }
  //           }
  //         },
  //         (error) => {
  //           console.error(
  //             "Error al obtener los días ocupados del repartidor:",
  //             error
  //           );
  //         }
  //       );
  //     // }
  //     //  else {
  //     //   console.log("aqui pasa")
  //     //   this.diasDisponiblesR = {};
  //     //   selectedRepartidor.diasAsignados.forEach((dia) => {
  //     //     this.diasDisponiblesR[dia] = true;
  //     //   });
  //     //   console.log("aqui pasa")

  //     //   this.diasSeleccionados = [];
  //     //   for (let dia of this.diasSemana) {
  //     //     if (this.diasAsignados[dia]) {
  //     //       this.diasSeleccionados.push(dia);
  //     //     }
  //     //   }
  //     // }
  //   }
  // }
  onVehiculoSelectionChange() {
    let selectedId = this.registroRuta.get("selectedVehiculo")?.value;
    this.selectedVehiculoId = selectedId;

    if (selectedId && typeof selectedId === "object") {
      selectedId = selectedId._id;
    } else if (this.selectedVehiculo) {
      selectedId = this.selectedVehiculo?._id;
    }

    const selectedVehiculo = this.allVehiculos.find(
      (vehiculo) => vehiculo._id === selectedId
    );

    if (selectedVehiculo) {
      this.rutaService.getRutasByVehiculo(selectedId).subscribe(
        (diasOcupados: string[]) => {
          const diasOcupadosSet = new Set(diasOcupados);

          // Verifica que detalleRuta y sus propiedades no sean undefined
          if (
            this.detalleRuta &&
            this.detalleRuta.diasAsignados &&
            this.detalleRuta.vehiculoId === selectedId
          ) {
            this.diasDisponiblesV = this.detalleRuta.diasAsignados.reduce(
              (acc, dia) => {
                acc[dia] = true;
                return acc;
              },
              {} as { [key: string]: boolean }
            );
          } else {
            this.diasDisponiblesV = selectedVehiculo.diasAsignados.reduce(
              (acc, dia) => {
                acc[dia] = !diasOcupadosSet.has(dia);
                return acc;
              },
              {} as { [key: string]: boolean }
            );
          }

          // this.diasSeleccionados = [];
          // for (let dia of this.diasSemana) {
          //   if (this.diasAsignados[dia] && this.diasDisponiblesV[dia]) {
          //     this.diasSeleccionados.push(dia);
          //   } else {
          //     this.diasAsignados[dia] = false;
          //   }
          // }
        },
        (error) => {
          console.error(
            "Error al obtener los días ocupados del vehículo:",
            error
          );
        }
      );
    }
  }

  // ?esto funciona perfecto
  // onVehiculoSelectionChange() {
  //   let selectedId = this.registroRuta.get("selectedVehiculo")?.value;

  //     this.selectedVehiculoId=selectedId
  //   //  selectedVehiculoId!: any
  //   if (selectedId && typeof selectedId === "object") {
  //     selectedId = selectedId._id;
  //   } else if (this.selectedVehiculo) {
  //     selectedId = this.selectedVehiculo?._id;
  //   }

  //   const selectedVehiculo = this.allVehiculos.find(
  //     (vehiculo) => vehiculo._id === selectedId
  //   );

  //   if (selectedVehiculo) {
  //     // if (!this.id) {
  //       this.rutaService.getRutasByVehiculo(selectedId).subscribe(
  //         (diasOcupados: string[]) => {
  //           const diasOcupadosSet = new Set(diasOcupados);

  //           this.diasDisponiblesV = selectedVehiculo.diasAsignados.reduce(
  //             (acc, dia) => {
  //               acc[dia] = !diasOcupadosSet.has(dia);
  //               return acc;
  //             },
  //             {} as { [key: string]: boolean }
  //           );

  //           this.diasSeleccionados = [];
  //           for (let dia of this.diasSemana) {
  //             if (this.diasAsignados[dia] && this.diasDisponiblesV[dia]) {
  //               this.diasSeleccionados.push(dia);
  //             } else {
  //               this.diasAsignados[dia] = false;
  //             }
  //           }
  //         },
  //         (error) => {
  //           console.error(
  //             "Error al obtener los días ocupados del vehículo:",
  //             error
  //           );
  //         }
  //       );
  //     // } else {
  //     //   this.diasDisponiblesV = {};
  //     //   selectedVehiculo.diasAsignados.forEach((dia) => {
  //     //     this.diasDisponiblesV[dia] = true;
  //     //   });

  //     //   this.diasSeleccionados = [];
  //     //   for (let dia of this.diasSemana) {
  //     //     if (this.diasAsignados[dia]) {
  //     //       this.diasSeleccionados.push(dia);
  //     //     }
  //     //   }
  //     // }
  //   }
  // }

  volverAtras() {
    this.location.back();
    console.log("presionado atras");
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
  onColoniaSelectionChange(event: any, index: number) {
    // Determina el nombre del control de formulario en función del modo
    const coloniaControlName = this.id
      ? "editSelectedColonia"
      : "addSelectedColonia";

    console.log(`onColoniaSelectionChange called for index ${index}`);
    console.log(`Using coloniaControlName: ${coloniaControlName}`);

    const filaFormGroup = this.filas.at(index) as FormGroup;
    const selectedColoniaValue = filaFormGroup.get(coloniaControlName)?.value;

    console.log(`Selected colonia value: ${selectedColoniaValue}`);
    if (selectedColoniaValue === null || selectedColoniaValue === undefined) {
      console.log(
        `No colonia selected or colonia is undefined at index ${index}`
      );
      this.clientesPorFila[index] = [
        { nombre: "No hay clientes disponibles", _id: null },
      ];
      this.placeholders[index] = "No hay clientes disponibles";
      return;
    }
    // Actualiza el array de colonias seleccionadas
    
  // Actualiza el array de colonias seleccionadas
  this.selectedColonias[index] = selectedColoniaValue || null;

  // Filtra las colonias disponibles después de la selección
  this.updateFilteredColonias(index);
  // // / Filtra las colonias disponibles para la fila actual
  // this.filteredColoniasXMuncipio = this.allColoniaXMuncipio.filter((colonia: any) =>
  //   // Incluye la colonia si es la seleccionada en la fila actual o no está seleccionada en otras filas
  //   this.selectedColonias[index] === colonia || !this.selectedColonias.some(
  //     (selectedColonia, i) => selectedColonia === colonia && i !== index
  //   )
  // );
    // // Filtra las colonias disponibles después de la selección
    // this.filteredColoniasXMuncipio = this.allColoniaXMuncipio.filter(
    //   (colonia: any) =>
    //     !this.selectedColonias.some(
    //       (selectedColonia, i) => selectedColonia === colonia.nombre && i !== index
    //     ) // Excluye las colonias seleccionadas en otras filas
    // );

    console.log('Filtered Colonias:', this.filteredColoniasXMuncipio);

    this.UserS.obtenerCLientesDisponiblesByColonia(
      selectedColoniaValue
    ).subscribe(
      (data: any[]) => {
        console.log(`Received data for clients:`, data);
        const clientesDisponibles = data.filter((cliente) => !cliente.ocupado);

        console.log(`Available clients:`, clientesDisponibles);
        this.placeholders[index] =
          clientesDisponibles.length > 0
            ? "Selecciona los clientes"
            : "No hay clientes disponibles";

        this.clientesPorFila[index] =
          clientesDisponibles.length > 0
            ? clientesDisponibles
            : [{ nombre: "No hay clientes disponibles", _id: null }];
      },
      (error) => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
     // Actualiza el índice de la fila actual
    // this.currentIndex = index;
    // this.updateFilteredColonias();
  }

   // Método para actualizar las colonias filtradas
   // Método para actualizar las colonias filtradas
  updateFilteredColonias(currentIndex: number) {
  this.filteredColoniasXMuncipio = this.allColoniaXMuncipio.filter((colonia: any) =>
    // Mantiene la colonia si es la seleccionada en la fila actual
    this.selectedColonias[currentIndex] === colonia ||
    // Excluye colonias seleccionadas en otras filas
    !this.selectedColonias.some((selectedColonia, index) => selectedColonia === colonia && index !== currentIndex)
  );
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

  onClientSelectionChangeModal(event: any) {
    this.selectedClients = event.value;
  }
  onClientSelectionChange(event: any, index: number) {
    // Determina el nombre del control de formulario en función del modo
    const clientControlName = this.id
      ? "editSelectedClient"
      : "addSelectedClient";

    const filaFormGroup = this.filas.at(index) as FormGroup;
    const selectedClients = filaFormGroup.get(clientControlName)?.value;

    console.log(`Clientes seleccionados en fila ${index}:`, selectedClients);

    // Aquí puedes agregar cualquier lógica adicional que necesites
  }

  getColoniaPorMunicipio() {
    const municipio = "Huejutla de Reyes";
    this.consultasCOPOMEX.getColoniaXMunicipioByClientes(municipio).subscribe(
      (data) => {
        // console.log(data); // Asegúrate de que la estructura es correcta
        if (data) {
          this.allColoniaXMuncipio = data.colonias;
          console.log(this.allColoniaXMuncipio);
          this.filteredColoniasXMuncipio = [...this.allColoniaXMuncipio];
        } else {
          console.log("No se encontraron datos.");
        }
      },
      (error) => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  obtenerTodosLasColonias() {
    const coloniasSeleccionados = this.filas.controls.map(
      (fila) =>
        fila.get(this.id ? "editSelectedColonia" : "addSelectedColonia")?.value
    );
    return coloniasSeleccionados;
  }

  obtenerTodosLasClientes() {
    const clientesSeleccionados = this.filas.controls.map(
      (fila) =>
        fila.get(this.id ? "editSelectedClient" : "addSelectedClient")?.value
    );

    // Eliminar duplicados
    const clientesUnicos = [...new Set(clientesSeleccionados.flat())];

    return clientesUnicos;
  }
  obtenerPuntosDeEntrega() {
    return this.filas.controls.map((fila) => ({
      colonia: fila.get(this.id ? "editSelectedColonia" : "addSelectedColonia")
        ?.value,
      clienteId: fila.get(this.id ? "editSelectedClient" : "addSelectedClient")
        ?.value,
    }));
  }

  AgregarClienteRuta() {
    const allColonias = this.obtenerTodosLasColonias();
    const allClients = this.obtenerTodosLasClientes();
    const puntosDeEntrega = this.obtenerPuntosDeEntrega();

    const nombreRuta = this.registroRuta.get("nombreRuta")?.value;
    const selectedVehiculo = this.registroRuta.get("selectedVehiculo")?.value;
    const selectedRepartidor =
      this.registroRuta.get("selectedRepartidor")?.value;

    const diasAsignados = this.diasSeleccionados;

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

    if (!diasAsignados) {
      this.toast.showToastPmNgWarn("selecciona los dias");
      return;
    }

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
      // console.log(RUTA);
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
    // Determina los nombres de los controles en función del modo
    const municipioControlName = this.id
      ? "editSelectedMunicipio"
      : "selectedMunicipio";
    const coloniaControlName = this.id
      ? "editSelectedColonia"
      : "addSelectedColonia";
    const clientControlName = this.id
      ? "editSelectedClient"
      : "addSelectedClient";

    this.si = true;

    this.filas.push(
      this.formBuilder.group({
        [municipioControlName]: [""], // Inicializa los valores según tus necesidades
        [coloniaControlName]: [""],
        [clientControlName]: [""],
      })
    );
  }

  // agregarFila() {
  //   // Determina los nombres de los controles en función del modo
  //   const municipioControlName = this.id
  //     ? "editSelectedMunicipio"
  //     : "selectedMunicipio";
  //   this.si = true;
  //   // const coloniaControlName = this.id
  //   //   ? "editSelectedColonia"
  //   //   : "addSelectedColonia";
  //   // const clientControlName = this.id
  //   //   ? "editSelectedClient"
  //   //   : "addSelectedClient";
  //   const coloniaControlName = "addSelectedColonia";
  //   const clientControlName = "addSelectedClient";

  //   this.filas.push(
  //     this.formBuilder.group({
  //       [municipioControlName]: [""], // Inicializa los valores según tus necesidades
  //       [coloniaControlName]: [""],
  //       [clientControlName]: [""],
  //     })
  //   );
  // }

  eliminarFila(index: number) {
    (this.registroRuta.get("filas") as FormArray).removeAt(index);
  }

  esEditar(): void {
    if (this.id) {
      this.esEdit = true;
      this.titulo = "Editar ruta";
      this.btnTitle = "Actualizar";
      this.accion = "Cambiar";
      this.rutaService.detalleRutaById(this.id).subscribe((data) => {
        this.detalleRuta = data;
        this.selectedRepartidor = data.repartidorId;
        this.selectedVehiculo = data.vehiculoId;
        this.registroRuta.patchValue({
          nombreRuta: data.nombreRuta,
          selectedRepartidor: data.repartidorId,
          selectedVehiculo: data.vehiculoId,
        });
        this.cargarDetalleRuta();
      });
    }
  }
  cargarDetalleRuta(): void {
    const coloniasSet = new Set<string>();
    const coloniaToIndex: { [key: string]: number } = {};

    // Vaciar el FormArray antes de comenzar
    this.filas.clear();
    this.colonias = [];
    this.clientesPorFila = [];
    this.todoIdia();
    const clientes = this.detalleRuta?.puntosDeEntrega.map((punto: any) => ({
      _id: punto.clienteId?._id,
      nombre: punto.clienteId?.nombre,
    }));

    // Agrupar colonias sin duplicar y inicializar las filas del formulario
    this.detalleRuta?.puntosDeEntrega.forEach((punto: any) => {
      const colonia = punto.clienteId?.colonia;
      const cliente = punto.clienteId?.nombre;

      if (colonia && cliente && !coloniasSet.has(colonia)) {
        coloniasSet.add(colonia);
        this.colonias.push({ label: colonia, value: colonia });
        coloniaToIndex[colonia] = this.filas.length;

        // Inicializar el array de opciones para la colonia
        this.clientesPorFila[coloniaToIndex[colonia]] = [];

        // Agregar fila al formulario
        const fila = this.formBuilder.group({
          editSelectedColonia: [colonia],
          editSelectedClient: [[]],
        });
        this.filas.push(fila);
      }
    });

    // Obtener los clientes disponibles para cada colonia
    coloniasSet.forEach((colonia) => {
      this.UserS.obtenerCLientesDisponiblesByColonia(colonia).subscribe(
        (data: any[]) => {
          // Filtrar clientes con estatus ocupado: false si no hay ID
          const clientesDisponibles = !this.detalleRuta?._id
            ? data.filter((cliente) => !cliente.ocupado)
            : data;

          const filaIndex = coloniaToIndex[colonia];
          this.clientesPorFila[filaIndex] = data;
          // const filaIndex = coloniaToIndex[colonia];
          // this.clientesPorFila[filaIndex] = clientesDisponibles;

          // Obtener los IDs de los clientes seleccionados para esta colonia
          const clientesSeleccionados = this.detalleRuta?.puntosDeEntrega
            .filter((punto: any) => punto.clienteId?.colonia === colonia)
            .map((punto: any) => punto.clienteId?._id);

          // Asegurar que el control de formulario se actualiza con los IDs de los clientes seleccionados
          this.filas
            .at(filaIndex)
            .get("editSelectedClient")
            ?.setValue(clientesSeleccionados || []);
          if (
            clientesDisponibles.length > 0 &&
            clientesSeleccionados.length > 0
          ) {
            this.isLoading = false;
            this.visible = true;
          }
        }
      );
    });
  }

  restaurarInformacion() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No se guardarán los cambios realizados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.todo();
        this.cargarDetalleRuta();
        this.rutaService.detalleRutaById(this.id).subscribe((data) => {
          this.detalleRuta = data;
          this.selectedRepartidor = data.repartidorId;
          this.selectedVehiculo = data.vehiculoId;
          this.registroRuta.patchValue({
            nombreRuta: data.nombreRuta,
            selectedRepartidor: data.repartidorId,
            selectedVehiculo: data.vehiculoId,
          });
          this.cargarDetalleRuta();
        });
        Swal.fire(
          "Restaurado",
          "La información ha sido restaurada.",
          "success"
        );
      }
    });
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
    if (this.id) {
      this.rutaService.detalleRutaById(this.id).subscribe(
        (data: DetalleEntregaInterface) => {
          const data1 = data;
          this.onVehiculoSelectionChange();
          this.onRepartidorSelectionChange();
          if (data1.diasAsignados) {
            this.diasAsignados = this.convertArrayToDiasAsignados(
              data1.diasAsignados
            );
            this.diasSeleccionados = [...data1.diasAsignados]; // Initialize the selected days array
          } else {
            this.diasAsignados = this.initializeDiasAsignados();
          }
        },
        (error) => {
          console.log("ocurrio un error", error);
        }
      );
    }
  }
  todoIdia(): void {
    if (this.id) {
      this.rutaService.detalleRutaById(this.id).subscribe(
        (data: DetalleEntregaInterface) => {
          this.detalleRuta = data;
          if (this.detalleRuta.diasAsignados) {
            this.diasAsignados = this.convertArrayToDiasAsignados(
              this.detalleRuta.diasAsignados
            );
            this.diasSeleccionados = [...this.detalleRuta.diasAsignados]; // Initialize the selected days array
          } else {
            this.diasAsignados = this.initializeDiasAsignados();
          }
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

  convertArrayToDiasAsignados(dias: string[]): { [key: string]: boolean } {
    const diasAsignados: { [key: string]: boolean } = {};

    this.diasSemana.forEach((dia) => {
      diasAsignados[dia] = dias.includes(dia);
    });
    return diasAsignados;
  }

  initializeDiasAsignados(): { [key: string]: boolean } {
    const diasAsignados: { [key: string]: boolean } = {};

    this.diasSemana.forEach((dia) => {
      diasAsignados[dia] = false;
    });
    return diasAsignados;
  }

  // funcion de seleccion de dias en caso de que sea actualizacion
  onDiaSeleccionadoUpdate(event: Event): void {
    //  onDiaSeleccionadoUpdate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    const dia = input.value;

    // Actualiza el estado de asignación del día
    this.diasAsignados[dia] = isChecked;

    // Si se marca el día, agrégalo a la lista de días seleccionados
    if (isChecked) {
      this.diasSeleccionados.push(dia);
    } else {
      // Si se desmarca el día, elimínalo de la lista de días seleccionados
      const index = this.diasSeleccionados.indexOf(dia);
      if (index > -1) {
        this.diasSeleccionados.splice(index, 1);
      }
    }

    // Asegúrate de que el día seleccionado se mantenga habilitado
    // this.diasDisponiblesR[dia] = true; // o algún valor predeterminado adecuado
    // this.diasDisponiblesV[dia] = true; // o algún valor predeterminado adecuado

    console.log("Días en selección", this.diasSeleccionados);
    // }

    console.log("dias en seleccion", this.diasSeleccionados);
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
  getSelectedDias(): string[] {
    return Object.keys(this.diasAsignados).filter(
      (dia) => this.diasAsignados[dia]
    );
  }

  getAvailabilityMessage(dia: string): string {
    const repartidor = this.registroRuta.get("selectedRepartidor")?.value;
    const vehiculo = this.registroRuta.get("selectedVehiculo")?.value;

    // Verifica si se ha seleccionado un repartidor o un vehículo
    if (!repartidor && !vehiculo) {
      return "Seleccione un repartidor o un vehículo.";
    }

    // Caso cuando ambos, repartidor y vehículo, están seleccionados
    if (repartidor && vehiculo) {
      if (
        repartidor._id == this.selectedRepartidor?._id &&
        vehiculo._id == this.selectedVehiculo?._id &&
        this.diasAsignados[dia]
      ) {
        return "Este día está asignado y disponible para selección.";
      } else if (
        repartidor._id != this.selectedRepartidor?._id &&
        !this.diasDisponiblesR[dia]
      ) {
        return "Este día no está disponible para el repartidor.";
      } else if (
        vehiculo._id != this.selectedVehiculo?._id &&
        !this.diasDisponiblesV[dia]
      ) {
        return "Este día no está disponible para el vehículo.";
      } else if (this.diasDisponiblesR[dia] && this.diasDisponiblesV[dia]) {
        return "Este día está disponible para el repartidor y el vehículo.";
      } else if (!this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia]) {
        return "Este día no está disponible ni para el repartidor ni para el vehículo.";
      } else if (
        !this.diasDisponiblesR[dia] &&
        this.diasDisponiblesV[dia] &&
        repartidor._id != this.selectedRepartidor?._id &&
        vehiculo._id != this.selectedVehiculo?._id &&
        !this.diasAsignados[dia]
      ) {
        return "Este día no está disponible para el repartidor, pero sí para el vehículo.";
      } else if (this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia]) {
        return "Este día no está disponible para el vehículo, pero sí para el repartidor.";
      }
    }

    // Caso cuando solo se ha seleccionado un repartidor
    if (repartidor && !vehiculo) {
      if (
        repartidor._id == this.selectedRepartidor?._id &&
        this.diasAsignados[dia]
      ) {
        return "Este día está asignado y disponible para selección.";
      } else if (this.diasDisponiblesR[dia]) {
        return "Este día está disponible para el repartidor.";
      } else {
        return "Este día no está disponible para el repartidor.";
      }
    }

    // Caso cuando solo se ha seleccionado un vehículo
    if (vehiculo && !repartidor) {
      if (
        vehiculo._id == this.selectedVehiculo?._id &&
        this.diasAsignados[dia]
      ) {
        return "Este día está asignado y disponible para selección.";
      } else if (this.diasDisponiblesV[dia]) {
        return "Este día está disponible para el vehículo.";
      } else {
        return "Este día no está disponible para el vehículo.";
      }
    }
    return ""; // Por defecto, no se muestra ningún mensaje
  }

  isDiaNoDisponible(dia: string): boolean {
    return (
      (!this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia]) ||
      (!this.diasDisponiblesR[dia] && this.diasDisponiblesV[dia]) ||
      (this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia])
    );
  }
  isDiaNoDisponibleUpdate(dia: string): boolean {
    const repartidor = this.registroRuta.get("selectedRepartidor")?.value;
    const vehiculo = this.registroRuta.get("selectedVehiculo")?.value;

    // Si el día está asignado y coincide con el repartidor y el vehículo seleccionados, está disponible
    if (this.diasAsignados[dia]) {
      if (
        repartidor?._id === this.selectedRepartidor?._id &&
        vehiculo?._id === this.selectedVehiculo?._id
      ) {
        return false; // Mantiene el día asignado disponible
      } else if (
        (repartidor?._id != this.selectedRepartidor?._id &&
          this.diasDisponiblesR[dia]) &&
        (vehiculo?._id != this.selectedVehiculo?._id &&
          this.diasDisponiblesV[dia]
          )
      ) {
        return false;
      }
    }
    if (this.diasDisponiblesR[dia] && this.diasDisponiblesV[dia]) {
      return false; // Día disponible según las nuevas condiciones
    }
    // Verifica si el día no está disponible para ambos (repartidor y vehículo)
    if (
      (!this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia]) ||
      (!this.diasDisponiblesR[dia] && this.diasDisponiblesV[dia]) ||
      (this.diasDisponiblesR[dia] && !this.diasDisponiblesV[dia])  
    ) {
      return true; // Día no disponible según las nuevas condiciones
    }

    // Si no se cumplen las condiciones anteriores, el día no está disponible
    return true;
  }
}

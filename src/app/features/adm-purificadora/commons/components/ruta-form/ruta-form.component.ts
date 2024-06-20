import { DetalleEntregaInterface } from './../../../../../shared/interfaces/detalle-entrega-schema.interface';
import { DetalleEntregaSchema } from './../../../../../shared/models/DetalleEntregaSchema.model';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { Repartidor } from '../../../../../shared/models/repartidor.model';
import { MapaClientDetailUbacionService } from '../../services/mapaClientDetalle.service';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import { Vehiculo } from '../../../../../shared/models/vehiculo.model';
import { ConsultasCOPOMEXService } from '../../../../../shared/services/consultas-copomex.service';
import { ClientesService } from '../../../../../shared/services/clientes.service';
import { Cliente } from '../../../../../shared/interfaces/client.interface';
import { Ruta } from '../../../../../shared/interfaces/ruta.interface';
@Component({
  selector: 'app-ruta-form',
  templateUrl: './ruta-form.component.html',
  styleUrls: ['./ruta-form.component.scss', './checkbox.scss', './tabla.scss']
})
export class RutaFormComponent implements OnInit {
  allClients: Cliente[] = []
  checked: boolean = true;
  visible: boolean = false;
  showOverlay: boolean = false;
  clienteForm!: FormGroup;
  diasSeleccionados: string[] = [];
  selectedMunicipio: any
  selectedColonia: any
  selectedClients: any[] = [];
  allRepartidores: Repartidor[] = [];
  allVehiculos: Vehiculo[] = [];
  allNombreRuta: Ruta[] = [];
  selectedRepartidor: any;
  allMunicipioXEstado: any;
  allColoniaXMuncipio: any;
  filas!: FormArray;
  registroRuta!: FormGroup;

  nombre: string = '';

  guardarNombre() {
    console.log('Nombre guardado:', this.nombre);
  }

  
  customDropdownStyle = {
    'width': '300px',
    'border': '1px solid #ccc',
    'border-radius': '5px',
    'background-color': '#fff',
    'color': '#333'
  };
  customDropdownClass = 'custom-dropdown'; // Agrega tus clases de estilo personalizadas aquí
  constructor(private UserS: ClientesService,
    private rutaSe:RutaService,
    private consultasCOPOMEX: ConsultasCOPOMEXService, private vehiculoService: VehiculoService, private repService: RepartidoresService, private rutaService: RutaService, private render2: Renderer2, private location: Location, private formBuilder: FormBuilder, private mapService: MapaClientDetailUbacionService) {
    this.registroRuta = this.formBuilder.group({
      nombreRuta: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      selectedRepartidor: ['', Validators.required],
      selectedVehiculo: ['', Validators.required],
      diasAsignados: this.formBuilder.array([]),
      filas: this.formBuilder.array([])
    });
    this.filas = this.registroRuta.get('filas') as FormArray;
  }

  onRutaNombreSelectionChange() {
    const selectedId = this.registroRuta.get('nombreRuta')?.value;
    console.log('ID del ruta seleccionado:', selectedId);
  }
  onRepartidorSelectionChange() {
    const selectedId = this.registroRuta.get('selectedRepartidor')?.value;
    console.log('ID del repartidor seleccionado:', selectedId);
  }

  onVehiculoSelectionChange() {
    const selectedId = this.registroRuta.get('selectedVehiculo')?.value;
    console.log('ID del vehiculo seleccionado:', selectedId);
  }

  volverAtras() {
    this.location.back();
    console.log("presionado atras")
  }

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;

  iniciarMapa() {
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

  ngOnInit(): void {
    this.iniciarMapa()
    this.getRepartidores();
    this.getVehiculos()
    this.getMunicipioPorExtado();
    this.getColoniaPorMunicipio()
    this.getUsers()
    this.getAllNombresRutas()
  }

  getRepartidores() {
    this.repService.getRepartidores().subscribe(
      (data: Repartidor[]) => {
        this.allRepartidores = data;
        console.log(this.allRepartidores);
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  getAllNombresRutas() {
    this.rutaSe.getNombreRutas().subscribe(
      (data: DetalleEntregaInterface[]) => {
        this.allNombreRuta = data;
        console.log(this.allNombreRuta);
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  getVehiculos() {
    this.vehiculoService.getVehiculos().subscribe(
      (data: Vehiculo[]) => {
        this.allVehiculos = data;
        console.log(this.allVehiculos);
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }



  getUsers() {
    this.UserS.obtenerCLientes().subscribe(
      (data: Cliente[]) => {
        this.allClients = data;
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }




  onColoniaSelectionChange(event: any, index: number) {

    const filaFormGroup = this.filas.at(index) as FormGroup;

    // Obtén el valor seleccionado de selectedColonia en esa fila
    const selectedColoniaValue = filaFormGroup.get('selectedColonia')?.value;

    // const selectedColoniaValue = this.registroRuta.get('selectedColonia')?.value; // Obtener el valor seleccionado del formulario
    console.log('Colonia seleccionado:', selectedColoniaValue);
    if (selectedColoniaValue === null) {
      return "No ha seleccionado ninguna colonia!"; // Retorna una matriz vacía si el valor seleccionado es nulo
    }
    let filtered: any[] = [];
    for (let colonia of this.allColoniaXMuncipio) {
      if (colonia.toLowerCase().indexOf(selectedColoniaValue.toLowerCase()) == 0) {
        filtered.push(colonia);
      }
    }
    return filtered;
  }




  onMunicipioSelectionChange(event: any, index: number) {
    const filaFormGroup = this.filas.at(index) as FormGroup;

    // Obtén el valor seleccionado de selectedColonia en esa fila
    const selectedMunicipioValue = filaFormGroup.get('selectedMunicipio')?.value;

    // const selectedMunicipioValue = this.registroRuta.get('selectedMunicipio')?.value; // Obtener el valor seleccionado del formulario
    console.log('Municipio seleccionado:', selectedMunicipioValue);
    if (selectedMunicipioValue === null) {
      return "No ha seleccionado ningun Municipio!"; // Retorna una matriz vacía si el valor seleccionado es nulo
    }
    let filtered: any[] = [];
    // let query = event.query;
    for (let municipios of this.allMunicipioXEstado) {
      if (municipios.toLowerCase().indexOf(selectedMunicipioValue.toLowerCase()) == 0) {
        filtered.push(municipios);
      }
    }
    return filtered;
  }

  onClientSelectionChange(event: any) {
    this.selectedClients = event.value;

    if (this.selectedClients.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'No ha seleccionado ningun cliente!',
        icon: 'error',
        position: 'bottom-left',

        toast: true, // Hacer que el alerta sea tipo toast
        timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
      });
      console.log("No ha seleccionado ningun cliente!")// Retorna una matriz vacía si el valor seleccionado es nulo
      // Aquí puedes mostrar un mensaje de error en tu aplicación
    } else {
      console.log('Clientes seleccionados:', this.selectedClients);
      //  console.log('¡No ha seleccionado ningún usuario!');
      // Realiza cualquier operación adicional aquí con los valores seleccionados
    }
    // Realiza cualquier operación adicional aquí con los valores seleccionados
  }


  onDiaSeleccionado(event: any) {
    const isChecked = event.target.checked;
    const dia = event.target.value;

    if (isChecked) {
      this.diasSeleccionados.push(dia);
    } else {
      const index = this.diasSeleccionados.indexOf(dia);
      if (index > -1) {
        this.diasSeleccionados.splice(index, 1);
      }
    }
    console.log(this.diasSeleccionados);
  }


  getColoniaPorMunicipio() {
    this.consultasCOPOMEX.getColoniaXMunicipio().subscribe(
      data => {
        this.allColoniaXMuncipio = data.Colonias;
        console.log("colonias=>", this.allColoniaXMuncipio)
        // console.log(allColonias);
        console.log("objeto=>", data)
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    )
  }


  mostrarToastError(text: string) {
    Swal.fire({
      title: 'Error',
      text: text,
      icon: 'error',
      position: 'bottom-left', // Mostrar el alerta en la parte superior
      toast: true, // Hacer que el alerta sea tipo toast
      timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
    });
    // return;
  }


  obtenerTodosLosMunicipios() {
    const municipiosSeleccionados = this.filas.controls.map(fila => fila.get('selectedMunicipio')?.value);
    return municipiosSeleccionados;
  }

  obtenerTodosLasColonias() {
    const coloniasSeleccionados = this.filas.controls.map(fila => fila.get('selectedColonia')?.value);
    return coloniasSeleccionados;
  }
  obtenerTodosLasClientes() {
    const clientesSeleccionados = this.filas.controls.map(fila => fila.get('selectedClient')?.value);
    return clientesSeleccionados;
  }
  AgregarClienteRuta() {
    const allClients = this.obtenerTodosLasClientes();
    console.log("Clientes seleccionados", allClients);

    const nombreRuta = this.registroRuta.get('nombreRuta')?.value;
    const selectedVehiculo = this.registroRuta.get('selectedVehiculo')?.value;
    const selectedRepartidor = this.registroRuta.get('selectedRepartidor')?.value;
    const diasAsignados = this.diasSeleccionados;

    if (!nombreRuta) {
      this.mostrarToastError('Por favor seleccione el nombre de la ruta');
      return;
    }

    if (!selectedRepartidor) {
      this.mostrarToastError('Seleccione un repartidor');
      return;
    }

    if (!selectedVehiculo) {
      this.mostrarToastError('Selecciona un vehiculo');
      return;
    }

    if (allClients.length === 0) {
      this.mostrarToastError('No ha seleccionado ningún cliente');
      console.log("No ha seleccionado ningún cliente");
      return;
    }

    if (!diasAsignados) {
      this.mostrarToastError('Selecciona los días');
      return;
    }

    // Iterar sobre cada cliente y enviarlo por separado
    allClients.forEach(clienteId => {
      const rutaDetalle: DetalleEntregaSchema = {
        rutaId: nombreRuta,
        repartidorId: selectedRepartidor,
        vehiculoId: selectedVehiculo,
        clienteId: clienteId,  // Asignar el clienteId actual del ciclo
        diasAsignados: diasAsignados  // Utilizar los días asignados comunes a todos los clientes
      };

      console.log("Detalle de entrega:", rutaDetalle);

      // Llamar al servicio para agregar la ruta
      this.rutaService.addRuta(rutaDetalle).subscribe(
        response => {
          console.log("Ruta agregada correctamente:", response);
          Swal.fire({
            title: '¡Perfecto!',
            text: 'Se ha agregado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: false,
          });
        },
        error => {
          console.error("Error al agregar la ruta:", error);
          let errorMessage = "Error desconocido";
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          Swal.fire("Error", errorMessage, 'error');
        }
      );
    });
  }


  getMunicipioPorExtado() {
    this.consultasCOPOMEX.getMunicipioXEstado().subscribe(
      data => {
        this.allMunicipioXEstado = data.municipios;
        console.log(this.allMunicipioXEstado);
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  // getColoniaPorMunicipio() {
  //   this.consultasCOPOMEX.getColoniaXMunicipio(this.selectedMunicipio).subscribe(
  //     data => {
  //       this.allColoniaXMuncipio = data.response.colonia;
  //       console.log(this.allColoniaXMuncipio)
  //     },
  //     error => {
  //       console.log("Ocurrió un error al obtener la información", error);
  //     }
  //   )
  // } 
  // getMunicipioPorExtado() {
  //   this.consultasCOPOMEX.getMunicipioXEstado('Hidalgo').subscribe(
  //     data => {
  //       this.allMunicipioXEstado = data;
  //       console.log(this.allMunicipioXEstado)
  //     },
  //     error => {
  //       console.log("Ocurrió un error al obtener la información", error);
  //     }
  //   )
  // }

  agregarFila() {
    this.filas.push(this.formBuilder.group({
      selectedMunicipio: [''], // Aquí deberías inicializar los valores según tus necesidades
      selectedColonia: [''],
      selectedClient: ['']
    }));
  }
  eliminarFila(index: number) {
    (this.registroRuta.get('filas') as FormArray).removeAt(index);
  }
}

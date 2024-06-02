import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { Ruta } from '../../../../../shared/models/ruta.model';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';



import { Repartidor } from '../../../../../shared/models/repartidor.model';
import { MapaClientDetailUbacionService } from '../../services/mapaClientDetalle.service';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import { Vehiculo } from '../../../../../shared/models/vehiculo.model';
import { ConsultasCOPOMEXService } from '../../../../../shared/services/consultas-copomex.service';


import { ClientesService } from '../../../../../shared/services/clientes.service';
import { Cliente } from '../../../../../shared/interfaces/client.interface';







interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-ruta-form',
  templateUrl: './ruta-form.component.html',
  styleUrls: ['./ruta-form.component.css', './modal.scss', './checkbox.scss', './tabla.scss']
})
export class RutaFormComponent implements OnInit {


  cities!: City[];

  selectedCities!: City[];
  allClients: Cliente[] = []



  visible: boolean = false;
  showOverlay: boolean = false;

  clienteForm!: FormGroup;



  selectedMunicipio: any
  selectedColonia: any
  selectedClients: any[] = [];

  registroRuta!: FormGroup;

  customDropdownStyle = {
    'width': '300px',
    'border': '1px solid #ccc',
    'border-radius': '5px',
    'background-color': '#fff',
    'color': '#333'
  };
  customDropdownClass = 'custom-dropdown'; // Agrega tus clases de estilo personalizadas aquí




  constructor(private UserS: ClientesService, private consultasCOPOMEX: ConsultasCOPOMEXService, private vehiculoService: VehiculoService, private repService: RepartidoresService, private rutaService: RutaService, private render2: Renderer2, private location: Location, private formBuilder: FormBuilder, private mapService: MapaClientDetailUbacionService) {



    this.clienteForm = this.formBuilder.group({
      selectedMunicipio: [''],
      selectedColonia: [''],
      selectedClient: [[]]
    });
    // this.registroRuta = this.formBuilder.group({
    //   nombreRuta: ['', Validators.required],
    //   fechaInicio: ['', Validators.required],
    //   selectedRepartidor: ['', Validators.required],
    // });
  }


  onRepartidorSelectionChange() {
    const selectedId = this.registroRuta.get('selectedRepartidor')?.value;
    console.log('ID del repartidor seleccionado:', selectedId);
    // console.log('Repartidor seleccionado:', this.selectedRepartidor);
  }

  onVehiculoSelectionChange() {
    const selectedId = this.registroRuta.get('selectedVehiculo')?.value;
    console.log('ID del vehiculo seleccionado:', selectedId);
    // console.log('Repartidor seleccionado:', this.selectedRepartidor);
  }





  registrarRuta() {
    const nombreRuta = this.registroRuta.get('nombreRuta')?.value;
    const fechaInicio = this.registroRuta.get('fechaInicio')?.value;
    const selectedRepartidor = this.registroRuta.get('selectedRepartidor')?.value;
    const municipio = this.selectedMunicipio;
    const colonia = this.selectedColonia;
    // const clientes = this.selectedClient;
    // Aquí puedes realizar las operaciones necesarias con el valor de 'nombreRuta'

    if (!nombreRuta) {
      Swal.fire('Error', 'Por favor ingresa tu nombre', 'error');
      return;
    }
    if (!fechaInicio) {
      Swal.fire('Error', 'Por favor ingresa tu fechaInicio', 'error');
      return;
    }
    if (!municipio) {
      Swal.fire('Error', 'Por favor ingresa tu municipio', 'error');
      return;
    }
    if (!colonia) {
      Swal.fire('Error', 'Por favor ingresa tu colonia', 'error');
      return;
    }
    // if (!clientes) {
    //   Swal.fire('Error', 'Por favor selecciona los clientes', 'error');
    //   return;
    // }





    // const RUTA: Ruta = {
    //   // nombre: this.registroRuta.get('nombre')?.value,
    //   // fechaInicio: this.registroRuta.get('email')?.value,
    //   // telefono: this.registroRuta.get('telefono')?.value,
    //   // numCasa: this.registroRuta.get('numCasa')?.value,
    //   // password1: this.registroRuta.get('password1')?.value,
    // }
    // this.rutaService.signUp(RUTA).subscribe(response => {

    //   Swal.fire("Exitoso", "El resgitro fue exitos", 'success')
    // }, (error) => {
    //   console.error(error); // Imprime el error en la consola para depuración
    //   let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
    //   if (error && error.error && error.error.message) {
    //     errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
    //   }
    //   Swal.fire("Error", errorMessage, 'error'); // Mostramos el mensaje de error en la alerta
    // })
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






  agregarCliente() {
    this.visible = true;
  }




  allRepartidores: Repartidor[] = [];
  allVehiculos: Vehiculo[] = [];
  selectedRepartidor: any;
  // selectedMunicipio: any;

  allMunicipioXEstado: any;
  allColoniaXMuncipio: any;


  ngOnInit(): void {
    this.iniciarMapa()
    this.getRepartidores();
    this.getVehiculos()
    this.getMunicipioPorExtado();
    this.getColoniaPorMunicipio()
    this.getUsers()

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
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


  // getUsers() {
  //   this.UserS.obtenerCLientes().subscribe(
  //     (data: Cliente[]) => {
  //       this.allClients = data;
  //       // this.puntosClientesUbicaciones = data.map(cliente => ({
  //       //   longitud: cliente.longitud,
  //       //   latitud: cliente.latitud
  //       // }));
  //       // console.log("longitudes y latitudes =>", this.puntosClientesUbicaciones);
  //       // this.mapaService.setUbicaciones(this.puntosClientesUbicaciones)
  //     },
  //     error => {
  //       console.log("ocurrió un error al obtener la información", error);
  //     }
  //   );
  // }





  onColoniaSelectionChange(event: any) {
    const selectedColoniaValue = this.clienteForm.get('selectedColonia')?.value; // Obtener el valor seleccionado del formulario
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



  // onMunicipioSelectionChange(event: any) {
  //   this.selectedMunicipio = event.target.value;
  //   console.log('Municipio seleccionado:', this.selectedMunicipio);
  // }

  onMunicipioSelectionChange(event: any) {
    const selectedMunicipioValue = this.clienteForm.get('selectedMunicipio')?.value; // Obtener el valor seleccionado del formulario
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

    // console.log('Clientes seleccionados:', this.selectedClients);

    if (this.selectedClients.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'No ha seleccionado ningun cliente!',
        icon: 'error',
        // toast: true, // Hacer que el alerta sea tipo toast
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




  AgregarClienteRuta() {
    const municipio = this.clienteForm.get('selectedMunicipio')?.value;
    const colonia = this.clienteForm.get('selectedColonia')?.value;
    // const selectedClients = this.clienteForm.get('selectedClient')?.value;
    if (this.selectedClients.length === 0) {
      
      Swal.fire({
        title: 'Error!',
        text: 'No ha seleccionado ningun cliente!',
        icon: 'error',
        position: 'bottom-left',
        toast: true, // Hacer que el alerta sea tipo toast
        timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
      });
      return;
      console.log("No ha seleccionado ningun cliente!")// Retorna una matriz vacía si el valor seleccionado es nulo
      // Aquí puedes mostrar un mensaje de error en tu aplicación
    } 
    if (!municipio) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingresa tu municipio',
        icon: 'error',

        position: 'bottom-left', // Mostrar el alerta en la parte superior
        toast: true, // Hacer que el alerta sea tipo toast
        timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
      });
      return;
    }
    if (!colonia) {
      Swal.fire({

        title: 'Error',
        text: 'Por favor ingresa tu colonia',
        icon: 'error',
        position: 'bottom-left', // Mostrar el alerta en la parte superior
        toast: true, // Hacer que el alerta sea tipo toast
        timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
      });
      return;
    }
    // if (!selectedClients) {
    //   Swal.fire({

    //     title: 'Error',
    //     text: 'No seleccionó clientes',
    //     icon: 'error',
    //     position: 'bottom-left', // Mostrar el alerta en la parte superior
    //     toast: true, // Hacer que el alerta sea tipo toast
    //     timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
    //   });
    //   return;
    // }

    // Oculta el diálogo y muestra el mensaje de éxito
    this.visible = false;
    Swal.fire({
      title: 'Perfecto!',
      text: 'Se agregaron los clientes correctamente',
      icon: 'success',
      // toast: true, // Hacer que el alerta sea tipo toast
      timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
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






}

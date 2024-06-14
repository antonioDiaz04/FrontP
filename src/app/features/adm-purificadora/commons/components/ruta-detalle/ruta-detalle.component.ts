import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { DetalleEntregaInterface, PuntoDeEntrega } from '../../../../../shared/interfaces/detalle-entrega-schema.interface';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { Repartidor } from '../../../../../shared/interfaces/repartidor.interface';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import { Vehiculo } from '../../../../../shared/interfaces/vehiculo.interface';
import { ClientesService } from '../../../../../shared/services/clientes.service';
import { Cliente } from '../../../../../shared/interfaces/client.interface';
import { Observable, forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConsultasCOPOMEXService } from '../../../../../shared/services/consultas-copomex.service';
import { MapaClientDetailUbacionService } from '../../services/mapaClientDetalle.service';
import { MapaService } from '../../services/mapa.service';
@Component({
  selector: 'app-ruta-detalle',
  templateUrl: './ruta-detalle.component.html',
  styleUrls: ['./ruta-detalle.component.css', './form.scss', 'tablaStyle.scss', 'inputs.scss']
})

export class RutaDetalleComponent implements OnInit {
  private intervalId: any;
  visible: boolean = false;

  puntosClientesUbicaciones: { longitud: string, latitud: string }[] = [];

  detalleRuta?: DetalleEntregaInterface;
  // dataReponse: Ruta[]=[];
  // detalleVehiculo?: Vehiculo;
  detalleRepartidor?: Repartidor;

  puntosEntrega?: any[] = [];

  idRuta!: string
  clienteFormAdd!: FormGroup;
  allMunicipioXEstado: any;
  allColoniaXMuncipio: any;
  allClients: any;

  selectedMunicipio: any
  selectedColonia: any
  selectedClient: any;
  visitCount: number= 0;
  isLoading = true;//variable rastreador de carga de producto
  constructor(private router: ActivatedRoute,
    private rutaService: RutaService,
    private repartidoresService: RepartidoresService,
    private vehiculoService: VehiculoService,
    private clienteService: ClientesService,
    private formBuilder: FormBuilder,
    private consultasCOPOMEX: ConsultasCOPOMEXService,
    private mapService: MapaClientDetailUbacionService,
    private mapaService: MapaService,
  ) {

    this.clienteFormAdd = this.formBuilder.group({
      selectedMunicipio: ['', Validators.required],
      selectedColonia: ['', Validators.required],
      selectedClient: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.isLoading = true;//comienza la carga/el isLoading esta
    this.idRuta = this.router.snapshot.params['id'];
    this.todo()
    this.getMunicipioPorExtado();
    this.getColoniaPorMunicipio()
    this.getUsers()

  }





  todo() {

    this.rutaService.detalleRutaById(this.idRuta).subscribe((data: DetalleEntregaInterface) => {
      this.detalleRuta = data;
      this.enviarUbicacionesMapa(this.detalleRuta)
      console.log(this.detalleRuta);
    }, error => {
      console.log("ocurrio un error", error)
    })
  }


  enviarUbicacionesMapa(detalleRuta:any){
    this.visitCount++;
    console.log(`Visitado por: ${this.visitCount}`);
    const entregas = detalleRuta.clientesIdsDeEntregas;

    console.log("clientesIdsDeEntregas en enviarUbicacionesMapa:", entregas);
    if (Array.isArray(entregas) && entregas.length > 0) {
      // Accede a las longitudes y latitudes de los clientes
      this.puntosClientesUbicaciones = entregas.map(entrega => {
        console.log("clienteId:", entrega.clienteId);
        return {
          longitud: entrega.clienteId?.longitud,
          latitud: entrega.clienteId?.latitud
        };
      }).filter(ubicacion => ubicacion.longitud && ubicacion.latitud);

      console.log("longitudes y latitudes =>", this.puntosClientesUbicaciones);
      this.mapaService.setUbicaciones(this.puntosClientesUbicaciones);

    } else {
      // En caso de que no haya puntos de entrega o el array esté vacío, limpia los marcadores
      this.mapaService.setUbicaciones([]);
      console.log("No se encontraron puntos de entrega o el array está vacío.");
    }
  }

  

  agregarCliente() {

    this.visible = true;
  }


  agregarClienteEnRuta() {
    this.visible = true;
    const selectedMunicipio = this.clienteFormAdd.get('selectedMunicipio')?.value;
    const selectedColonia = this.clienteFormAdd.get('selectedColonia')?.value;
    const selectedClient = this.clienteFormAdd.get('selectedClient')?.value;

    if (!selectedMunicipio) {
      this.mostrarToastError('Selecciona el municipio');
      return;
    }
    if (!selectedColonia) {
      this.mostrarToastError('Selecciona la colonia');
      return;
    }
    if (!selectedClient) {
      this.mostrarToastError('Selecciona el cliente');
      return;
    }
    function generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);
    }




    const newPuntosDeEntrega = {
      municipio: selectedMunicipio,
      colonia: selectedColonia,
      clienteId: selectedClient._id,
      _id: generateUniqueId()
    }

    this.rutaService.addPuntoEntregaRutaById(this.idRuta, newPuntosDeEntrega).subscribe(response => {
      this.visible = false;
      Swal.fire({
        title: '¡Perfecto!',
        text: 'Se ha agregado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: false,
        // position: 'top-end'
      });
      this.todo()
    }, (error) => {
      console.error(error); // Imprime el error en la consola para depuración
      let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
      if (error && error.error && error.error.message) {
        errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
      }
      Swal.fire("Error", errorMessage, 'error'); // Mostramos el mensaje de error en la alerta
    })
  }

  mostrarToastError(text: string) {
    Swal.fire({
      title: 'Error',
      text: text,
      icon: 'error',
      position: 'bottom-left',
      toast: true,
      timer: 2000
    });
    // return;
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


  onMunicipioSelectionChange(event: any) {
    this.selectedMunicipio = event.value;
    console.log('Municipio seleccionado:', this.selectedMunicipio);
    if (this.selectedMunicipio === null) {
      return "No ha seleccionado ningun Municipio!"; // Retorna una matriz vacía si el valor seleccionado es nulo
    }
    let filtered: any[] = [];
    for (let municipios of this.allMunicipioXEstado) {
      if (municipios.toLowerCase().indexOf(this.selectedMunicipio.toLowerCase()) == 0) {
        filtered.push(municipios);
      }
    }
    return filtered;
  }

  onColoniaSelectionChange(event: any) {
    const selectedColoniaValue = event.value;
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

  onClientSelectionChange(event: any) {

    const selectedId = this.clienteFormAdd.get('selectedClient')?.value;
    this.selectedClient = selectedId._id;

    if (selectedId.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'No ha seleccionado ningun cliente!',
        icon: 'error',
        position: 'bottom-left',
        toast: true, // Hacer que el alerta sea tipo toast
        timer: 2000 // Duración en milisegundos antes de que el alerta se cierre automáticamente
      });
      console.log("No ha seleccionado ningun cliente!")// Retorna una matriz vacía si el valor seleccionado es nulo
    } else {
      console.log('Clientes seleccionado:', selectedId._id);
    }
  }


  eliminarPuntoUbicacion(id: any) {
    this.rutaService.eliminarPuntoEntrega(id).subscribe(data => {
      console.log("eliminarPuntoUbicacion")
      this.todo()
      // this.enviarUbicacionesMapa(this.detalleRuta)
      console.log(this.detalleRuta);
    }, error => {
      console.log("ocurrio un error", error)
    })
  }


  getUsers() {
    this.clienteService.obtenerCLientes().subscribe(
      (data: Cliente[]) => {
        this.allClients = data;
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }




}

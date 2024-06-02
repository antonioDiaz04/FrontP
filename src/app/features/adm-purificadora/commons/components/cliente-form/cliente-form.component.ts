import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../../shared/models/usuario.model';
import { SignupService } from '../../../../../shared/services/signup.service';
import { response } from 'express';
import { error } from 'console';
import { Location } from '@angular/common';
import { MapaClientService } from '../../services/mapaClient.service';
import { ConsultasCOPOMEXService } from '../../../../../shared/services/consultas-copomex.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteFormComponent implements OnInit {

  registroForm: FormGroup;
  allMuncipioXEstado: any;
  allColoniaXMuncipio: any;

  selectedMunicipio: any
  selectedColonia: any


  constructor(private consultasCOPOMEX: ConsultasCOPOMEXService,private render2: Renderer2,private mapService: MapaClientService, private location: Location, private formBuilder: FormBuilder, private clienteS: SignupService) {
    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      longitud: ['', Validators.required],
      latitud: ['', Validators.required],
      telefono: ['', Validators.required],
      numCasa: ['', Validators.required],
      selectedColonia: ['', Validators.required],
      selectedMunicipio: ['', Validators.required],

    });
  }

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;
  
  
  onMunicipioSelectionChange(event: any) {
    this.selectedMunicipio = event.target.value;
    console.log('Municipio seleccionado:', this.selectedMunicipio);
  }

  onColoniaSelectionChange(event: any) {
    this.selectedColonia = event.target.value;
    console.log('Colonia seleccionado:', this.selectedColonia);
  }

  ngOnInit(): void {
    this.getMunicipioPorExtado();
    this.getColoniaPorMunicipio()
    this.mapService.latitudLongitudCambiadas.subscribe(({ latitud, longitud }) => {
      this.registroForm.get('latitud')?.setValue(latitud);
      this.registroForm.get('longitud')?.setValue(longitud);
      
    });



    

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
  registroCliente() {
    const nombre = this.registroForm.get('nombre')?.value;
    const email = this.registroForm.get('email')?.value;
    const longitud = this.registroForm.get('longitud')?.value;
    const latitud = this.registroForm.get('latitud')?.value;
    const telefono = this.registroForm.get('telefono')?.value;
    const numCasa = this.registroForm.get('numCasa')?.value;
    const colonia = this.registroForm.get('selectedColonia')?.value;
    const municipio = this.registroForm.get('selectedMunicipio')?.value;
    // const municipio = this.selectedMunicipio;
    // const colonia = this.selectedColonia;

    if (!municipio) {
      Swal.fire('Error', 'Por favor ingresa tu municipio', 'error');
      return;
    }
    if (!colonia) {
      Swal.fire('Error', 'Por favor ingresa tu colonia', 'error');
      return;
    }

    // Aquí puedes realizar las operaciones necesarias con el valor de 'nombre'
    if (!nombre) {
      Swal.fire('Error', 'Por favor ingresa tu nombre', 'error');
      return;
    }
    if (!email) {
      Swal.fire('Error', 'Por favor ingresa tu email', 'error');
      return;
    }
   
    if (!longitud) {
      Swal.fire('Error', 'Por favor ingresa tu longitud', 'error');
      return;
    }
    if (!latitud) {
      Swal.fire('Error', 'Por favor ingresa tu latitud', 'error');
      return;
    }
    if (!telefono) {
      Swal.fire('Error', 'Por favor ingresa tu telefono', 'error');
      return;
    }
    if (!numCasa) {
      Swal.fire('Error', 'Por favor ingresa tu numCasa', 'error');
      return;
    }

    const USUARIO: Usuario = {


      nombre: this.registroForm.get('nombre')?.value,
      email: this.registroForm.get('email')?.value,
      longitud: this.registroForm.get('longitud')?.value,
      latitud: this.registroForm.get('latitud')?.value,
      telefono: this.registroForm.get('telefono')?.value,
      numCasa: this.registroForm.get('numCasa')?.value,
      municipio: this.selectedMunicipio,
      colonia: this.selectedColonia,
    }
    this.clienteS.signUp(USUARIO).subscribe(response => {

      Swal.fire("Exitoso", "El resgitro fue exitos", 'success')
    }, (error) => {
      console.error(error); // Imprime el error en la consola para depuración
      let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
      if (error && error.error && error.error.message) {
        errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
      }
      
      Swal.fire("Error", errorMessage, 'error'); // Mostramos el mensaje de error en la alerta
    })
  }
  

  volverAtras() {
    this.location.back();
    console.log("presionado atras")
  }





  getMunicipioPorExtado() {
    this.consultasCOPOMEX.getMunicipioXEstado().subscribe(
      data => {
        this.allMuncipioXEstado = data.municipios;
        console.log(this.allMuncipioXEstado);
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );

    // this.consultasCOPOMEX.getMunicipioXEstado('Hidalgo').subscribe(
    //   data => {
    //     // ! lo que hacemos aqui es tomar los valores cuando son obtject[]
    //     this.allMuncipioXEstado = data;
    //     console.log(this.allMuncipioXEstado)
    //   },
    //   error => {
    //     console.log("Ocurrió un error al obtener la información", error);
    //   }
    // )
  }


  getColoniaPorMunicipio() {
    this.consultasCOPOMEX.getColoniaXMunicipio().subscribe(
      data1 => {
        this.allColoniaXMuncipio = data1.Colonias;
        console.log("colonias=>", this.allColoniaXMuncipio)
        // console.log(allColonias);
        console.log("objeto=>", data1)
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    )
  }
}

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
import { Router } from '@angular/router';
import { Toast } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteFormComponent implements OnInit {

  public myAngularxQrCode: string = 'hello';
  registroForm: FormGroup;
  allMuncipioXEstado: any;
  allColoniaXMuncipio: any;

  selectedMunicipio: any
  selectedColonia: any
  constructor(private toast: Toast, private router: Router, private consultasCOPOMEX: ConsultasCOPOMEXService, private render2: Renderer2, private mapService: MapaClientService, private location: Location, private formBuilder: FormBuilder, private clienteS: SignupService) {
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
    this.myAngularxQrCode = 'Nico Antonio';
  } 
  
  title = 'my-new-app';

 

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;

  onMunicipioSelectionChange(event: any) {
    this.selectedMunicipio = event.target.value;
    console.log('Municipio seleccionado:', this.selectedMunicipio);
  }

  onColoniaSelectionChange(event: any) {
    this.selectedColonia = event.target.value;
    console.log('Colonia seleccionado:', this.selectedColonia);
  }

  ngOnInit() {
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
    if (!nombre) {
      this.toast.showToastPmNgWarn('Por favor ingresa tu nombre');
      return;
    }


    if (!email) {
      this.toast.showToastPmNgWarn('Por favor ingresa tu email');
      return;
    }
    if (!telefono) {
      this.toast.showToastPmNgWarn('Por favor ingresa tu telefono');
      return;
    }
    if (!municipio) {
      this.toast.showToastPmNgWarn('Por favor ingresa tu municipio');
      return;
    }
    if (!colonia) {
      this.toast.showToastPmNgWarn('Por favor ingresa tu colonia');
      return;
    }
    if (!longitud && !latitud) {
      this.toast.showToastPmNgWarn('Por favor selecciona tu ubicación');
      return;
    }

    if (!numCasa) {
      this.toast.showToastPmNgWarn('Por favor ingresa tu numCasa');
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
      this.toast.showToastSwalSuccess("El resgitro fue exitos")
      this.router.navigate(['/purificadoraAdm/clientes/lista-clientes'])
    }, (error) => {
      console.error(error);
      let errorMessage = "Error desconocido";
      if (error && error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      this.toast.showToastSwalError(errorMessage);
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
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }


  getColoniaPorMunicipio() {
    this.consultasCOPOMEX.getColoniaXMunicipio().subscribe(
      data1 => {
        this.allColoniaXMuncipio = data1.Colonias;
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    )
  }
}

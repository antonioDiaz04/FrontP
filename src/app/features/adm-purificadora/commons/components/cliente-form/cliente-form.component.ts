import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../../shared/models/usuario.model';
import { SignupService } from '../../../../../shared/services/signup.service';
import { response } from 'express';
import { error } from 'console';
import { Location } from '@angular/common';
import { MapaClientService } from '../../services/mapaClient.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteFormComponent implements OnInit {

  registroForm: FormGroup;

  constructor(private render2: Renderer2,private mapService: MapaClientService, private location: Location, private formBuilder: FormBuilder, private clienteS: SignupService) {
    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      longitud: ['', Validators.required],
      latitud: ['', Validators.required],
      telefono: ['', Validators.required],
      numCasa: ['', Validators.required],
    });
  }

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;


  ngOnInit(): void {
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
}

import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { Location } from '@angular/common';
import { Repartidor } from '../../../../../shared/models/repartidor.model';

@Component({
  selector: 'app-repartidores-form',
  templateUrl: './repartidores-form.component.html',
  styleUrls:  ['./repartidores-form.component.scss']
})
export class RepartidoresFormComponent {

  registroRepartidores!: FormGroup;

  constructor(private repService: RepartidoresService, private render2: Renderer2, private location: Location, private formBuilder: FormBuilder) {
    this.registroRepartidores = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      numCasa: ['', Validators.required], 
      password1: ['', Validators.required], 
    });
  }


  registroRepartidor() {
    const nombre = this.registroRepartidores.get('nombre')?.value;
    const email = this.registroRepartidores.get('email')?.value;
    const telefono = this.registroRepartidores.get('telefono')?.value;
    const numCasa = this.registroRepartidores.get('numCasa')?.value; 
    const password1 = this.registroRepartidores.get('password1')?.value; 
    // Aquí puedes realizar las operaciones necesarias con el valor de 'nombre'

    if (!nombre) {
      Swal.fire('Error', 'Por favor ingresa tu nombre', 'error');
      return;
    }
    if (!email) {
      Swal.fire('Error', 'Por favor ingresa tu email', 'error');
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
  if(!password1) {
      Swal.fire('Error', 'Por favor ingresa tu password', 'error');
      return;
    }


    const REPARTIDOR: Repartidor = {
      nombre: this.registroRepartidores.get('nombre')?.value,
      email: this.registroRepartidores.get('email')?.value,
      telefono: this.registroRepartidores.get('telefono')?.value,
      numCasa: this.registroRepartidores.get('numCasa')?.value,
      password1: this.registroRepartidores.get('password1')?.value,
    }
    this.repService.signUp(REPARTIDOR).subscribe(response => {

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

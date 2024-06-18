import { Location } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculoService } from '../../../../../shared/services/vehiculo.service';
import Swal from 'sweetalert2';
import { Vehiculo } from '../../../../../shared/models/vehiculo.model';

@Component({
  selector: 'app-vehiculo-form',
  templateUrl: './vehiculo-form.component.html',
  styleUrl: './vehiculo-form.component.scss'
})
export class VehiculoFormComponent {
  
  vehiculoForm!:FormGroup

  constructor(private vService: VehiculoService, private render2: Renderer2, private location: Location, private formBuilder: FormBuilder) {
    this.vehiculoForm = this.formBuilder.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      placas: ['', Validators.required],
    });
  }


  registroVehiculo() {
    const marca = this.vehiculoForm.get('marca')?.value;
    const modelo = this.vehiculoForm.get('modelo')?.value;
    const anio = this.vehiculoForm.get('anio')?.value;
    const placas = this.vehiculoForm.get('placas')?.value;
    // Aquí puedes realizar las operaciones necesarias con el valor de 'marca'

    if (!marca) {
      Swal.fire('Error', 'Por favor ingresa tu marca', 'error');
      return;
    }
    if (!modelo) {
      Swal.fire('Error', 'Por favor ingresa tu modelo', 'error');
      return;
    }


    if (!anio) {
      Swal.fire('Error', 'Por favor ingresa tu año', 'error');
      return;
    }
    if (!placas) {
      Swal.fire('Error', 'Por favor ingresa tu placas', 'error');
      return;
    }
    


    const VEHICULO: Vehiculo = {
      marca: this.vehiculoForm.get('marca')?.value,
      modelo: this.vehiculoForm.get('modelo')?.value,
      anio: this.vehiculoForm.get('anio')?.value,
      placas: this.vehiculoForm.get('placas')?.value,
    }
    this.vService.signUp(VEHICULO).subscribe(response => {

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

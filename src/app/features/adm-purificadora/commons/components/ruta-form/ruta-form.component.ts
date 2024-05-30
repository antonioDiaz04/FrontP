import { Location } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RutaService } from '../../../../../shared/services/ruta.service';
import { Ruta } from '../../../../../shared/models/ruta.model';
import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { Repartidor } from '../../../../../shared/models/repartidor.model';

@Component({
  selector: 'app-ruta-form',
  templateUrl: './ruta-form.component.html',
  styleUrls:[ './ruta-form.component.css','./checkbox.scss']
})
export class RutaFormComponent {


  customDropdownStyle = {
    // Agrega tus estilos CSS personalizados aquí
    // Por ejemplo:
    'width': '300px',
    'border': '1px solid #ccc',
    'border-radius': '5px',
    'background-color': '#fff',
    'color': '#333'
  };

  customDropdownClass = 'custom-dropdown'; // Agrega tus clases de estilo personalizadas aquí

  
  registroRuta!: FormGroup;

  constructor(private repService: RepartidoresService,private rutaService: RutaService, private render2: Renderer2, private location: Location, private formBuilder: FormBuilder) {
    
    this.registroRuta = this.formBuilder.group({
      nombreRuta: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      selectedRepartidor: ['', Validators.required],
    });
  }

  onRepartidorSelectionChange() {
    const selectedId = this.registroRuta.get('selectedRepartidor')?.value;
    console.log('ID del repartidor seleccionado:', selectedId);
    // console.log('Repartidor seleccionado:', this.selectedRepartidor);
  }

  registrarRuta() {
    const nombreRuta = this.registroRuta.get('nombreRuta')?.value;
    const fechaInicio = this.registroRuta.get('fechaInicio')?.value;
    const selectedRepartidor = this.registroRuta.get('selectedRepartidor')?.value;
    // Aquí puedes realizar las operaciones necesarias con el valor de 'nombreRuta'

    if (!nombreRuta) {
      Swal.fire('Error', 'Por favor ingresa tu nombre', 'error');
      return;
    }
    if (!fechaInicio) {
      Swal.fire('Error', 'Por favor ingresa tu fechaInicio', 'error');
      return;
    }


    


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




  


  allRepartidores: Repartidor[] = [];
  selectedRepartidor: any;

  // constructor(private repService: RepartidorService) { }

  ngOnInit(): void {
    this.getRepartidores();
  }

  getRepartidores() {
    this.repService.getRepartidores().subscribe(
     ( data:Repartidor[]) => {
        this.allRepartidores = data;
        console.log(this.allRepartidores);
      },
      error => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }
}

import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../../../../shared/services/signup.service';
import Swal from 'sweetalert2';
import { Purificadora } from '../../../../shared/models/purificadora.model';
import { Location } from '@angular/common';
import { ClipboardService } from 'ngx-clipboard';
import { MapaService } from '../../../../shared/services/mapa.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-regitro-purificadora',
  templateUrl: './regitro-purificadora.view.html',
  styleUrl: './regitro-purificadora.view.css',
  encapsulation: ViewEncapsulation.None,
  // standalone: true,
  // imports: [DialogModule, ButtonModule]
  // animations: [NoopAnimationsModule]
})
export class RegitroPurificadoraView implements OnInit {


  registroForm: FormGroup;
  
  
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }


  constructor(private clipboardService: ClipboardService, private mapService: MapaService, private render2: Renderer2, private location: Location, private formBuilder: FormBuilder, private purificadoraServicio: SignupService) {
    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      nombrePurificadora: ['', Validators.required],
      calle: ['', Validators.required],
      estado: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      latitud: [{ value: '', disabled: true }, Validators.required],
      longitud: [{ value: '', disabled: true }, Validators.required],
       numero: ['', Validators.required],
    });
  }

  
  registroCliente() {
    const nombre = this.registroForm.get('nombre')?.value;
    const email = this.registroForm.get('email')?.value;
    const telefono = this.registroForm.get('telefono')?.value;
    const purificadora = this.registroForm.get('nombrePurificadora')?.value;
    const calle = this.registroForm.get('calle')?.value;
    const longitud = this.registroForm.get('longitud')?.value;
    const latitud = this.registroForm.get('latitud')?.value;
    console.log("noombre=>", nombre);
    console.log("Long=>",longitud);
    console.log("Lat=>", latitud);
    const codigoPostal = this.registroForm.get('codigoPostal')?.value;
    const estado = this.registroForm.get('estado')?.value;
    const numero = this.registroForm.get('numero')?.value;
    // Aquí puedes realizar las operaciones necesarias con el valor de 'nombre'

    if (!nombre) {
      Swal.fire('Error', 'Por favor ingresa tu nombre', 'error');
      return;
    }
    if (!email) {
      Swal.fire('Error', 'Por favor ingresa tu email', 'error');
      return;
    }
    if (!purificadora) {
      Swal.fire('Error', 'Por favor ingresa el nombre de la purifiadora', 'error');
      return;
    }
    if (!calle) {
      Swal.fire('Error', 'Por favor ingresa tu calle', 'error');
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
    if (!numero) {
      Swal.fire('Error', 'Por favor ingresa tu numero', 'error');
      return;
    }

    const PURIFICADORA: Purificadora = {
      nombre: this.registroForm.get('nombre')?.value,
      email: this.registroForm.get('email')?.value,
      telefono: this.registroForm.get('telefono')?.value,
      purificadoraNombre: this.registroForm.get('nombrePurificadora')?.value,
      calle: this.registroForm.get('calle')?.value,
      numero: this.registroForm.get('numero')?.value,
      estado: this.registroForm.get('estado')?.value,
      codigoPostal: this.registroForm.get('codigoPostal')?.value,
      longitud: this.registroForm.get('longitud')?.value,
      latitud: this.registroForm.get('latitud')?.value,
      password1: '',
      usuario: '',
    }

// ! modal


    this.purificadoraServicio.addPurificadora(PURIFICADORA).subscribe(response => {

      Swal.fire("Exitoso", "El resgitro fue exitos", 'success')
    }, (error) => {
      // Manejo de error...
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



  // mapa

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;



  ngOnInit(): void {


    this.mapService.latitudLongitudCambiadas.subscribe(({ latitud, longitud }) => {
      this.registroForm.get('latitud')?.setValue(latitud);
      this.registroForm.get('longitud')?.setValue(longitud);
    });

    this.setEstado("registrando");
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


  setEstado(estado: string) {
    localStorage.setItem('estado', estado);
  }



  copiarClave() {
    console.log("hola mundo copy");
    const coordenadasElement = document.getElementById('coordenadas');
    if (coordenadasElement) {
      const coordenadasCopy = coordenadasElement.innerText;
      this.clipboardService.copyFromContent(coordenadasCopy);
    } else {
      console.error("Elemento con ID 'coordenadas' no encontrado.");
    }
  }

}

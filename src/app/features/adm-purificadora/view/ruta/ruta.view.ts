import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RutaService } from '../../../../shared/services/ruta.service';
import Swal from 'sweetalert2';
import { Ruta } from '../../../../shared/models/ruta.model';
import { response } from 'express';
// RutaService
@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.view.html',
  styleUrls: ['ruta.view.scss', './form.scss']
})
export class RutaView {
  visible: boolean = false

  rutaForm!: FormGroup;

  constructor(private router: Router, private rutaService: RutaService, private fb: FormBuilder) {
    this.rutaForm = this.fb.group({
      nombreRuta: ['', Validators.required]
    })
  }



  showAlert(title: any, text: any, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      timer: 2000,
      showConfirmButton: false,
      toast: false,
      position: 'top-end'
    });
  }


  showModal() {
    this.visible = true
  }

  // guardarRuta(){
  guardarRuta() {


    const nombre = this.rutaForm.get('nombreRuta')?.value;

    if (!nombre) {
      this.showAlert('¡Error!', 'Completa correctamente los campos.', 'sucess')
    }

    const RutaData: Ruta = {
      nombreRuta: nombre
    }

    this.rutaService.addNombreRuta(RutaData).subscribe(response => {
      this.visible = false
      this.showAlert('¡Correcto!', 'se agregó correctamente .', 'sucess')
    }, (error) => {
      console.error(error); // Imprime el error en la consola para depuración
      // let errorMessage = "Error desconocido"; // Mensaje por defecto en caso de que no haya un mensaje de error específico
      // if (error && error.error && error.error.message) {
      //   // errorMessage = error.error.message; // Si hay un mensaje de error específico, lo usamos
      // }
      Swal.fire("Error", error.error.msg, 'error'); // Mostramos el mensaje de error en la alerta
    })




  }
  redirectToAdminPurificadora(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/purificadoraAdm/rutas', route]) // Navegación hacia otras páginas públicas
    }
  }
}

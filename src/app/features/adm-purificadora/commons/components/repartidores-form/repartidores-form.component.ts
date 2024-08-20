import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RepartidoresService } from '../../../../../shared/services/rapartidores.service';
import { Location } from '@angular/common';
import { Repartidor } from '../../../../../shared/models/repartidor.model';
import { Toast } from '../../../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SessionService } from '../../../../../core/commons/components/service/session.service';
@Component({
  selector: 'app-repartidores-form',
  templateUrl: './repartidores-form.component.html',
  styleUrls:  ['./repartidores-form.component.scss']
})
export class RepartidoresFormComponent implements OnInit {


  diasSeleccionados: string[] = [];
  registroRepartidores!: FormGroup;
  idPurificadora!: string;
  constructor(private ngxUiLoaderService: NgxUiLoaderService,
    private sessionService: SessionService,private router:Router,private toast: Toast,private repService: RepartidoresService, private render2: Renderer2, private location: Location, private formBuilder: FormBuilder) {
    this.registroRepartidores = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      numCasa: ['', Validators.required],
      password1: ['', Validators.required],
      diasAsignados: this.formBuilder.array([]),
    });
  }


ngOnInit(): void {
    this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
    if (userData) {
      this.idPurificadora = userData;
    }
}





  registroRepartidor() {
    const nombre = this.registroRepartidores.get('nombre')?.value;
    const email = this.registroRepartidores.get('email')?.value;
    const telefono = this.registroRepartidores.get('telefono')?.value;
    const numCasa = this.registroRepartidores.get('numCasa')?.value;
    const password1 = this.registroRepartidores.get('password1')?.value;
    const diasAsignados = this.diasSeleccionados;

    if (!nombre) {
     this.toast.showToastPmNgWarn( 'Por favor ingresa tu nombre');
      return;
    }
    if (!email) {
      this.toast.showToastPmNgWarn( 'Por favor ingresa tu email');
      return;
    }

    if (!diasAsignados) {
      this.toast.showToastPmNgWarn('No tiene ningun dia seleccionado')
      return;
    }


    if (!telefono) {
      this.toast.showToastPmNgWarn('Por favor ingresa tu telefono');
      return;
    }
    if (!numCasa) {
      this.toast.showToastPmNgWarn( 'Por favor ingresa tu numCasa', );
      return;
    }
  if(!password1) {
    this.toast.showToastPmNgWarn('Por favor ingresa tu password');
      return;
    }


    const REPARTIDOR: Repartidor = {
      idPurificadora: this.idPurificadora,
      nombre: this.registroRepartidores.get('nombre')?.value,
      email: this.registroRepartidores.get('email')?.value,
      telefono: this.registroRepartidores.get('telefono')?.value,
      numCasa: this.registroRepartidores.get('numCasa')?.value,
      password1: this.registroRepartidores.get('password1')?.value,
      diasAsignados: diasAsignados
    }
    this.repService.signUp(REPARTIDOR).subscribe(response => {
      this.toast.showToastSwalSuccess( "El resgitro fue exito")
      this.router.navigate(['/purificadoraAdm/repartidore/lista-repartidores']) // Navegación hacia otras páginas públicas
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
  }



  onDiaSeleccionado(event: any) {
    const isChecked = event.target.checked;
    const dia = event.target.value;
    if (isChecked) {
      this.diasSeleccionados.push(dia);
    } else {
      const index = this.diasSeleccionados.indexOf(dia);
      if (index > -1) {
        this.diasSeleccionados.splice(index, 1);
      }
    }
    console.log(this.diasSeleccionados);
  }
}

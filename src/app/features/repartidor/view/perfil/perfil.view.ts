import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SignInService } from '../../../auth/commons/services/sign-in.service';
import { StorageService } from '../../../../core/commons/components/service/storage.service';
import { SessionService } from '../../../../core/commons/components/service/session.service';
import { Router } from '@angular/router';
import { RepartidoresService } from '../../../../shared/services/rapartidores.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.view.html',
  styleUrl: './perfil.view.css'
})
export class PerfilView implements OnInit {

  data: any = {};

  id!: string;
  editMode: boolean=false;


  ngOnInit() {
    this.getData()
  }
  constructor(
    private ngxService: NgxUiLoaderService,
    private repService: RepartidoresService,
    private storageService: StorageService,
    private sessionService: SessionService,
    private router: Router,
  ) {
  }


  toggleEditMode(): void {
    this.editMode = !this.editMode;
    // Puedes agregar lógica para guardar datos aquí
    if (!this.editMode) {
      console.log('Datos guardados:', this.data);
    }
  }

  getData(): void {
    this.ngxService.start();
    const userData = this.sessionService.getId();
    console.log("userData=>", userData)
    if (userData) {
      this.id = userData;
      console.log("id=>", this.id)
      if (this.id) {
        this.repService.detalleUsuarioById(this.id).subscribe((data) => {
          this.data = data;
        })
      }
    }

  }
}

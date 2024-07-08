import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StorageService } from '../../../../core/commons/components/service/storage.service';
import { SessionService } from '../../../../core/commons/components/service/session.service';
import { RepartidoresService } from '../../../../shared/services/rapartidores.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.view.html',
  styleUrl: './inicio.view.css'
})
export class InicioView implements OnInit {
  data: any = {};
  id!: string;
  editMode: boolean = false;
  buttonText: string = 'Recibir';
  buttonColor: string = '#379b91';
  tienesSalidaProgramada!: boolean ;
  constructor(private router: Router, private ngxService: NgxUiLoaderService,
    private repService: RepartidoresService,
    private storageService: StorageService,
    private sessionService: SessionService) {

  }
  ngOnInit(): void {
    this.getData();
  }



  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.buttonText = 'Recibido';
      this.buttonColor = '#dbc165'; // Verde para "Guardar"
    } else {
      this.buttonText = 'Recibir';
      this.buttonColor = '#379b91';
    }
  }

  redirectToAdminPurificadora(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.router.navigate(['/auth/login']) // Navegación hacia la página de inicio de sesión
    } else {
      console.log("llegaste a purificadoraAdm")
      this.router.navigate(['/repartidor', route]) // Navegación hacia otras páginas públicas
    }
  }

  sidebarVisible: boolean = false;
  logout() {
    // Eliminar el token del almacenamiento
    localStorage.removeItem('token'); // o sessionStorage.removeItem('token');
    // Opcional: hacer una solicitud al backend para manejar cualquier estado del lado del servidor
    this.router.navigate(['/auth/login']); // Redirigir a la página de inicio de sesión
  }



  getData(): void {
    this.ngxService.start();


    const userData = this.sessionService.getId();



    if (userData) {
      this.id = userData;
      if (this.id) {
        this.repService.detalleUsuarioSalidaById(this.id).subscribe(data => {
          this.data = data;



          if (this.data == null) {
            this.tienesSalidaProgramada = false;
          } else {
            
            this.tienesSalidaProgramada = true;
          }

        }, error => {
          console.error('Error al actualizar el usuario:', error);
        });
      }
    }
  }
}

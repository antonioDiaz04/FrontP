import { Component, ViewEncapsulation } from "@angular/core";
// import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { catchError, finalize, throwError } from "rxjs";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SignInService } from "../../commons/services/sign-in.service";
import { StorageService } from "../../../../core/commons/components/service/storage.service";
import { SessionService } from "../../../../core/commons/components/service/session.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ERol } from "../../../../shared/constants/rol.enum";

@Component({
  selector: "app-iniciar-sesion",
  templateUrl: "./iniciar-sesion.view.html",
  styleUrls: ["./frm.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IniciarSesionView {
  loginForm: FormGroup;
  errorMessage!: string;
  userROL!: string;
  public loading = false;
  constructor(
    private ngxService: NgxUiLoaderService,
    private signInService: SignInService,
    private storageService: StorageService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password1: ["", Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      // Mostrar alerta si los campos están vacíos
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const email = this.loginForm.value.email;
    const password1 = this.loginForm.value.password1;

    // Iniciar el loading
    this.ngxService.start();

    // Temporizador para detener el loading después de 3 segundos
    const loadingTimeout = setTimeout(() => {
      this.ngxService.stop();
    }, 3000); // 3000 ms = 3 segundos

    
    this.loading = true;  // Mostrar el loading al iniciar el login
    // Llamar al servicio de inicio de sesión
    this.signInService
      .signIn({ email, password1 })
      .pipe(
        // Manejar errores en la solicitud
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = error.error.message || "Error en la solicitud";
          Swal.fire({
            title: "Error!",
            text: this.errorMessage,
            icon: "error",
            confirmButtonText: "Ok",
          });
          // Detener el loading en caso de error
          clearTimeout(loadingTimeout); // Limpiar el temporizador si hay un error
          this.ngxService.stop();
          return throwError(this.errorMessage);
        }),
        // Asegurarse de detener el loading al finalizar la solicitud (ya sea éxito o error)
        finalize(() => {
          // Limpiar el temporizador en caso de éxito para evitar detener el loading prematuramente
          clearTimeout(loadingTimeout);
          this.ngxService.stop();
        })
      )
      .subscribe(
        (response) => {
          // Al recibir una respuesta exitosa
          if (response) {
            this.storageService.setToken(response.token);
            const userData = this.sessionService.getUserData();
            if (userData) {
              this.userROL = userData.rol;
              if (this.userROL === ERol.ADMIN) {
                this.router.navigate(["admin/inicio"]);
              } else if (this.userROL === ERol.ADMPRF) {
                this.router.navigate(["purificadoraAdm/Home"]);
              } else if (this.userROL === ERol.REPARTIDOR) {
                this.router
                  .navigate(["repartidor/Home"])
                  .then(() => window.location.reload());
              }
            }
          }
        },
        (err) => {
          // Manejo de errores si ocurre un error en el subscribe
          this.loading = false;
        }
      );
  }
}

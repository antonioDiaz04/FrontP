import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { catchError, finalize, throwError } from 'rxjs';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SignInService } from '../../commons/services/sign-in.service';
import { StorageService } from '../../../../core/commons/components/service/storage.service';
import { SessionService } from '../../../../core/commons/components/service/session.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ERol } from '../../../../shared/constants/rol.enum';
// import { catchError } from 'rxjs';
@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.view.html',
  styleUrl: './iniciar-sesion.view.css',
  encapsulation: ViewEncapsulation.None
})
export class IniciarSesionView {
  loginForm: FormGroup;
  errorMessage!: string;
  userROL!: string;
  
  constructor(
    private ngxService: NgxUiLoaderService,
    private signInService: SignInService,
    private storageService: StorageService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    // private toastr: ToastrService,
    private router: Router,
    // private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }



  ngOnInit() { }




  login(): void {
    const correo = this.loginForm.value.correo;
    const pass = this.loginForm.value.pass;
    console.log("correo=>",correo)
    console.log("pass=>", pass)
    this.ngxService.start();
    this.signInService
      .signIn({ correo, pass }) 
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = error.error.message || 'Error en la solicitud';
          Swal.fire({
            title: 'Error!',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          return throwError(this.errorMessage);
        }),
        finalize(() => {
          this.ngxService.stop();
        })
      )
      .subscribe((response) => {
        if (response) {
          this.storageService.setToken(response.token);
          const userData = this.sessionService.getUserData();
          if (userData) {
            this.userROL = userData.rol;
            if (this.userROL === ERol.ADMIN) {
              console.log("redireccion")
              this.router.navigate(['admin/inicio'])
                .then(() => {

                  window.location.reload();




                });

              // window.location.reload();
            } else if (this.userROL === ERol.CLIENT) {
              this.router.navigate(['/']).then(() => {
                window.location.reload();
              });
            }
          }
        }
      });
  }
  
}

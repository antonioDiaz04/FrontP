import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { Usuario } from "../../../../../shared/models/usuario.model";
import { SignupService } from "../../../../../shared/services/signup.service";
import { response } from "express";
import { error } from "console";
import { Location } from "@angular/common";
import { MapaClientService } from "../../services/mapaClient.service";
import { ConsultasCOPOMEXService } from "../../../../../shared/services/consultas-copomex.service";
import { Router } from "@angular/router";
import { Toast } from "../../../../../shared/services/toast.service";
import {
  Colonia,
  Municipio,
} from "../../../../../shared/models/DireccionSchema.model";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SessionService } from "../../../../../core/commons/components/service/session.service";
import { ClientesService } from "../../../../../shared/services/clientes.service";

@Component({
  selector: "app-cliente-form",
  templateUrl: "./cliente-form.component.html",
  styleUrls: ["./cliente-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClienteFormComponent implements OnInit {
  public myAngularxQrCode: string = "hello";
  registroForm: FormGroup;
  allMuncipioXEstado: any;
  allColoniaXMuncipio: any;
  idPurificadora!: string;
  municipio!: Municipio[];
  colonias!: Colonia[];
  data!: string;
  selectedMunicipio: any;
  selectedColonia: any;
  municipioId!: string;
  constructor(
    private toast: Toast,
    private router: Router,
    private consultasCOPOMEX: ConsultasCOPOMEXService,
    private render2: Renderer2,
    private mapService: MapaClientService,
    private location: Location,
    private formBuilder: FormBuilder,
    private clienteS: SignupService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private sessionService: SessionService,
    private clientesService: ClientesService
  ) {
    this.registroForm = this.formBuilder.group({
      nombre: ["", Validators.required],
      email: ["", Validators.required],
      longitud: ["", Validators.required],
      latitud: ["", Validators.required],
      telefono: ["", Validators.required],
      numCasa: ["", Validators.required],
      selectedColonia: [0],
      selectedMunicipio: [0],
    });
    this.myAngularxQrCode = "Nico Antonio";
  }

  title = "my-new-app";

  @ViewChild("asGeocoder") asGeocoder!: ElementRef;

  onMunicipioSelectionChange(event: any) {
    this.selectedMunicipio = event.target.value;
    console.log("Municipio seleccionado:", this.selectedMunicipio);
  }

  onColoniaSelectionChange(event: any) {
    this.selectedColonia = event.target.value;
    console.log("Colonia seleccionado:", this.selectedColonia);
  }

  getData(): void {
    this.ngxUiLoaderService.start();
    const userData = this.sessionService.getId();
    if (userData) {
      this.idPurificadora = userData;

      if (this.idPurificadora) {
        this.clientesService
          .purificadora(this.idPurificadora)
          .subscribe((data) => {
            this.data = data;
            this.municipioId = data.municipioId._id;
            this.selectedMunicipio = data.municipioId.municipio;
            console.log(data.municipioId._id);
            console.log(this.municipioId);

            if (this.municipioId) {
              this.consultasCOPOMEX
                .getColoniaXMunicipio(this.municipioId)
                .subscribe(
                  (data1) => {
                    this.allColoniaXMuncipio = data1[0].colonias;
                  },
                  (error) => {
                    console.log(
                      "Ocurrió un error al obtener la información",
                      error
                    );
                  }
                );
            }
          });
      }
    }
  }

  ngOnInit() {
    this.getData();
    this.getMunicipioPorExtado();
    this.mapService.latitudLongitudCambiadas.subscribe(
      ({ latitud, longitud }) => {
        this.registroForm.get("latitud")?.setValue(latitud);
        this.registroForm.get("longitud")?.setValue(longitud);
      }
    );

    this.mapService
      .buildMap()
      .then(({ geocoder, map }) => {
        this.render2.appendChild(
          this.asGeocoder.nativeElement,
          geocoder.onAdd(map)
        );
        console.log("Perfecto |");
      })
      .catch((err) => {
        // console.log("Error *** ", err);
      });
    this.mapService.cbAddress.subscribe((getPoint) => {
      console.log("*** getPoint", getPoint);
    });
  }

  // getData(): void {
  //   this.ngxService.start();
  //   const userData = this.sessionService.getId();
  //   console.log("userData=>", userData)
  //   if (userData) {
  //     this.id = userData;
  //     console.log("id=>", this.id)
  //     if (this.id) {
  //       this.clientesService.purificadora(this.id).subscribe((data) => {
  //         this.data = data;
  //         console.log(data)
  //       })
  //     }
  //   }
  // }

  registroCliente() {
    const nombre = this.registroForm.get("nombre")?.value;
    const email = this.registroForm.get("email")?.value;
    const longitud = this.registroForm.get("longitud")?.value;
    const latitud = this.registroForm.get("latitud")?.value;
    const telefono = this.registroForm.get("telefono")?.value;
    const numCasa = this.registroForm.get("numCasa")?.value;
    const colonia = this.registroForm.get("selectedColonia")?.value;
    const municipio = this.municipioId;
    if (!nombre) {
      this.toast.showToastPmNgWarn("Por favor ingresa tu nombre");
      return;
    }

    if (!email) {
      this.toast.showToastPmNgWarn("Por favor ingresa tu email");
      return;
    }
    if (!telefono) {
      this.toast.showToastPmNgWarn("Por favor ingresa tu telefono");
      return;
    }
   
    if (colonia == 0) {
      this.toast.showToastPmNgWarn("Por favor ingresa tu colonia");
      return;
    }
    if (!longitud && !latitud) {
      this.toast.showToastPmNgWarn("Por favor selecciona tu ubicación");
      return;
    }

    if (!numCasa) {
      this.toast.showToastPmNgWarn("Por favor ingresa tu numCasa");
      return;
    }

    const USUARIO: Usuario = {
      idPurificadora: this.idPurificadora,
      nombre: this.registroForm.get("nombre")?.value,
      email: this.registroForm.get("email")?.value,
      longitud: this.registroForm.get("longitud")?.value,
      latitud: this.registroForm.get("latitud")?.value,
      telefono: this.registroForm.get("telefono")?.value,
      numCasa: this.registroForm.get("numCasa")?.value,
      municipioId: this.municipioId,
      colonia: this.selectedColonia,
    };
    this.clienteS.signUp(USUARIO).subscribe(
      (response) => {
        this.toast.showToastSwalSuccess("El resgitro fue exitoso");
        this.router.navigate(["/purificadoraAdm/cliente/lista-clientes"]);
      },
      (error) => {
        console.error(error);
        let errorMessage = "Error desconocido";
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.toast.showToastSwalError(errorMessage);
      }
    );
  }

  volverAtras() {
    this.location.back();
    console.log("presionado atras");
  }

  getMunicipioPorExtado() {
    this.consultasCOPOMEX.getMunicipioXEstado().subscribe(
      (data) => {
        this.allMuncipioXEstado = data.municipios;
      },
      (error) => {
        console.log("Ocurrió un error al obtener la información", error);
      }
    );
  }

  // getColoniaPorMunicipio() {
  //   // let municipio = "Huejutla de Reyes";
  //   console.log(this.municipioId)

  //   this.consultasCOPOMEX.getColoniaXMunicipio(this.municipioId).subscribe(
  //     (data1) => {
  //       this.allColoniaXMuncipio = data1[0].colonias;
  //     },
  //     (error) => {
  //       console.log("Ocurrió un error al obtener la información", error);
  //     }
  //   );
  // }
}

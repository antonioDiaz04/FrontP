import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutaService } from '../../../../../shared/services/ruta.service';
// import { Ruta } from '../../../../../shared/models/ruta.model';
import { Repartidor } from '../../../../../shared/models/repartidor.model';
import { Ruta } from '../../../../../shared/interfaces/ruta.interface';
// import { Repartidor } from '../../interfaces/repartidores/repartidores.interface';

@Component({
  selector: 'app-ruta-listado',
  templateUrl: './ruta-listado.component.html',
  styleUrl:'../../../adm-purificadora.component.scss'
})
export class RutaListadoComponent implements OnInit {
  // getRutas


  allRutas?: Ruta[] = [];
  constructor(private rutaS: RutaService, private router: Router) {

  }
  ngOnInit(): void {
    this.obtenerRutas();
  }

  obtenerRutas() {
    this.rutaS.getRutas().subscribe(
      data => {
        this.allRutas = data;
        // this.allRepartidorData = data.repartidorId;
        console.log(this.allRutas);
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  eliminarRuta(id: any) {
    this.rutaS.eliminarRuta(id).subscribe(data => {
      this.obtenerRutas();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  detalleById(id: any) {
    this.rutaS.detalleRutaById(id).subscribe(data => {
      console.log("detallado...")
      this.router.navigate(['/purificadoraAdm/rutas/detalleByIdRutaFrom/', id]) // Navegación hacia otras páginas públicas
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  editar(_id: any) {
    this.router.navigate(['/purificadoraAdm/rutas/editarByIdRutaFrom/', _id])
    // this.id = _id;
    // console.log("esEditar", _id);
    // if (_id) {
    //   this.rutaS.detalleRutaById(this.id).subscribe((data) => {
    //     this.selectedNombreRuta = data.rutaId;
    //     this.selectedRepartidor = data.repartidorId;
    //     this.selectedVehiculo = data.vehiculoId;

    //     this.salidaForm.patchValue({
    //       nombreRuta: data.rutaId,
    //       selectedRepartidor: data.repartidorId,
    //       selectedVehiculo: data.vehiculoId,
    //       cantidadBotellas: data.cantidadBotellas

    //     });

    //     if (data.fechaInicio !== null && data.fechaInicio !== undefined) {
    //       let fechaInicioDate = data.fechaInicio instanceof Date ? data.fechaInicio : new Date(data.fechaInicio);
    //       const fechaFormateada = fechaInicioDate.toISOString().substring(0, 10);
    //       this.salidaForm.patchValue({
    //         fecha: fechaFormateada,
    //       });
    //     } else {
    //       this.salidaForm.patchValue({
    //         fecha: null,
    //       });
    //     }



    //     console.log("Fecha inicio:", data.fechaInicio); // Verifica que el valor es correcto

    //     // Mueve la ruta seleccionada al principio del array
    //     this.allNombreRuta = this.allNombreRuta.filter(ruta => ruta._id !== data.rutaId._id);
    //     this.allNombreRuta.unshift(data.rutaId);

    //     this.allRepartidores = this.allRepartidores.filter(repartidor => repartidor._id !== data.repartidorId._id);
    //     this.allRepartidores.unshift(data.repartidorId);

    //     this.allVehiculos = this.allVehiculos.filter(vehiculo => vehiculo._id !== data.vehiculoId._id);
    //     this.allVehiculos.unshift(data.vehiculoId);

    //   });
    // }
    // this.visible = true;
  }

}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
// import { RutaService } from '../../../../../shared/services/ruta.service';
// import { Subscription, interval } from 'rxjs';

// export interface ClienteInterface {
//   _id: string;
//   nombre: string;
//   email: string;
//   longitud: string;
//   latitud: string;
//   telefono: string;
//   numCasa: string;
//   municipio: string;
//   colonia: string;
//   estatus: string;
//   rol: string;
//   password1: string;
//   fechaDeRegistro: string;
//   __v: number;
// }

// export interface PuntoDeEntregaInterface {
//   _id: string;
//   cantidadEntregada: number;
//   clienteId: ClienteInterface;
// }

// export interface RepartidorInterface {
//   _id: string;
//   nombre: string;
//   email: string;
//   password1: string;
//   telefono: string;
//   numCasa: string;
//   fechaDeAgregacion: string;
//   rol: string;
//   __v: number;
//   diasAsignados: string[];
// }

// export interface VehiculoInterface {
//   _id: string;
//   marca: string;
//   modelo: string;
//   anio: number;
//   placas: string;
//   __v: number;
//   diasAsignados: string[];
// }

// export interface DetalleEntregaInterface {
//   _id: string;
//   nombreRuta: string;
//   repartidorId: RepartidorInterface;
//   vehiculoId: VehiculoInterface;
//   estado: string;
//   cantidadBotellas: number;
//   cantidadContada?: number; // Agrega esta propiedad si es necesaria
//   puntosDeEntrega: PuntoDeEntregaInterface[];
//   diasSalida: string;
//   fechaSalida: string;
//   __v: number;
//   diasAsignados: string;
//   esSalida: boolean;
// }

// @Component({
//   selector: 'app-entrada-lista',
//   templateUrl: './entrada-lista.component.html',
//   styleUrls: ['../../../adm-purificadora.component.scss', '../../../form.scss'],
// })
// export class EntradaListaComponent implements OnInit, OnDestroy {
//   allRutas: DetalleEntregaInterface[] = [];
//   paginatedRutasDetalles: DetalleEntregaInterface[] = [];
//   totalRecords: number = 0;
//   rows: number = 5;
//   first: number = 0;
//   estadoinput: boolean = true;
//   ruta!: DetalleEntregaInterface[];
//   inputNumberValue: number | null = null; // Valor del campo de entrada
//   mostrarBotonGuardar: boolean = false; // Controla la visibilidad del botón


//   private pollingSubscription: Subscription | undefined;

//   constructor(private rutaS: RutaService, private router: Router) {}

//   ngOnInit(): void {
//     this.obtenerRutas();
//     // this.startPolling();
//   }

//   ngOnDestroy(): void {
//     this.stopPolling();
//   }

//   obtenerRutas() {
//     this.rutaS.getRutasSalidas().subscribe(
//       (data: DetalleEntregaInterface[]) => {
//         console.log(data);
//         this.ruta = data;
//         // Filtrar los datos para solo incluir los que tienen fechaProgramada
//         const rutasConFechaProgramada = data.filter(
//           (ruta: DetalleEntregaInterface) => ruta.fechaSalida
//         );
//         console.log(rutasConFechaProgramada);
//         this.allRutas = rutasConFechaProgramada;
//         this.totalRecords = this.allRutas.length;
//         this.updatePaginatedRutasDetalles();
//       },
//       (error) => {
//         console.log('Ocurrió un error al obtener la información', error);
//       }
//     );
//   }

//   updatePaginatedRutasDetalles() {
//     this.paginatedRutasDetalles = this.allRutas.slice(
//       this.first,
//       this.first + this.rows
//     );
//   }

//   calcularSobrantes(ruta: DetalleEntregaInterface): number {
//     let totalEntregado = 0;
//     ruta.puntosDeEntrega.forEach((punto: { cantidadEntregada: number }) => {
//       totalEntregado += punto.cantidadEntregada || 0;
//     });
//     const cantidadBotellas = ruta.cantidadBotellas || 0;
//     return cantidadBotellas - totalEntregado;
//   }

//   eliminarRuta(id: string) {
//     this.rutaS.eliminarRuta(id).subscribe(
//       () => {
//         this.obtenerRutas();
//       },
//       (error) => {
//         console.log('Ocurrió un error', error);
//       }
//     );
//   }

//   editar(id: string) {
//     this.router.navigate(['/purificadoraAdm/salida/edit-salida/', id]);
//   }

//   disablein(estado: string): boolean {
//     return estado == 'terminado' ? false : true;
//   }

//   getEstado(ruta: any): string {
//     return ruta.estado === 'recibido' ? 'en proceso' : ruta.estado;
//   }

//   onPageChange(event: any) {
//     // Método para manejar el cambio de página
//     this.first = event.first;
//     this.rows = event.rows;
//     // Realiza la carga de datos según la nueva página
//     // this.loadData();
//   }

//   // Método para calcular la cantidad total entregada
//   calcularCantidadTotalEntregada(ruta: any): number {
//     if (!ruta.puntosDeEntrega) return 0;
//     return ruta.puntosDeEntrega.reduce((total: number, punto: any) => {
//       return total + (punto.cantidadEntregada || 0);
//     }, 0);
//   }

//   recibirRuta(id: string) {
//     this.estadoinput=false
//     this.mostrarBotonGuardar=true

//   }

//   startPolling() {
//     this.pollingSubscription = interval(5000).subscribe(() => {
//       this.obtenerRutas();
//     });
//   }

//   stopPolling() {
//     if (this.pollingSubscription) {
//       this.pollingSubscription.unsubscribe();
//     }
//   }

//   onInputNumberChange(event: any) {
//     const value = event.value;  // Valor del campo de entrada
//     this.inputNumberValue = value;
//     this.mostrarBotonGuardar = value !== null && value !== 0; // Muestra el botón si el valor no es null y no es cero
//     console.log('Valor cambiado:', this.inputNumberValue);
//   }

//   // Método para guardar los cambios
//   guardarCambios() {
//     console.log('Guardando cambios:', this.inputNumberValue);
//     // Implementa la lógica para guardar los cambios
//   }

// }

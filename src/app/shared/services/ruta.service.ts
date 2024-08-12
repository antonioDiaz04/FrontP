import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RutaService {
  constructor(private http: HttpClient) {}

  getRutasSalidas(): Observable<any> {
    return this.http.get(`${environment.api}/purificadoraAdmin/salidaActual`);
  }

  detalleRutaById(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/ruta/` + id;
    return this.http.get(url);
  }
  updateRepartidora(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id;

    return this.http.put(url, cliente);
  }
  // updateRutaEntregaDetalle(id: string, cliente: any): Observable<any> {
  //   const url = `${environment.api}/ruta/updateRutaDetalle/` + id
  //   return this.http.put(url, cliente)
  // }
  updateRuta(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/ruta/` + id;
    return this.http.put(url, cliente);
  }

  eliminarRuta(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/ruta/` + id;
    return this.http.delete(url);
  }

  getRutasByRepartidor(repartidorId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.api}/purificadoraAdmin/byRepartidor/${repartidorId}`
    );
  }
  diasDisponiblesByRuta(repartidorId: string): Observable<any[]> {
    return this.http.get<any[]>(
      // http://localhost:4000/purificadoraAdmin/diasDisponiblesByRuta/66a27fe1d112e8038fbc0c2d
      `${environment.api}/purificadoraAdmin/diasDisponiblesByRuta/${repartidorId}`
    );
  }

  getRutasByVehiculo(vehculoId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.api}/purificadoraAdmin/byVehiculo/${vehculoId}`
    );
  }

  eliminarPuntoEntrega(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/clienteRuta/` + id;
    return this.http.delete(url);
  }

  addRuta(data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/ruta/`;
    return this.http.post(url, data);
  }
  addSalida(data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/salida/`;
    return this.http.post(url, data);
  }
  updateSalida(id: string, data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/salida/${id}`;
    return this.http.put(url, data);
  }
  updateEstadoSalida(id: string, estado: any): Observable<any> {
    // `${environment.api}/purificadoraAdmin/salidaActual/{id}, ${ estado }`
    // const url = `${environment.api}/purificadoraAdmin/salidaActual/{id}, ${ estado }`
    return this.http.put(
      `${environment.api}/purificadoraAdmin/salidaEstado/${id}`,
      { estado }
    );
  }
  // const url = `${environment.api}/purificadoraAdmin/salidacantidad/${idSalida}/${clienteId}`;
  enviarCantidad(body:any): Observable<any> {
  return this.http.put<any>(`${environment.api}/purificadoraAdmin/salidacantidad/`, body);
}

  addPuntoEntregaRutaById(id: string, data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/cliente/` + id;
    return this.http.post(url, data);
  }

  getRutas(): Observable<any> {
    return this.http.get(`${environment.api}/purificadoraAdmin/rutas`);
  }

  // detalleRutaById(id: string): Observable<any> {
  //   const url = `${environment.api}/purificadoraAdmin/getDetallesRutaById/` + id
  //   return this.http.get(url)
  // }

  // updateRepartidora(id: string, cliente: any): Observable<any> {
  //   const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id
  //   return this.http.put(url, cliente)
  // }

  // eliminarRuta(id: string): Observable<any> {
  //   const url = `${environment.api}/purificadoraAdmin/deleteRuta/` + id
  //   return this.http.delete(url)
  // }

  // eliminarPuntoEntrega(id: string): Observable<any> {
  //   const url = `${environment.api}/purificadoraAdmin/clienteInRuta/` + id
  //   return this.http.delete(url)
  // }
}

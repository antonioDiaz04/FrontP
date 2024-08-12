import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RepartidoresService {
  constructor(private http: HttpClient) {}
  // !mover a otro servicio
  getRepartidores(): Observable<any> {
    return this.http.get(
      `${environment.api}/purificadoraRepartidores/repartidores`
    );
  }
  getRepartidoresVehiculosDisponibles(): Observable<any> {
    return this.http.get(
      `${environment.api}/purificadoraAdmin/repartidoresYvehiculosDisponibles`
    );
  }
  obtenerRepartidoresSinRutas(): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/repartidoresExRutas/`;
    return this.http.get(url);
  }

  detalleUsuarioById(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/getDetalles/` + id;
    return this.http.get(url);
  }

  detalleUsuarioSalidaById(id: string): Observable<any> {
    const url =
      `${environment.api}/purificadoraRepartidores/getObtenerSalidaxClienteId/` +
      id;
    return this.http.get(url);
  }
  updateRepartidora(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id;
    return this.http.put(url, cliente);
  }
  eliminarRepartidores(id: string): Observable<any> {
    const url =
      `${environment.api}/purificadoraRepartidores/deleteRepartidor/` + id;
    return this.http.delete(url);
  }
  signUp(data: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/repartidor/`;
    return this.http.post(url, data);
  }
}

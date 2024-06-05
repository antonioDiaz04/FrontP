import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  constructor(private http: HttpClient) { }
  
  getRutas(): Observable<any> {
    return this.http.get(`${environment.api}/purificadoraAdmin/getRutas`);
  }

  detalleUsuarioById(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/getDetalles/` + id
    return this.http.get(url)
  }
  updateRepartidora(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id
    return this.http.put(url, cliente)
  }

  eliminarRuta(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/deleteRuta/` + id
    return this.http.delete(url)
  }



  addRuta(data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/crearRuta/`
    return this.http.post(url, data)
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RepartidoresService {

    constructor(private http: HttpClient) { }
    // !mover a otro servicio
    getRepartidores(): Observable<any> {
        return this.http.get(`${environment.api}/purificadoraRepartidores/obtenerRepartidores`);
    }
    
    detalleUsuarioById(id: string): Observable<any> {
        const url = `${environment.api}/purificadoraRepartidores/getDetalles/` + id
        return this.http.get(url)
    }
    updateRepartidora(id: string, cliente: any): Observable<any> {
        const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id
        return this.http.put(url, cliente)
    }


    eliminarRepartidores(id: string): Observable<any> {
        const url = `${environment.api}/purificadoraRepartidores/deleteRepartidor/` + id
        return this.http.delete(url)
    }



    signUp(data: any): Observable<any> {
        const url = `${environment.api}/purificadoraRepartidores/crearRepartidores/`
        return this.http.post(url, data)
    }


}


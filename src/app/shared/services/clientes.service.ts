import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }



  obtenerPurificadoras(): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/getPuricadoras`;
    return this.http.get(url);
  }


  eliminarPurificadora(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/deletePurificadora/`+id
    return this.http.delete(url)
  }




}

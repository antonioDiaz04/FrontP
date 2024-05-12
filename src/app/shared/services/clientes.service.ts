import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http:HttpClient) { }

  url = 'https://apipurificadora.onrender.com/usuarios/getUsuarios';

  obtenerUsuarios(): Observable<any> {
    return this.http.get(this.url);
  }
}

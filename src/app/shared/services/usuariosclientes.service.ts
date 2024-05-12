import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosclientesService {

  constructor(private http:HttpClient) { }

  getUsuarios():Observable<any>{

    return this.http.get(`${environment.api}/usuarios/getUsuarios`)
  }


}

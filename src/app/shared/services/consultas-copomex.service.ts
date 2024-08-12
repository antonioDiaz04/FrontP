import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as data from "../Json/municipioEstado.json";
import * as data1 from "../Json/coloniasMunicipio.json";

@Injectable({
  providedIn: 'root'
})
export class ConsultasCOPOMEXService {



  info: any = {}
  cargada = false;

  
  constructor(private http: HttpClient) { }

  getMunicipioXEstado(): Observable<any> {
    return of(data);
  }
  
  // getColoniaXMunicipio(): Observable<any> {
  //   return of(data1);
  // }
  // getColoniaXMunicipio(): Observable<any> {
  //   return of(data1);
  // }

  // getMunicipioXEstado(Estado: string): Observable<any> {
  //   return this.http.get(`${environment.apiCOPOMEX}get_municipio_por_estado/${Estado}?token=${environment.tokenCOPOMEX}`)
  // }
  
  getColoniaXMunicipio(municipio: string): Observable<any> {
    // http://localhost:4000/direccion/coloniasByMunicipio/Huejutla de Reyes
      const url = `${environment.api}/direccion/coloniasByMunicipio/`;
    return this.http.post(url, {municipio});
  }
  getColoniaXMunicipioByClientes(municipio: string): Observable<any> {
    // http://localhost:4000/direccion/coloniasByMunicipio/Huejutla de Reyes
      const url = `${environment.api}/direccion/getColoniasByMunicipioByClientes/`;
    return this.http.post(url, {municipio});
  }
  // updateRuta(id: string, cliente: any): Observable<any> {
  //   const url = `${environment.api}/purificadoraAdmin/ruta/` + id;
  //   return this.http.put(url, cliente);
  // }




}

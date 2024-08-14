import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {

  private apiUrl = `${environment.api}/entrega`;
  private confirmacionUrl =`${environment.api}/salida`;

  constructor(private http: HttpClient) { }

  // Método para crear una nueva entrega
  crearEntrega(entrega: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, entrega);
  }


  confirmarSalida(nombreRuta: string, fechaEntrada: string): Observable<any> {
    const url = `${this.confirmacionUrl}/confirmar`; // Ensure this URL is correct
    return this.http.put<any>(url, { nombreRuta, fechaEntrada });
  }


}

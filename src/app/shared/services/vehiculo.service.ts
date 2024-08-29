import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class VehiculoService {
  constructor(private http: HttpClient) {}

  getVehiculos(): Observable<any> {
    return this.http.get(`${environment.api}/vehiculos/obtenerVehiculos`);
  }
  getVehiculosByIdPurificadora(idPurificadora: any): Observable<any> {
    return this.http.get(
      `${environment.api}/vehiculos/` +
        idPurificadora
    );
  }
  getVehiculosSinRuta(): Observable<any> {
    return this.http.get(`${environment.api}/vehiculos/VehiculosDisponibles`);
  }

  detalleVehiculoById(id: string): Observable<any> {
    const url = `${environment.api}/vehiculos/getDetalles/` + id;
    return this.http.get(url);
  }
  updateVehiculo(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/vehiculos/actualiza/` + id;
    return this.http.put(url, cliente);
  }

  eliminarVehiculo(id: string): Observable<any> {
    const url = `${environment.api}/vehiculos/deleteVehiculo/` + id;
    return this.http.delete(url);
  }

  signUp(data: any): Observable<any> {
    const url = `${environment.api}/vehiculos/crearVehiculo/`;
    return this.http.post(url, data);
  }
}

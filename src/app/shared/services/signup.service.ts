import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http:HttpClient) { }




  signUp(data: any): Observable<any> {
    const url = `${environment.api}/usuarios/signUp`;
    return this.http.post(url, data);
  }
  addPurificadora(data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/agregacionPurificadora`;
    return this.http.post(url, data);
  }


}

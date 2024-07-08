import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { Iuser } from '../../../../shared/interfaces/user.interface';
// Iuser
// import { Iuser } from 'src/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private helper = new JwtHelperService();

  // private isLocalStorageAvailable(): boolean {
  //   try {
  //     const testKey = '__localStorageTest__';
  //     localStorage.setItem(testKey, testKey);
  //     localStorage.removeItem(testKey);
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }

  get token(){
    return this.storageService.getToken()
  }
  constructor(private storageService: StorageService) {}

  getUserData(): Iuser | undefined {
    const decodedData = this.helper.decodeToken(this.token);
    return decodedData;
  }

  getRol(): string {
    const userData = this.getUserData();
    // console.log(userData)
    return userData ? userData.rol : 'invitado';
  }
  getId(): string {
    const userData = this.getUserData();
    // console.log(userData)
    return userData ? userData._id :'null';
  }

  isAutenticated(): boolean {
    // debugger
    return !!this.token && !this.isTokenExpired();
  }
  isTokenExpired(): boolean{
    return this.helper.isTokenExpired(this.token)
  }

  // Método para eliminar el token de autenticación del almacenamiento local
  removeToken(): void {
    localStorage.removeItem('token');
  }
}

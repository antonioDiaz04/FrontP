import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { Iuser } from '../../../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private helper = new JwtHelperService();

  get token(): string | null {
    return this.storageService.getToken();
  }

  constructor(private storageService: StorageService) {}

  getUserData(): Iuser | undefined {
    const {token} = this;
    if (token) {
      const decodedData = this.helper.decodeToken(token);
      return decodedData;
    }
    return undefined;
  }

  getRol(): string {
    const userData = this.getUserData();
    return userData ? userData.rol : 'invitado';
  }

  getId(): string | null {
    const userData = this.getUserData();
    return userData ? userData._id : null;
  }

  isAutenticated(): boolean {
    return !!this.token && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.token;
    return token ? this.helper.isTokenExpired(token) : true;
  }

  removeToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}

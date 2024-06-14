import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private keyCart: string = 'carrito';
  private keyToken: string = 'token';

  constructor() {}


  setToken(token: string): void {
    // debugger
    localStorage.setItem(this.keyToken, JSON.stringify(token));
  }

  getToken(): string{
    return localStorage.getItem(this.keyToken)! ///// verificar despues por  el "!" le puse para evitar el error
  }
}

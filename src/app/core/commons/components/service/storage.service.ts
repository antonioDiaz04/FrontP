import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private keyToken: string = 'token';

  constructor() { }
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__localStorageTest__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.keyToken, JSON.stringify(token));
  }

  getToken(): string {
    return localStorage.getItem(this.keyToken)! ///// verificar despues por  el "!" le puse para evitar el error
  }
}

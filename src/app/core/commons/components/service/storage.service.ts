import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private keyToken: string = 'token';

  constructor() { }

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__localStorageTest__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  setToken(token: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.keyToken, JSON.stringify(token));
    } else {
      console.error('LocalStorage is not available.');
    }
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem(this.keyToken);
      return token ? JSON.parse(token) : null;
    } else {
      console.error('LocalStorage is not available.');
      return null;
    }
  }
}

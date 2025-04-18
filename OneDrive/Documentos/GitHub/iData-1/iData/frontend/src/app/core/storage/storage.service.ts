import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Erro ao acessar localStorage:', e);
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
      console.error('Erro ao acessar localStorage:', e);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Erro ao acessar localStorage:', e);
    }
  }

  public clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Erro ao acessar localStorage:', e);
    }
  }

  public hasKey(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (e) {
      console.error('Erro ao acessar localStorage:', e);
      return false;
    }
  }
}

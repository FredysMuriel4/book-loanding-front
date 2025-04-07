import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaseConverterService {

  toSnakeCase(obj: any): any {

    if (Array.isArray(obj)) {
      return obj.map(v => this.toSnakeCase(v));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = this.toSnakeCase(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }

  toCamelCase(obj: any): any {

    if (Array.isArray(obj)) {
      return obj.map(v => this.toCamelCase(v));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = this.toCamelCase(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }
}

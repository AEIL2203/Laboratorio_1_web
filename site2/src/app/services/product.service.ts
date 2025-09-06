import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5000/api/product';
  
  constructor(private http: HttpClient) {
    console.log('ProductService initialized with URL:', this.apiUrl);
  }

  getAll(): Observable<Product[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('API Response:', response);
        
        // Handle .NET serialization format with $values
        let products = [];
        if (response && response.$values) {
          products = response.$values;
        } else if (Array.isArray(response)) {
          products = response;
        }
        
        console.log('Extracted products array:', products);
        
        return products.map((product: any) => ({
          id: product.Id || product.id,
          name: product.Name || product.name,
          createdAt: product.CreatedAt ? new Date(product.CreatedAt) : undefined,
          updatedAt: product.UpdatedAt ? new Date(product.UpdatedAt) : undefined
        }));
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }

  add(product: Product): Observable<Product> {
    const payload = {
      Name: product.name
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(product => ({
        id: product.Id,
        name: product.Name,
        createdAt: product.CreatedAt ? new Date(product.CreatedAt) : undefined,
        updatedAt: product.UpdatedAt ? new Date(product.UpdatedAt) : undefined
      }))
    );
  }

  update(id: number, product: Product): Observable<Product> {
    const payload = {
      Name: product.name
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(product => ({
        id: product.Id,
        name: product.Name,
        createdAt: product.CreatedAt ? new Date(product.CreatedAt) : undefined,
        updatedAt: product.UpdatedAt ? new Date(product.UpdatedAt) : undefined
      }))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}

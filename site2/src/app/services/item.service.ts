import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = 'http://localhost:5000/api/item';
  
  constructor(private http: HttpClient) {
    console.log('ItemService initialized with URL:', this.apiUrl);
  }

  getAll(): Observable<Item[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('API Response:', response);
        
        // Handle .NET serialization format with $values
        let items = [];
        if (response && response.$values) {
          items = response.$values;
        } else if (Array.isArray(response)) {
          items = response;
        }
        
        console.log('Extracted items array:', items);
        
        return items.map((item: any) => ({
          id: item.Id || item.id,
          name: item.Name || item.name,
          price: item.Price || item.price,
          createdBy: item.CreatedBy || item.createdBy,
          createdAt: item.CreatedAt ? new Date(item.CreatedAt) : undefined,
          updatedBy: item.UpdatedBy || item.updatedBy,
          updatedAt: item.UpdatedAt ? new Date(item.UpdatedAt) : undefined
        }));
      }),
      catchError(error => {
        console.error('Error fetching items:', error);
        return of([]);
      })
    );
  }

  add(item: Item): Observable<Item> {
    const payload = {
      Name: item.name,
      Price: item.price,
      CreatedBy: 1 // Default user ID as expected by backend
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(item => ({
        id: item.Id,
        name: item.Name,
        price: item.Price,
        createdBy: item.CreatedBy,
        createdAt: item.CreatedAt ? new Date(item.CreatedAt) : undefined,
        updatedBy: item.UpdatedBy,
        updatedAt: item.UpdatedAt ? new Date(item.UpdatedAt) : undefined
      }))
    );
  }

  update(id: number, item: Item): Observable<Item> {
    const payload = {
      Name: item.name,
      Price: item.price,
      UpdatedBy: 1 // Default user ID
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(item => ({
        id: item.Id,
        name: item.Name,
        price: item.Price,
        createdBy: item.CreatedBy,
        createdAt: item.CreatedAt ? new Date(item.CreatedAt) : undefined,
        updatedBy: item.UpdatedBy,
        updatedAt: item.UpdatedAt ? new Date(item.UpdatedAt) : undefined
      }))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}

import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:5000/api/orders';
  
  constructor(private http: HttpClient) {
    console.log('OrderService initialized with URL:', this.apiUrl);
  }

  getAll(): Observable<Order[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('API Response:', response);
        
        // Handle .NET serialization format with $values
        let orders = [];
        if (response && response.$values) {
          orders = response.$values;
        } else if (Array.isArray(response)) {
          orders = response;
        }
        
        console.log('Extracted orders array:', orders);
        
        return orders.map((order: any) => ({
          id: order.Id || order.id,
          personId: order.PersonId || order.personId,
          number: order.Number || order.number,
          createdBy: order.CreatedBy || order.createdBy,
          createdAt: order.CreatedAt ? new Date(order.CreatedAt) : undefined,
          updatedBy: order.UpdatedBy || order.updatedBy,
          updatedAt: order.UpdatedAt ? new Date(order.UpdatedAt) : undefined
        }));
      }),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of([]);
      })
    );
  }

  add(order: Order): Observable<Order> {
    const payload = {
      PersonId: order.personId,
      Number: order.number,
      CreatedBy: 1 // Default user ID
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(order => ({
        id: order.Id,
        personId: order.PersonId,
        number: order.Number,
        createdBy: order.CreatedBy,
        createdAt: order.CreatedAt ? new Date(order.CreatedAt) : undefined,
        updatedBy: order.UpdatedBy,
        updatedAt: order.UpdatedAt ? new Date(order.UpdatedAt) : undefined
      }))
    );
  }

  update(id: number, order: Order): Observable<Order> {
    const payload = {
      PersonId: order.personId,
      Number: order.number,
      UpdatedBy: 1 // Default user ID
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(order => ({
        id: order.Id,
        personId: order.PersonId,
        number: order.Number,
        createdBy: order.CreatedBy,
        createdAt: order.CreatedAt ? new Date(order.CreatedAt) : undefined,
        updatedBy: order.UpdatedBy,
        updatedAt: order.UpdatedAt ? new Date(order.UpdatedAt) : undefined
      }))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}

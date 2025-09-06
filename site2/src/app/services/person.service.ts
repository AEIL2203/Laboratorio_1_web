import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private apiUrl = 'http://localhost:5000/api/person';
  
  constructor(private http: HttpClient) {
    console.log('PersonService initialized with URL:', this.apiUrl);
  }

  getAll(): Observable<Person[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('API Response:', response);
        
        // Handle .NET serialization format with $values
        let persons = [];
        if (response && response.$values) {
          persons = response.$values;
        } else if (Array.isArray(response)) {
          persons = response;
        }
        
        console.log('Extracted persons array:', persons);
        
        return persons.map((person: any) => ({
          id: person.Id || person.id,
          firstName: person.FirstName || person.firstName,
          lastName: person.LastName || person.lastName,
          email: person.Email || person.email,
          createdAt: person.CreatedAt ? new Date(person.CreatedAt) : undefined,
          updatedAt: person.UpdatedAt ? new Date(person.UpdatedAt) : undefined
        }));
      }),
      catchError(error => {
        console.error('Error fetching persons:', error);
        return of([]);
      })
    );
  }

  add(emp: Person): Observable<Person> {
    const payload = {
      FirstName: emp.firstName,
      LastName: emp.lastName,
      Email: emp.email
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(person => ({
        id: person.Id,
        firstName: person.FirstName,
        lastName: person.LastName,
        email: person.Email,
        createdAt: person.CreatedAt ? new Date(person.CreatedAt) : undefined,
        updatedAt: person.UpdatedAt ? new Date(person.UpdatedAt) : undefined
      }))
    );
  }

  update(id: number, emp: Person): Observable<Person> {
    const payload = {
      FirstName: emp.firstName,
      LastName: emp.lastName,
      Email: emp.email
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(person => ({
        id: person.Id,
        firstName: person.FirstName,
        lastName: person.LastName,
        email: person.Email,
        createdAt: person.CreatedAt ? new Date(person.CreatedAt) : undefined,
        updatedAt: person.UpdatedAt ? new Date(person.UpdatedAt) : undefined
      }))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}

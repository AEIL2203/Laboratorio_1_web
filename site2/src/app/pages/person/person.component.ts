import { CommonModule } from '@angular/common';
import { Component, inject, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person';
import { PersonEditComponent } from '../../management/person-edit/person-edit.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import swal from 'sweetalert';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [
     CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent implements AfterViewInit {

  private PersonService = inject(PersonService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'action'];
  dataSource = new MatTableDataSource<Person>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadPersons();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPersons() {
    console.log('Loading persons...');
    this.PersonService.getAll().subscribe({
      next: (Response) => {
        console.log('Received response:', Response);
        console.log('Response type:', typeof Response);
        console.log('Is array:', Array.isArray(Response));
        console.log('Response length:', Response?.length);
        
        // Asegurar que Response sea un array
        let data = Array.isArray(Response) ? Response : [];
        console.log('Final data for table:', data);
        
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        console.log('DataSource data:', this.dataSource.data);
        console.log('DataSource length:', this.dataSource.data.length);
      },
      error: (error) => {
        console.error('Error loading persons:', error);
        swal("Error", "No se pudo cargar la lista de personas.", "error");
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(Person?: Person) {
    const dialogRef = this.dialog.open(PersonEditComponent, {
      width: '99%',
      height: '99%',
      data: Person,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadPersons();
    });
  }

  delete(id: number) {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminada, no podrás recuperar esta persona.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.PersonService.delete(id).subscribe({
          next: () => {
            swal("Eliminado", "La persona ha sido eliminada correctamente.", "success");
            this.loadPersons();
          },
          error: (error) => {
            console.error('Error deleting person:', error);
            swal("Error", "No se pudo eliminar la persona.", "error");
          }
        });
      }
    });
  }

  testConnection() {
    console.log('Testing API connection...');
    fetch('http://localhost:5000/api/person')
      .then(response => {
        console.log('Raw response status:', response.status);
        console.log('Raw response headers:', response.headers);
        return response.text();
      })
      .then(text => {
        console.log('Raw response text:', text);
        try {
          const json = JSON.parse(text);
          console.log('Parsed JSON:', json);
          swal("API Test", `Conexión exitosa! Datos recibidos: ${JSON.stringify(json)}`, "success");
        } catch (e) {
          console.log('Failed to parse as JSON:', e);
          swal("API Test", `Respuesta recibida pero no es JSON válido: ${text}`, "warning");
        }
      })
      .catch(error => {
        console.error('API connection failed:', error);
        swal("API Test", `Error de conexión: ${error.message}`, "error");
      });
  }

}

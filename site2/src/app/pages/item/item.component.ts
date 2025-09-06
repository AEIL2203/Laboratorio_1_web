import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { ItemEditComponent } from '../../management/item-edit/item-edit.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import swal from 'sweetalert';

@Component({
  selector: 'app-item',
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
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements AfterViewInit {

  private itemService = inject(ItemService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'name', 'price', 'createdBy', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadItems();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadItems() {
    console.log('Loading items...');
    this.itemService.getAll().subscribe({
      next: (Response) => {
        console.log('Received response:', Response);
        console.log('Response type:', typeof Response);
        console.log('Is array:', Array.isArray(Response));
        console.log('Response length:', Response?.length);
        
        let data = Array.isArray(Response) ? Response : [];
        console.log('Final data for table:', data);
        
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        console.log('DataSource data:', this.dataSource.data);
        console.log('DataSource length:', this.dataSource.data.length);
      },
      error: (error) => {
        console.error('Error loading items:', error);
        swal("Error", "No se pudo cargar la lista de items.", "error");
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(item?: Item) {
    const dialogRef = this.dialog.open(ItemEditComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadItems();
    });
  }

  delete(id: number) {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este item.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.itemService.delete(id).subscribe({
          next: () => {
            swal("Eliminado", "El item ha sido eliminado correctamente.", "success");
            this.loadItems();
          },
          error: (error) => {
            console.error('Error deleting item:', error);
            swal("Error", "No se pudo eliminar el item.", "error");
          }
        });
      }
    });
  }

}

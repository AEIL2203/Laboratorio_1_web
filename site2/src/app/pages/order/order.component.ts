import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import swal from 'sweetalert';

@Component({
  selector: 'app-order',
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
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements AfterViewInit {

  private orderService = inject(OrderService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'personId', 'number', 'createdBy', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<Order>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadOrders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders() {
    console.log('Loading orders...');
    this.orderService.getAll().subscribe({
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
        console.error('Error loading orders:', error);
        swal("Error", "No se pudo cargar la lista de órdenes.", "error");
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(order?: Order) {
    // TODO: Implement order edit dialog
    console.log('Open dialog for order:', order);
    swal("Info", "Funcionalidad de edición pendiente de implementar", "info");
  }

  delete(id: number) {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminada, no podrás recuperar esta orden.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.orderService.delete(id).subscribe({
          next: () => {
            swal("Eliminado", "La orden ha sido eliminada correctamente.", "success");
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error deleting order:', error);
            swal("Error", "No se pudo eliminar la orden.", "error");
          }
        });
      }
    });
  }

}

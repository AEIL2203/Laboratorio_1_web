import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductEditComponent } from '../../management/product-edit/product-edit.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import swal from 'sweetalert';

@Component({
  selector: 'app-product',
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
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements AfterViewInit {

  private productService = inject(ProductService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'name', 'createdAt', 'updatedAt', 'action'];
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts() {
    console.log('Loading products...');
    this.productService.getAll().subscribe({
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
        console.error('Error loading products:', error);
        swal("Error", "No se pudo cargar la lista de productos.", "error");
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: '500px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadProducts();
    });
  }

  delete(id: number) {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este producto.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.productService.delete(id).subscribe({
          next: () => {
            swal("Eliminado", "El producto ha sido eliminado correctamente.", "success");
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            swal("Error", "No se pudo eliminar el producto.", "error");
          }
        });
      }
    });
  }

}

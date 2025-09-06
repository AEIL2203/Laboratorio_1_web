import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import swal from 'sweetalert';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {
  productForm: FormGroup;
  isEditMode: boolean = false;
  
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private dialogRef = inject(MatDialogRef<ProductEditComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product) {
    this.isEditMode = !!data?.id;
    
    this.productForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      userNote: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      
      if (this.isEditMode) {
        // Update existing product
        const updatedProduct: Product = {
          ...this.data,
          name: formValue.name
        };
        
        this.productService.update(this.data.id!, updatedProduct).subscribe({
          next: (response) => {
            swal("Éxito", "Producto actualizado correctamente", "success");
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating product:', error);
            swal("Error", "No se pudo actualizar el producto", "error");
          }
        });
      } else {
        // Create new product
        const newProduct: Product = {
          name: formValue.name
        };
        
        this.productService.add(newProduct).subscribe({
          next: (response) => {
            swal("Éxito", "Producto creado correctamente", "success");
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating product:', error);
            swal("Error", "No se pudo crear el producto", "error");
          }
        });
      }
    } else {
      swal("Error", "Por favor completa todos los campos requeridos", "error");
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      if (fieldName === 'userNote') return 'La nota del usuario es requerida';
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} debe tener al menos 2 caracteres`;
    }
    return '';
  }
}

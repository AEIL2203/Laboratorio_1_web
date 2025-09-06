import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import swal from 'sweetalert';

@Component({
  selector: 'app-item-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './item-edit.component.html',
  styleUrl: './item-edit.component.css'
})
export class ItemEditComponent {
  itemForm: FormGroup;
  isEditMode: boolean = false;
  
  private fb = inject(FormBuilder);
  private itemService = inject(ItemService);
  private dialogRef = inject(MatDialogRef<ItemEditComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Item) {
    this.isEditMode = !!data?.id;
    
    this.itemForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      price: [data?.price || 0, [Validators.required, Validators.min(0.01)]],
      userNote: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      
      if (this.isEditMode) {
        // Update existing item
        const updatedItem: Item = {
          ...this.data,
          name: formValue.name,
          price: formValue.price,
          updatedBy: 1 // Default user ID
        };
        
        this.itemService.update(this.data.id!, updatedItem).subscribe({
          next: (response) => {
            swal("Éxito", "Item actualizado correctamente", "success");
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating item:', error);
            swal("Error", "No se pudo actualizar el item", "error");
          }
        });
      } else {
        // Create new item
        const newItem: Item = {
          name: formValue.name,
          price: formValue.price,
          createdBy: 1 // Default user ID
        };
        
        this.itemService.add(newItem).subscribe({
          next: (response) => {
            swal("Éxito", "Item creado correctamente", "success");
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating item:', error);
            swal("Error", "No se pudo crear el item", "error");
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
    const field = this.itemForm.get(fieldName);
    if (field?.hasError('required')) {
      if (fieldName === 'userNote') return 'La nota del usuario es requerida';
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} debe tener al menos 2 caracteres`;
    }
    if (field?.hasError('min')) {
      return 'El precio debe ser mayor a 0';
    }
    return '';
  }
}

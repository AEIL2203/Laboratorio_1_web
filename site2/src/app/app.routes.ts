import { Routes } from '@angular/router';
import { PersonComponent } from './pages/person/person.component';
import { ItemComponent } from './pages/item/item.component';
import { OrderComponent } from './pages/order/order.component';
import { ProductComponent } from './pages/product/product.component';

export const routes: Routes = [
    { path: '', redirectTo: 'persons', pathMatch: 'full' },
    { path: 'persons', component: PersonComponent },
    { path: 'items', component: ItemComponent },
    { path: 'orders', component: OrderComponent },
    { path: 'products', component: ProductComponent },
];

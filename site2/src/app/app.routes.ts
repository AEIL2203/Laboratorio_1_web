import { Routes } from '@angular/router';
import { PersonComponent } from './pages/person/person.component';
import { ItemComponent } from './pages/item/item.component';

export const routes: Routes = [
    { path: '', redirectTo: 'persons', pathMatch: 'full' },
    { path: 'persons', component: PersonComponent },
    { path: 'items', component: ItemComponent },
];

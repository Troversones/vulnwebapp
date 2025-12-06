import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { XssComponent } from './pages/xss/xss.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'xss', component: XssComponent },
    { path: '**', redirectTo: '' },
];
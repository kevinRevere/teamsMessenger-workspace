import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [MsalGuard] },
  { path: '**', component: AppComponent, canActivate: [MsalGuard] },
];

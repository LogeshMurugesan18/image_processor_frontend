import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProcessComponent } from './process/process.component';
import { DownloadComponent } from './download/download.component';

export const routes: Routes = [
{ path: '', component:HeaderComponent}, 
  { path: 'login', component: LoginComponent },
  { path: 'signup',component: SignupComponent },
  {path: 'home', component:HomeComponent},
  {path: 'process', component:ProcessComponent},
  {path: 'download', component:DownloadComponent},

];

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { ProcessComponent } from './process/process.component';

export const routes: Routes = [
{ path: '', component:LandingComponent}, 
  { path: 'login', component: LoginComponent },
  { path: 'signup',component: SignupComponent },
  {path: 'home', component:HomeComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'process', component:ProcessComponent},
  {path: '**', redirectTo:''},

];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./Components/login/login.component";
import {AdminTemplateComponent} from "./Components/admin-template/admin-template.component";
import {HomeComponent} from "./Components/home/home.component";
import {authGuard} from "./guards/auth.guard";
import {FamilleUserComponent} from "./Components/famille-user/famille-user.component";
import {UsersComponent} from "./Components/users/users.component";
import {TachesComponent} from "./Components/taches/taches.component";
import {GestionTachesComponent} from "./Components/gestion-taches/gestion-taches.component";
import {AffectataionTachesComponent} from "./Components/affectataion-taches/affectataion-taches.component";
import {DashboardComponent} from "./Components/dashboard/dashboard.component";
import {SignUpComponent} from "./Components/sign-up/sign-up.component";
import {UpdateTacheDialogComponent} from "./Components/update-tache-dialog/update-tache-dialog.component";


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent }, // Default route
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'admin',
    component: AdminTemplateComponent,
    canActivate: [authGuard], // Protects this route and its children
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'familleusers', component: FamilleUserComponent },
      { path: 'users', component: UsersComponent },
      { path: 'taches', component: TachesComponent },
      { path: 'gestiontache', component: GestionTachesComponent },
      { path: 'affectationtaches', component: AffectataionTachesComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ModiferHentHdet/:id', component: UpdateTacheDialogComponent }, // Updated route with parameter
    ]
  },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

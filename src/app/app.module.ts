import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './Components/login/login.component';
import { AdminTemplateComponent } from './Components/admin-template/admin-template.component';
import { HomeComponent } from './Components/home/home.component';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle
} from "@angular/material/card";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatSidenavModule} from "@angular/material/sidenav";
import {CommonModule} from "@angular/common";
import {MatListItem, MatNavList} from "@angular/material/list";
import {
  MatCalendarHeader,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatDividerModule} from "@angular/material/divider";
import {MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTableModule} from "@angular/material/table";
import {MatChipOption} from "@angular/material/chips";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {authGuard} from "./guards/auth.guard";
import { FamilleUserComponent } from './Components/famille-user/famille-user.component';
import { UsersComponent } from './Components/users/users.component';
import { TachesComponent } from './Components/taches/taches.component';
import { GestionTachesComponent } from './Components/gestion-taches/gestion-taches.component';
import { AffectataionTachesComponent } from './Components/affectataion-taches/affectataion-taches.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AddFUserDialogComponent } from './Components/add-fuser-dialog/add-fuser-dialog.component';
import { EditFUserDialogComponent } from './Components/edit-fuser-dialog/edit-fuser-dialog.component';
import { EditUserDialogComponentComponent } from './Components/edit-user-dialog-component/edit-user-dialog-component.component';
import { AddUserDialogComponentComponent } from './Components/add-user-dialog-component/add-user-dialog-component.component';
import { AddTacheDialogComponent } from './Components/add-tache-dialog/add-tache-dialog.component';
import { EditTacheDialogComponent } from './Components/edit-tache-dialog/edit-tache-dialog.component';
import { AddDetailDialogComponentComponent } from './Components/add-detail-dialog-component/add-detail-dialog-component.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { UpdateDetailDialogComponentComponentComponent } from './Components/update-detail-dialog-component-component/update-detail-dialog-component-component.component';
import { UpdateTacheDialogComponent } from './Components/update-tache-dialog/update-tache-dialog.component';
import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminTemplateComponent,
    HomeComponent,
    FamilleUserComponent,
    UsersComponent,
    TachesComponent,
    GestionTachesComponent,
    AffectataionTachesComponent,
    DashboardComponent,
    AddFUserDialogComponent,
    EditFUserDialogComponent,
    EditUserDialogComponentComponent,
    AddUserDialogComponentComponent,
    AddTacheDialogComponent,
    EditTacheDialogComponent,
    AddDetailDialogComponentComponent,
    SignUpComponent,
    UpdateDetailDialogComponentComponentComponent,
    UpdateTacheDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuTrigger,
    MatMenuModule,
    MatSidenavModule,
    CommonModule,
    MatListItem,
    MatNavList,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatCalendarHeader,
    MatCardTitle,
    MatCardContent,
    MatDividerModule,
    MatCardHeader,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatChipOption,
    MatPaginator,
    MatSort,
    MatSortHeader,
    MatInputModule,
    MatDialogClose,
    MatSelectModule,
    MatOptionModule,
    MatRadioButton,
    MatRadioGroup,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatDatepickerInput,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatDialogContent,
    MatDialogActions,
    BrowserAnimationsModule,
    MatCheckbox,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [
    authGuard,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsersService } from "../../services/users.service";
import { FUserService } from "../../services/f-user.service";

@Component({
  selector: 'app-edit-user-dialog-component',
  templateUrl: './edit-user-dialog-component.component.html',
  styleUrls: ['./edit-user-dialog-component.component.css']
})
export class EditUserDialogComponentComponent implements OnInit {
  userForm: FormGroup;
  fusers: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private usersService: UsersService,
    private fUserService: FUserService
  ) {
    this.userForm = this.fb.group({
      nom: [data.nom, Validators.required],
      age: [data.age, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      fuser: [data.fuser.idFUser, Validators.required],
      idUsers: [data.idUsers] // Assuming 'idUsers' is the property name for the user ID
    });
  }

  ngOnInit(): void {
    this.fUserService.getAllFUsers().subscribe(data => {
      this.fusers = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userFormData = this.userForm.value;
      const userPayload = {
        ...this.data, // Spread existing data to retain other properties like 'idUsers'
        ...userFormData, // Overwrite with updated form data
        fuser: { idFUser: userFormData.fuser } // Adjust to match backend expectation if necessary
      };

      this.usersService.updateUser(userPayload).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Update user error', error)
      );
    }
  }
}

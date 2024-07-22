import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { FUserService } from '../../services/f-user.service';

@Component({
  selector: 'app-add-user-dialog-component',
  templateUrl: './add-user-dialog-component.component.html',
  styleUrls: ['./add-user-dialog-component.component.css']
})
export class AddUserDialogComponentComponent implements OnInit {
  userForm: FormGroup;
  fusers: any[] = [];
  selectedFile: File | null = null;
  selectedImageSrc: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponentComponent>,
    private fb: FormBuilder,
    private usersService: UsersService,
    private fUserService: FUserService
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fuser: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFamilyUsers();
  }

  loadFamilyUsers(): void {
    this.fUserService.getAllFUsers().subscribe(
      data => {
        this.fusers = data;
      },
      error => {
        console.error('Error fetching family users', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



  onSubmit(): void {
    if (this.userForm.valid) {
      const userFormData = this.userForm.value;
      const fuser = this.fusers.find(fu => fu.idFUser === userFormData.fuser);

      console.log('Selected FUser object:', fuser);

      if (!fuser) {
        console.error('FUser not found');
        return; // Exit if fuser is not found
      }

      // Adjust the property name to match the backend's expected format
      const userPayload = {
        nom: userFormData.nom,
        age: userFormData.age,
        email: userFormData.email,
        fuser: { // Changed from fUser to fuser
          idFUser: fuser.idFUser,
          libelleFamille: fuser.libelleFamille,
          coefficient: fuser.coefficient,
          remarques: fuser.remarques
        }
      };

      console.log('User payload before serialization:', userPayload);

      this.usersService.createUser(userPayload).subscribe(
        () => {
          this.dialogRef.close(true);
          console.log('User created successfully');
        },
        error => {
          console.error('Create user error', error);
        }
      );
    }
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = e => this.selectedImageSrc = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }
}

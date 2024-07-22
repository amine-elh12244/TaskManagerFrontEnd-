import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FUserService } from '../../services/f-user.service';

@Component({
  selector: 'app-add-fuser-dialog',
  templateUrl: './add-fuser-dialog.component.html',
  styleUrls: ['./add-fuser-dialog.component.css']
})
export class AddFUserDialogComponent {
  fUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddFUserDialogComponent>,
    private fb: FormBuilder,
    private fUserService: FUserService
  ) {
    this.fUserForm = this.fb.group({
      libelleFamille: ['', Validators.required],
      coefficient: ['', Validators.required],
      remarques: ['']
    });
  }

  onSubmit() {
    if (this.fUserForm.valid) {
      this.fUserService.createFUser(this.fUserForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

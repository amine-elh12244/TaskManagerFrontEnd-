import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FUserService } from '../../services/f-user.service';

@Component({
  selector: 'app-edit-fuser-dialog',
  templateUrl: './edit-fuser-dialog.component.html',
  styleUrls: ['./edit-fuser-dialog.component.css']
})
export class EditFUserDialogComponent {
  fUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditFUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private fUserService: FUserService
  ) {
    this.fUserForm = this.fb.group({
      libelleFamille: [data.libelleFamille, Validators.required],
      coefficient: [data.coefficient, Validators.required],
      remarques: [data.remarques]
    });
  }

  onSubmit() {
    if (this.fUserForm.valid) {
      const updatedFUser = { ...this.fUserForm.value, idFUser: this.data.idFUser };
      this.fUserService.updateFUser(updatedFUser).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

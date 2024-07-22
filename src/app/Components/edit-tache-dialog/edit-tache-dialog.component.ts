import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TacheService } from '../../services/tache.service'; // Adjust path as per your structure

@Component({
  selector: 'app-edit-tache-dialog',
  templateUrl: './edit-tache-dialog.component.html',
  styleUrls: ['./edit-tache-dialog.component.css']
})
export class EditTacheDialogComponent {
  tacheForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditTacheDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private tacheService: TacheService
  ) {
    this.tacheForm = this.fb.group({
      idTache: [data.idTache, Validators.required], // Include ID if needed for backend
      libelleTache: [data.libelleTache, Validators.required],
      coefficient: [data.coefficient, Validators.required],
      remarques: [data.remarques]
    });
  }

  onSubmit(): void {
    if (this.tacheForm.valid) {
      const tacheData = this.tacheForm.value;
      this.tacheService.updateTache(tacheData).subscribe(
        () => {
          this.dialogRef.close(true); // Notify parent component that operation was successful
        },
        error => {
          console.error('Error editing tache', error);
          // Handle error with a notification or message
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false); // Close dialog without editing
  }
}

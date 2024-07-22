import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TacheService } from '../../services/tache.service'; // Adjust path as per your structure

@Component({
  selector: 'app-add-tache-dialog',
  templateUrl: './add-tache-dialog.component.html',
  styleUrls: ['./add-tache-dialog.component.css']
})
export class AddTacheDialogComponent {
  tacheForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddTacheDialogComponent>,
    private fb: FormBuilder,
    private tacheService: TacheService
  ) {
    this.tacheForm = this.fb.group({
      libelleTache: ['', Validators.required],
      coefficient: ['', Validators.required],
      remarques: ['']
    });
  }

  onSubmit(): void {
    if (this.tacheForm.valid) {
      const tacheData = this.tacheForm.value;
      this.tacheService.createTache(tacheData).subscribe(
        () => {
          this.dialogRef.close(true); // Notify parent component that operation was successful
        },
        error => {
          console.error('Error adding tache', error);
          // Handle error with a notification or message
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false); // Close dialog without adding
  }
}

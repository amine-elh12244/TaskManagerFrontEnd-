import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-detail-dialog-component',
  templateUrl: './add-detail-dialog-component.component.html',
  styleUrls: ['./add-detail-dialog-component.component.css']
})
export class AddDetailDialogComponentComponent {
  taches: any[];
  tache: any;
  hdebut!: string;
  hfin!: string;
  tempsDiff!: number;
  coefficient!: number;
  prixCalc!: number;
  remarques!: string;

  constructor(
    public dialogRef: MatDialogRef<AddDetailDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taches = data.taches;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  calculateDifference(): void {
    if (this.hdebut && this.hfin) {
      const [h1, m1] = this.hdebut.split(':').map(Number);
      const [h2, m2] = this.hfin.split(':').map(Number);
      this.tempsDiff = ((h2 * 60 + m2) - (h1 * 60 + m1));
      this.calculatePrice();
    }
  }

  calculatePrice(): void {
    if (this.coefficient !== undefined && this.tempsDiff !== undefined) {
      this.prixCalc = this.coefficient * this.tempsDiff;
    }
  }

  updateCoefficient(): void {
    if (this.tache) {
      this.coefficient = this.tache.coefficient;
      this.calculatePrice();
    }
  }
}

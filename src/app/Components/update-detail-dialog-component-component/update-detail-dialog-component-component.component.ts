import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-update-detail-dialog-component-component',
  templateUrl: './update-detail-dialog-component-component.component.html',
  styleUrl: './update-detail-dialog-component-component.component.css'
})
export class UpdateDetailDialogComponentComponentComponent  {
  taches: any[];
  tache: any;
  hdebut!: string;
  hfin!: string;
  tempsDiff!: number;
  coefficient!: number;
  prixCalc!: number;
  remarques!: string;

  constructor(
    public dialogRef: MatDialogRef<UpdateDetailDialogComponentComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taches = data.taches;
    this.tache = data.detail.tache;
    this.hdebut = data.detail.hdebut;
    this.hfin = data.detail.hfin;
    this.tempsDiff = data.detail.tempsDiff;
    this.coefficient = data.detail.coefficient;
    this.prixCalc = data.detail.prixCalc;
    this.remarques = data.detail.remarques;
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

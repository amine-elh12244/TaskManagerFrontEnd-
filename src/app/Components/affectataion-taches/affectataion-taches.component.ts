import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { TacheService } from "../../services/tache.service";
import { HEntTacheService } from "../../services/h-ent-tache.service";
import { HDetTacheService } from "../../services/h-det-tache.service";
import { MatDialog } from "@angular/material/dialog";
import { AddDetailDialogComponentComponent } from "../add-detail-dialog-component/add-detail-dialog-component.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import Swal from "sweetalert2";
import {
  UpdateDetailDialogComponentComponentComponent
} from "../update-detail-dialog-component-component/update-detail-dialog-component-component.component";
import {TDocumentDefinitions} from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-affectataion-taches',
  templateUrl: './affectataion-taches.component.html',
  styleUrls: ['./affectataion-taches.component.css']
})
export class AffectataionTachesComponent implements OnInit {
  entTache: any = {};
  detTaches: any[] = [];
  users: any[] = [];
  taches: any[] = [];
  displayedColumns: string[] = ['tache', 'hdebut', 'hfin', 'tempsDiff', 'coefficient', 'prixCalc', 'remarques', 'action'];

  constructor(
    private usersService: UsersService,
    private tacheService: TacheService,
    private hEntTacheService: HEntTacheService,
    private hDetTacheService: HDetTacheService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
   private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
    });

    this.tacheService.getAllTaches().subscribe(data => {
      this.taches = data;
    });
  }

  addEntTache(): void {
    this.hEntTacheService.createHEntTache(this.entTache).subscribe(response => {
      console.log('En-tête de tâche ajouté', response);
      this.entTache.id = response.idHEntTache;
      console.log('En-tête de tâche ID:', this.entTache.id);
      this.loadDetTaches(); // Load details for the added entTache
    });
  }

  loadDetTaches(): void {
    if (this.entTache.id) {
      this.hDetTacheService.findByHEntTacheId(this.entTache.id).subscribe(data => {
        this.detTaches = data;
        this.cdr.detectChanges();
      });
    }
  }

  addDetail(): void {
    const dialogRef = this.dialog.open(AddDetailDialogComponentComponent, {
      width: '400px',
      data: { taches: this.taches }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveDetail(result);
      }
    });
  }



  removeDetail(detail: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hDetTacheService.deleteHDetTache(detail.idHDetTache).subscribe(() => {
          this.detTaches = this.detTaches.filter(d => d !== detail);
          Swal.fire(
            'Supprimé!',
            'La tâche a été supprimée.',
            'success'
          );
        });
      }
    });
  }


  updateCoefficient(detail: any): void {
    detail.coefficient = detail.tache.coefficient;
    this.calculatePrice(detail);
  }

  calculateDifference(detail: any): void {
    if (detail.hdebut && detail.hfin) {
      const [h1, m1] = detail.hdebut.split(':').map(Number);
      const [h2, m2] = detail.hfin.split(':').map(Number);
      detail.tempsDiff = ((h2 * 60 + m2) - (h1 * 60 + m1));
      this.calculatePrice(detail);
    }
  }

  calculatePrice(detail: any): void {
    detail.prixCalc = detail.coefficient * detail.tempsDiff;
  }

  saveDetail(detail: any): void {
    if (!this.entTache.id) {
      console.error('No entTache ID found. Please add entTache first.');
      return;
    }

    const hentTache = {
      idHEntTache: this.entTache.id,
      libelleJournee: this.entTache.libelleJournee,
      users: {
        idUsers: this.entTache.users.idUsers,
        nom: this.entTache.users.nom,
        age: this.entTache.users.age,
        email: this.entTache.users.email,
        fuser: {
          idFUser: this.entTache.users.fuser.idFUser,
          libelleFamille: this.entTache.users.fuser.libelleFamille,
          coefficient: this.entTache.users.fuser.coefficient,
          remarques: this.entTache.users.fuser.remarques
        }
      },
      dateOperation: this.entTache.dateOperation,
      remarques: this.entTache.remarques
    };

    const detailPayload = {
      tache: {
        idTache: detail.tache.idTache,
        libelleTache: detail.tache.libelleTache,
        coefficient: detail.tache.coefficient,
        remarques: detail.tache.remarques
      },
      tempsDiff: detail.tempsDiff,
      coefficient: detail.coefficient,
      prixCalc: detail.prixCalc,
      remarques: detail.remarques,
      hentTache: hentTache,
      hdebut: detail.hdebut,
      hfin: detail.hfin
    };

    console.log('Detail payload before serialization:', detailPayload);

    this.hDetTacheService.createHDetTache(detailPayload).subscribe(response => {
      console.log('Détail de tâche ajouté', response);
      if (response) {
        this.loadDetTaches(); // Reload details for the entTache
      }
    }, error => {
      console.error('Error saving detTache with hentTache', error);
    });
  }



  openUpdateDialog(detail: any): void {
    const dialogRef = this.dialog.open(UpdateDetailDialogComponentComponentComponent, {
      width: '400px',
      data: { taches: this.taches, detail: detail }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateDetail(result, detail);
      }
    });
  }

  updateDetail(updatedDetail: any, originalDetail: any): void {
    // Update the original detail with the new values
    originalDetail.tache = updatedDetail.tache;
    originalDetail.hdebut = updatedDetail.hdebut;
    originalDetail.hfin = updatedDetail.hfin;
    originalDetail.tempsDiff = updatedDetail.tempsDiff;
    originalDetail.coefficient = updatedDetail.coefficient;
    originalDetail.prixCalc = updatedDetail.prixCalc;
    originalDetail.remarques = updatedDetail.remarques;

    // Construct the payload similar to the saveDetail method
    const hentTache = {
      idHEntTache: this.entTache.id,
      libelleJournee: this.entTache.libelleJournee,
      users: {
        idUsers: this.entTache.users.idUsers,
        nom: this.entTache.users.nom,
        age: this.entTache.users.age,
        email: this.entTache.users.email,
        fuser: {
          idFUser: this.entTache.users.fuser.idFUser,
          libelleFamille: this.entTache.users.fuser.libelleFamille,
          coefficient: this.entTache.users.fuser.coefficient,
          remarques: this.entTache.users.fuser.remarques
        }
      },
      dateOperation: this.entTache.dateOperation,
      remarques: this.entTache.remarques
    };

    const detailPayload = {
      tache: {
        idTache: originalDetail.tache.idTache,
        libelleTache: originalDetail.tache.libelleTache,
        coefficient: originalDetail.tache.coefficient,
        remarques: originalDetail.tache.remarques
      },
      tempsDiff: originalDetail.tempsDiff,
      coefficient: originalDetail.coefficient,
      prixCalc: originalDetail.prixCalc,
      remarques: originalDetail.remarques,
      hentTache: hentTache,
      hdebut: originalDetail.hdebut,
      hfin: originalDetail.hfin
    };

    console.log('Detail payload before serialization:', detailPayload);

    this.hDetTacheService.updateHDetTache(originalDetail.idHDetTache, detailPayload).subscribe(response => {
      console.log('Détail de tâche mis à jour', response);
      if (response) {
        this.loadDetTaches(); // Reload details for the entTache
      }
    }, error => {
      console.error('Error updating detTache with hentTache', error);
    });
  }

  async generatePDF(detail: any): Promise<Blob> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: 'Détails de la Tâche', style: 'title', alignment: 'left' },
                { text: 'Information détaillée sur la tâche', style: 'subheader', alignment: 'left' }
              ]
            }
          ]
        },
        { text: '', margin: [0, 20] },
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: 'Libellé Tâche', style: 'tableHeader' },
                { text: detail.tache ? detail.tache.libelleTache : 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Heure Début', style: 'tableHeader' },
                { text: detail.hdebut || 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Heure Fin', style: 'tableHeader' },
                { text: detail.hfin || 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Temps Différence (minutes)', style: 'tableHeader' },
                { text: detail.tempsDiff || 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Coefficient', style: 'tableHeader' },
                { text: detail.coefficient || 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Prix Calculé', style: 'tableHeader' },
                { text: detail.prixCalc || 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Remarques', style: 'tableHeader' },
                { text: detail.remarques || 'N/A', style: 'tableData' }
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        },
        { text: '', margin: [0, 20] },
        {
          columns: [
            { text: '____________________________', alignment: 'left' },
            { text: '____________________________', alignment: 'right' }
          ]
        },
        {
          columns: [
            { text: 'Signature', alignment: 'left', margin: [0, 5, 0, 0] },
            { text: 'Date', alignment: 'right', margin: [0, 5, 0, 0] }
          ]
        }
      ],
      styles: {
        title: {
          fontSize: 20,
          bold: true
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableHeader: {
          bold: true,
          fillColor: '#eeeeee',
          margin: [0, 5, 0, 5]
        },
        tableData: {
          margin: [0, 5, 0, 5]
        }
      },
      defaultStyle: {
        columnGap: 20
      }
    };

    return new Promise((resolve, reject) => {
      pdfMake.createPdf(docDefinition).getBlob((blob) => {
        resolve(blob);
      });
    });
  }

  async printDetail(detail: any) {
    const pdfBlob = await this.generatePDF(detail);
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  }

}

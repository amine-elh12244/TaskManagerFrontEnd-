import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HEntTacheService } from '../../services/h-ent-tache.service';
import { HDetTacheService } from '../../services/h-det-tache.service';
import { UsersService } from '../../services/users.service';
import { TacheService } from '../../services/tache.service';
import Swal from 'sweetalert2';
import {AddDetailDialogComponentComponent} from "../add-detail-dialog-component/add-detail-dialog-component.component";
import {MatDialog} from "@angular/material/dialog";
import {
  UpdateDetailDialogComponentComponentComponent
} from "../update-detail-dialog-component-component/update-detail-dialog-component-component.component";

import pdfMake from 'pdfmake/build/pdfmake';
import {TDocumentDefinitions} from "pdfmake/interfaces";

@Component({
  selector: 'app-update-tache-dialog',
  templateUrl: './update-tache-dialog.component.html',
  styleUrls: ['./update-tache-dialog.component.css']
})
export class UpdateTacheDialogComponent implements OnInit {

  entTache: any = {};
  detTaches: any[] = [];
  users: any[] = [];
  taches: any[] = [];
  displayedColumns: string[] = ['tache', 'hdebut', 'hfin', 'tempsDiff', 'coefficient', 'prixCalc', 'remarques', 'action'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hEntTacheService: HEntTacheService,
    private hDetTacheService: HDetTacheService,
    private usersService: UsersService,
    private tacheService: TacheService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,

  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEntTache(id);
    }
    this.usersService.getAllUsers().subscribe(users => {
      this.users = users;
      // Ensure the user list is loaded before binding
      if (this.entTache && this.entTache.users) {
        this.entTache.users = this.users.find(user => user.idUsers === this.entTache.users.idUsers) || this.entTache.users;
      }
    });
    this.tacheService.getAllTaches().subscribe(taches => this.taches = taches);
  }

  loadEntTache(id: string): void {
    this.hEntTacheService.getHEntTacheById(id).subscribe(entTache => {
      this.entTache = entTache;
      if (this.entTache && this.entTache.idHEntTache) {
        this.loadDetTaches();
        // Update the affected user after loading entTache
        if (this.users.length > 0) {
          this.entTache.users = this.users.find(user => user.idUsers === this.entTache.users.idUsers) || this.entTache.users;
        }
      }
    }, error => {
      console.error('Error loading HEntTache', error);
    });
  }




  loadDetTaches(): void {
    console.log('loadDetTaches called');
    if (this.entTache && this.entTache.idHEntTache) {
      console.log('Fetching details for ID:', this.entTache.idHEntTache);
      this.hDetTacheService.findByHEntTacheId(this.entTache.idHEntTache).subscribe(data => {
        console.log('Loaded HDetTache data:', data);
        this.detTaches = data;
      }, error => {
        console.error('Error loading HDetTache details', error);
      });
    } else {
      console.warn('entTache or entTache.idHEntTache is not available');
    }
  }



  updateEntTache(): void {
    if (!this.entTache.idHEntTache) {
      Swal.fire('Erreur', 'ID de la tâche non disponible.', 'error');
      return;
    }

    this.hEntTacheService.updateHEntTache(this.entTache.idHEntTache, this.entTache).subscribe({
      next: () => {
        Swal.fire('Succès', 'Tâche mise à jour avec succès!', 'success');
      },
      error: (err) => {
        console.error('Error updating HEntTache', err);
        Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour.', 'error');
      }
    });
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
          this.detTaches = this.detTaches.filter(d => d.idHDetTache !== detail.idHDetTache);
          Swal.fire('Supprimé!', 'La tâche a été supprimée.', 'success');
        }, error => {
          console.error('Error deleting HDetTache', error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
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
    if (!this.entTache || !this.entTache.idHEntTache) {
      console.error('No entTache ID found. Please add entTache first.');
      return;
    }

    // Prepare the hentTache object
    const hentTache = {
      idHEntTache: this.entTache.idHEntTache,
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

    // Prepare the detailPayload object
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

    // Call the service to save the detail
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

    // Assuming this.entTache and other properties are correctly set up as in the originalDetail
    const detailPayload = {
      idHDetTache: originalDetail.idHDetTache, // Ensure the id is included as per the curl example
      tache: originalDetail.tache,
      tempsDiff: originalDetail.tempsDiff,
      coefficient: originalDetail.coefficient,
      prixCalc: originalDetail.prixCalc,
      remarques: originalDetail.remarques,
      hdebut: originalDetail.hdebut,
      hfin: originalDetail.hfin,
      hentTache: {
        idHEntTache: this.entTache.idHEntTache,
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
      }
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

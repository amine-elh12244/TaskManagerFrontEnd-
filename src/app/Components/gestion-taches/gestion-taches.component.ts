import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { HEntTacheService } from "../../services/h-ent-tache.service";
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
import {Router} from "@angular/router";
import {UpdateTacheDialogComponent} from "../update-tache-dialog/update-tache-dialog.component";
import {Observable} from "rxjs";
import {HDetTacheService} from "../../services/h-det-tache.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-gestion-taches',
  templateUrl: './gestion-taches.component.html',
  styleUrls: ['./gestion-taches.component.css']
})
export class GestionTachesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['libelleJournee', 'dateOperation', 'remarques', 'utilisateur', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private hEntTacheService: HEntTacheService, private hDetTacheService: HDetTacheService,public dialog: MatDialog
  ,    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTasks() {
    this.hEntTacheService.getAllHEntTaches().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }



  onDelete(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hEntTacheService.deleteHEntTacheAndAssociatedDetails(id).subscribe({
          next: () => {
            Swal.fire('Supprimé!', 'La tâche et ses détails ont été supprimés.', 'success');
            this.loadTasks(); // Refresh the task list
          },
          error: (error) => {
            console.error('Erreur lors de la suppression!', error);
            Swal.fire('Erreur!', 'Échec de la suppression de la tâche.', 'error');
          }
        });
      }
    });
  }


  async generatePDF(element: any): Promise<Blob> {
    try {
      const hDetTaches = await this.getHDetTachesByHEntTacheId(element.idHEntTache).toPromise();

      const docDefinition: TDocumentDefinitions = {
        content: [
          {
            columns: [
              {
                stack: [
                  { text: 'Détails de la Tâche', style: 'title', alignment: 'left' },
                  { text: 'En-tête de la Tâche', style: 'subheader', alignment: 'left' }
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
                  { text: 'Libellé Journée', style: 'tableHeader' },
                  { text: element.libelleJournee, style: 'tableData' }
                ],
                [
                  { text: 'Date d\'Opération', style: 'tableHeader' },
                  { text: element.dateOperation, style: 'tableData' }
                ],
                [
                  { text: 'Remarques', style: 'tableHeader' },
                  { text: element.remarques, style: 'tableData' }
                ],
                [
                  { text: 'Utilisateur', style: 'tableHeader' },
                  { text: element.users.nom, style: 'tableData' }
                ]
              ]
            },
            layout: 'lightHorizontalLines'
          },
          { text: 'Détails des Tâches', style: 'subheader', alignment: 'left' },
          {
            table: {
              widths: ['auto', '*', '*', '*', 'auto', 'auto', '*'],
              body: [
                [
                  { text: 'ID Tâche', style: 'tableHeader' },
                  { text: 'Heure Début', style: 'tableHeader' },
                  { text: 'Heure Fin', style: 'tableHeader' },
                  { text: 'Temps Différence', style: 'tableHeader' },
                  { text: 'Coefficient', style: 'tableHeader' },
                  { text: 'Prix Calculé', style: 'tableHeader' },
                  { text: 'Remarques', style: 'tableHeader' }
                ],
                ...(hDetTaches ? hDetTaches.map((tache: any) => [
                  { text: tache.tache.libelleTache, style: 'tableData' },
                  { text: tache.hdebut, style: 'tableData' },
                  { text: tache.hfin, style: 'tableData' },
                  { text: tache.tempsDiff, style: 'tableData' },
                  { text: tache.coefficient, style: 'tableData' },
                  { text: tache.prixCalc, style: 'tableData' },
                  { text: tache.remarques, style: 'tableData' }
                ]) : [])
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
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
      Swal.fire('Erreur', 'Échec de la génération du PDF. Veuillez réessayer.', 'error');
      throw error;
    }
  }




  async onPrint(id: string) {
    try {
      const task = this.dataSource.data.find(task => task.idHEntTache === id);
      if (task) {
        const pdfBlob = await this.generatePDF(task);
        const url = URL.createObjectURL(pdfBlob);
        window.open(url);
      } else {
        Swal.fire('Erreur', 'Tâche non trouvée.', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression du PDF', error);
      Swal.fire('Erreur', 'Échec de l\'impression du PDF. Veuillez réessayer.', 'error');
    }
  }





  onEdit(id: string): void {
    this.router.navigate(['/admin/ModiferHentHdet', id]);
  }


  getHDetTachesByHEntTacheId(id: string): Observable<any[]> {
    return this.hDetTacheService.findByHEntTacheId(id);
  }


}
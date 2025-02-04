import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddTacheDialogComponent } from '../add-tache-dialog/add-tache-dialog.component';
import { EditTacheDialogComponent } from '../edit-tache-dialog/edit-tache-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { TacheService } from '../../services/tache.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {
  libelleTache: string = '';
  coefficient: string = '';
  remarques: string = '';

  displayedColumns: string[] = ['libelle_tache', 'coefficient', 'remarques', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private tacheService: TacheService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTaches();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTaches(): void {
    this.tacheService.getAllTaches().subscribe(
      data => {
        this.dataSource.data = data;
      },
      error => {
        console.error('Error loading taches', error);
        // Handle error with a notification or message
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddTacheDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadTaches();
      }
    });
  }

  openEditDialog(tache: any): void {
    const dialogRef = this.dialog.open(EditTacheDialogComponent, {
      width: '400px',
      data: tache
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadTaches();
      }
    });
  }

  deleteTache(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tacheService.deleteTache(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Your tache has been deleted.',
              'success'
            );
            this.loadTaches(); // Reload your Taches list
          },
          error: (error) => {
            console.error('Error deleting tache', error);
            Swal.fire(
              'Error!',
              'Failed to delete the tache. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }

  searchparlibelleTache($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.libelleTache.toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value.trim().toLowerCase();
  }

  searchparCoefficient($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.coefficient.toString().toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value.trim().toLowerCase();
  }

  searchparRemarque($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.remarques.toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value.trim().toLowerCase();
  }

  async generatePDF(element: any): Promise<void> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: 'Tache', style: 'title', alignment: 'left' },
                { text: 'Détails de la tache', style: 'subheader', alignment: 'left' }
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
                { text: 'Libellé Tache', style: 'tableHeader' },
                { text: element.libelleTache, style: 'tableData' }
              ],
              [
                { text: 'Coefficient', style: 'tableHeader' },
                { text: element.coefficient, style: 'tableData' }
              ],
              [
                { text: 'Remarques', style: 'tableHeader' },
                { text: element.remarques, style: 'tableData' }
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

    pdfMake.createPdf(docDefinition).open();
  }

  async generateAndShowPDF(element: any): Promise<void> {
    await this.generatePDF(element);
  }

  async generateAndShowAllPDF(): Promise<void> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'Liste des Taches',
          style: 'title',
          alignment: 'center'
        },
        { text: '', margin: [0, 20] },
        {
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'Libellé Tache', style: 'tableHeader' },
                { text: 'Coefficient', style: 'tableHeader' },
                { text: 'Remarques', style: 'tableHeader' }
              ],
              ...this.dataSource.data.map((element: any) => [
                { text: element.libelleTache, style: 'tableData' },
                { text: element.coefficient, style: 'tableData' },
                { text: element.remarques, style: 'tableData' }
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      styles: {
        title: {
          fontSize: 20,
          bold: true
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

    pdfMake.createPdf(docDefinition).open();
  }

  generateCSV(): void {
    const csvData = this.dataSource.data.map((element: any) => ({
      'Libelle  Tache': element.libelleTache,
      'Coefficient': element.coefficient,
      'Remarques': element.remarques
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'taches.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  convertToCSV(objArray: any[]): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    const headers = Object.keys(array[0]);
    str += headers.join(';') + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line !== '') line += ';';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  async generateAndShowAllHTML(): Promise<void> {
    let htmlContent = `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h2>Liste des Taches</h2>
        <table>
          <tr>
            <th>Libellé Tache</th>
            <th>Coefficient</th>
            <th>Remarques</th>
          </tr>
    `;

    this.dataSource.data.forEach((element: any) => {
      htmlContent += `
        <tr>
          <td>${element.libelleTache}</td>
          <td>${element.coefficient}</td>
          <td>${element.remarques}</td>
        </tr>
      `;
    });

    htmlContent += `
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'taches.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  search() {
    // Implement search logic
  }
}

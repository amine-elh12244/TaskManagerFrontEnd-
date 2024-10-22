import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {FUserService} from "../../services/f-user.service";
import Swal from 'sweetalert2';
import { AddFUserDialogComponent } from '../add-fuser-dialog/add-fuser-dialog.component';
import { EditFUserDialogComponent } from '../edit-fuser-dialog/edit-fuser-dialog.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {TDocumentDefinitions} from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-famille-user',
  templateUrl: './famille-user.component.html',
  styleUrls: ['./famille-user.component.css']
})
export class FamilleUserComponent implements OnInit, AfterViewInit {
  libelleFamille: string = '';
  coefficient: string = '';
  remarques: string = '';
  displayedColumns: string[] = ['libelle_famille', 'coefficient', 'remarques', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fUserService: FUserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadFUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadFUsers() {
    this.fUserService.getAllFUsers().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddFUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadFUsers();
      }
    });
  }

  openEditDialog(element: any): void {
    const dialogRef = this.dialog.open(EditFUserDialogComponent, {
      width: '400px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadFUsers();
      }
    });
  }

  deleteFUser(id: string) {
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
        this.fUserService.deleteFUser(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
            this.loadFUsers(); // Reload your FUsers list
          },
          error: (error) => {
            console.error('There was an error!', error);
            Swal.fire(
              'Error!',
              'Failed to delete the user. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }

  searchparlibelleFamille($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.libelleFamille.toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value;
  }

  searchparCoefficient($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.coefficient.toString().toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value;
  }

  searchparRemarque($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.remarques.toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value;
  }

  async generatePDF(element: any): Promise<Blob> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: 'Famille User', style: 'title', alignment: 'left' },
                { text: 'Détails de la famille', style: 'subheader', alignment: 'left' }
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
                { text: 'Libellé Famille', style: 'tableHeader' },
                { text: element.libelleFamille, style: 'tableData' }
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

    return new Promise((resolve, reject) => {
      pdfMake.createPdf(docDefinition).getBlob((blob) => {
        resolve(blob);
      });
    });
  }


  async generateAndShowPDF(element: any) {
    const pdfBlob = await this.generatePDF(element);
    const url = URL.createObjectURL(pdfBlob as Blob);
    window.open(url);
  }



  async generateAndShowAllPDF() {
    const allFUsers = this.dataSource.data;
    const tableBody = [
      [
        { text: 'Libellé Famille', style: 'tableHeader' },
        { text: 'Coefficient', style: 'tableHeader' },
        { text: 'Remarques', style: 'tableHeader' }
      ]
    ];

    allFUsers.forEach((element: any) => {
      tableBody.push([
        { text: element.libelleFamille, style: 'tableData' },
        { text: element.coefficient, style: 'tableData' },
        { text: element.remarques, style: 'tableData' }
      ]);
    });

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Famille Users', style: 'title', alignment: 'center' },
        { text: '', margin: [0, 20] },
        {
          table: {
            widths: ['*', '*', '*'],
            body: tableBody
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

    const pdfBlob = await new Promise<Blob>((resolve, reject) => {
      pdfMake.createPdf(docDefinition).getBlob((blob) => {
        resolve(blob);
      });
    });

    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  }



  generateCSV() {
    const allFUsers = this.dataSource.data;
    const csvData = this.convertToCSV(allFUsers);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'familles_users.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(objArray: any): string {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = 'ID;Libelle Famille;Coefficient;Remarques\n';

    for (const i in array) {
      let line = '';
      for (const index in array[i]) {
        if (line != '') line += ';';
        line += array[i][index];
      }
      str += line + '\n';
    }

    return str;
  }

  search() {
    // Implement search functionality here if needed
  }

  async generateAndShowAllHTML() {
    const allFUsers = this.dataSource.data;

    let htmlContent = `
    <html>
      <head>
        <title>Famille Users</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1>Famille Users</h1>
        <table>
          <thead>
            <tr>
              <th>Libellé Famille</th>
              <th>Coefficient</th>
              <th>Remarques</th>
            </tr>
          </thead>
          <tbody>
  `;

    allFUsers.forEach((element: any) => {
      htmlContent += `
      <tr>
        <td>${element.libelleFamille}</td>
        <td>${element.coefficient}</td>
        <td>${element.remarques}</td>
      </tr>
    `;
    });

    htmlContent += `
          </tbody>
        </table>
      </body>
    </html>
  `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'familles_users.html';
    a.click();
    URL.revokeObjectURL(url);
  }

}

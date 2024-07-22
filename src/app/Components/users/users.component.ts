import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UsersService} from "../../services/users.service";
import {MatDialog} from "@angular/material/dialog";
import {TDocumentDefinitions} from "pdfmake/interfaces";
import {EditUserDialogComponentComponent} from "../edit-user-dialog-component/edit-user-dialog-component.component";
import {AddUserDialogComponentComponent} from "../add-user-dialog-component/add-user-dialog-component.component";
import Swal from "sweetalert2";
import pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit {
  nom: string = '';
  age: number | null = null;
  email: string = '';
  displayedColumns: string[] = ['nom', 'age', 'email', 'Famille', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usersService: UsersService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.usersService.getAllUsers().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponentComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadUsers();
      }
    });
  }

  openEditDialog(element: any): void {
    const dialogRef = this.dialog.open(EditUserDialogComponentComponent, {
      width: '400px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadUsers();
      }
    });
  }

  deleteUser(id: string) {
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
        this.usersService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
            this.loadUsers();
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

  searchparNom($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.nom.toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value;
  }

  searchparAge($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.age.toString().includes(filter);
    };
    this.dataSource.filter = value;
  }

  searchparEmail($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.email.toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value;
  }

  search() {
    // Implement search functionality here if needed
  }

  async generatePDF(element: any): Promise<Blob> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: 'Utilisateur', style: 'title', alignment: 'left' },
                { text: 'Détails de l\'utilisateur', style: 'subheader', alignment: 'left' }
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
                { text: 'Nom', style: 'tableHeader' },
                { text: element.nom, style: 'tableData' }
              ],
              [
                { text: 'Age', style: 'tableHeader' },
                { text: element.age, style: 'tableData' }
              ],
              [
                { text: 'Email', style: 'tableHeader' },
                { text: element.email, style: 'tableData' }
              ],
              [
                { text: 'Famille', style: 'tableHeader' },
                { text: element.fuser ? element.fuser.libelleFamille : 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Coefficient', style: 'tableHeader' },
                { text: element.fuser ? element.fuser.coefficient : 'N/A', style: 'tableData' }
              ],
              [
                { text: 'Remarques', style: 'tableHeader' },
                { text: element.fuser ? element.fuser.remarques : 'N/A', style: 'tableData' }
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
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  }

  async generateAndShowAllPDF() {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'Liste de Toutes les  Utilisateurs',
          style: 'header'
        },
        {
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              ['Nom', 'Age', 'Email', 'Famille', 'Coefficient', 'Remarques'],
              ...this.dataSource.data.map((user: any) => [
                user.nom,
                user.age,
                user.email,
                user.fuser ? user.fuser.libelleFamille : 'N/A',
                user.fuser ? user.fuser.coefficient : 'N/A',
                user.fuser ? user.fuser.remarques : 'N/A'
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
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
    const csvData = this.dataSource.data.map((user: any) => {
      return {
        Nom: user.nom,
        Age: user.age,
        Email: user.email,
        Famille: user.fuser ? user.fuser.libelleFamille : 'N/A',
        Coefficient: user.fuser ? user.fuser.coefficient : 'N/A',
        Remarques: user.fuser ? user.fuser.remarques : 'N/A'
      };
    });

    const csvContent = "data:text/csv;charset=utf-8," +
      ["Nom;Age;Email;Famille;Coefficient;Remarques"].concat(
        csvData.map(e => Object.values(e).join(";"))
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
  }

  generateAndShowAllHTML() {
    const htmlContent = `
      <html>
      <head>
        <title>Liste de Toutes  Utilisateurs</title>
      </head>
      <body>
        <h1>Liste de Toutes les Familles Utilisateurs</h1>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Age</th>
              <th>Email</th>
              <th>Famille</th>
              <th>Coefficient</th>
              <th>Remarques</th>
            </tr>
          </thead>
          <tbody>
            ${this.dataSource.data.map((user: any) => `
              <tr>
                <td>${user.nom}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.fuser ? user.fuser.libelleFamille : 'N/A'}</td>
                <td>${user.fuser ? user.fuser.coefficient : 'N/A'}</td>
                <td>${user.fuser ? user.fuser.remarques : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow!.document.write(htmlContent);
    newWindow!.document.close();
  }
}

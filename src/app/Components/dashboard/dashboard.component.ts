import { Component, NgZone, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FUserService } from '../../services/f-user.service';
import { TacheService } from '../../services/tache.service';
import { HEntTacheService } from '../../services/h-ent-tache.service';
import { HDetTacheService } from '../../services/h-det-tache.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usersCount: number = 0;
  familleUsersCount: number = 0;
  tachesCount: number = 0;
  entetTachesCount: number = 0;
  detTachesCount: number = 0;

  displayedUsersCount: number = 0;
  displayedFamilleUsersCount: number = 0;
  displayedTachesCount: number = 0;
  displayedEntetTachesCount: number = 0;
  displayedDetTachesCount: number = 0;

  chartOption: any;

  constructor(
    private userService: UsersService,
    private fUserService: FUserService,
    private tacheService: TacheService,
    private hEntTacheService: HEntTacheService,
    private hDetTacheService: HDetTacheService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.usersCount = users.length;
      this.animateCounter('users');
      this.updateChart();
    });

    this.fUserService.getAllFUsers().subscribe(fUsers => {
      this.familleUsersCount = fUsers.length;
      this.animateCounter('familleUsers');
      this.updateChart();
    });

    this.tacheService.getAllTaches().subscribe(taches => {
      this.tachesCount = taches.length;
      this.animateCounter('taches');
      this.updateChart();
    });

    this.hEntTacheService.getAllHEntTaches().subscribe(entetTaches => {
      this.entetTachesCount = entetTaches.length;
      this.animateCounter('entetTaches');
      this.updateChart();
    });

    this.hDetTacheService.getAllHDetTaches().subscribe(detTaches => {
      this.detTachesCount = detTaches.length;
      this.animateCounter('detTaches');
      this.updateChart();
    });
  }

  animateCounter(type: string): void {
    let start = 0;
    let end = 0;

    switch (type) {
      case 'users':
        end = this.usersCount;
        break;
      case 'familleUsers':
        end = this.familleUsersCount;
        break;
      case 'taches':
        end = this.tachesCount;
        break;
      case 'entetTaches':
        end = this.entetTachesCount;
        break;
      case 'detTaches':
        end = this.detTachesCount;
        break;
    }

    const duration = 2000; // animation duration in ms
    const stepTime = Math.abs(Math.floor(duration / (end || 1)));

    this.zone.runOutsideAngular(() => {
      const interval = setInterval(() => {
        start++;
        if (start >= end) {
          clearInterval(interval);
          this.zone.run(() => {
            this.updateDisplayedCount(type, end);
          });
        } else {
          this.zone.run(() => {
            this.updateDisplayedCount(type, start);
          });
        }
      }, stepTime);
    });
  }

  updateDisplayedCount(type: string, value: number): void {
    switch (type) {
      case 'users':
        this.displayedUsersCount = value;
        break;
      case 'familleUsers':
        this.displayedFamilleUsersCount = value;
        break;
      case 'taches':
        this.displayedTachesCount = value;
        break;
      case 'entetTaches':
        this.displayedEntetTachesCount = value;
        break;
      case 'detTaches':
        this.displayedDetTachesCount = value;
        break;
    }
  }

  updateChart(): void {
    this.chartOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Stats',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: this.usersCount, name: 'Utilisateurs' },
            { value: this.familleUsersCount, name: 'Utilisateurs de famille' },
            { value: this.tachesCount, name: 'Tâches' },
            { value: this.entetTachesCount, name: 'Entêtes de tâches' },
            { value: this.detTachesCount, name: 'Détails de tâches' }
          ]
        }
      ]
    };
  }
}

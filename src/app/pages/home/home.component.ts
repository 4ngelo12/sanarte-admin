import { Component, OnInit } from '@angular/core';
import { ITopServices, ITtopDaysReservation } from '@app/core/interfaces/Home';
import { HomeService } from '@app/core/services/home.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export default class HomeComponent implements OnInit {
  topServices!: ITopServices[];
  topDaysReservation!: ITtopDaysReservation[];
  
  constructor(private lsService: LocalstorageService, private homeService: HomeService) { }

  async ngOnInit(): Promise<void> {
    const tokenValidate = this.lsService.validateToken();
    
    if (tokenValidate) {
      window.location.reload();
    }

    await this.getTopServices();
    await this.getTopDaysReservation();
  }

  async getTopServices() {
    this.homeService.getTopServices().subscribe({
      next: (data: any) => {
        this.topServices = data.data;
      },
    });
  }

  async getTopDaysReservation() {
    this.homeService.getTopDaysReservation().subscribe({
      next: (data: any) => {
        this.topDaysReservation = data.data;
      },
    });
  }
}

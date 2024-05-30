import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import HomeComponent from './pages/home/home.component';
import { SidemenuComponent } from '@app/shared/sidemenu/sidemenu.component';
import { LocalstorageService } from '@app/core/services/localstorage.service';

@Component({
  standalone: true,
  imports: [RouterModule, HomeComponent, SidemenuComponent],
  templateUrl: './principal.component.html',
  styles: ``
})
export default class PrincipalComponent implements OnInit {
  constructor(private lsService: LocalstorageService) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }
  }
}

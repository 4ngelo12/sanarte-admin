import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import HomeComponent from './pages/home/home.component';
import { SidemenuComponent } from './shared/sidemenu/sidemenu.component';
import { LocalstorageService } from './core/services/localstorage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HomeComponent, SidemenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  constructor(private lsService: LocalstorageService) {}

  get token() {
    return this.lsService.getToken();
  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    initFlowbite();
  }
}

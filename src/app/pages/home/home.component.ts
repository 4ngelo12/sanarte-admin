import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '@app/core/services/localstorage.service';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styles: ``
})
export default class HomeComponent implements OnInit {
  constructor(private lsService: LocalstorageService) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }
  }
}

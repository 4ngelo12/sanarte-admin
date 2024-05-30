import { Component } from '@angular/core';
import { LocalstorageService } from '@app/core/services/localstorage.service';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './reservas.component.html',
  styles: ``
})
export default class ReservasComponent {
  constructor(private lsService: LocalstorageService) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }
  }
}

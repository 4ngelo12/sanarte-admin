import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { LocalstorageService } from '../services/localstorage.service';
import { Role } from '../interfaces/Roles';

@Directive({
  selector: '[akoShowForRoles]',
  standalone: true
})
export class ShowForRoleDirective implements OnInit {
  @Input('akoShowForRoles') allowedRoles?: Role[];
  @Output() permited = new EventEmitter<boolean>();
  constructor(private lsService: LocalstorageService
  ) { }

  ngOnInit(): void {
    const token = this.lsService.getToken();
    const roleName = this.lsService.getRole();
    this.permited.emit(Boolean(token && this.allowedRoles?.includes(roleName as Role)));
  }
}

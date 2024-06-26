import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { INewCategory } from '@app/core/interfaces/Categories';
import { AlertsService } from '@app/core/services/alerts.service';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styles: ``
})
export default class CreateComponent implements OnInit {
  Categoryform!: FormGroup;
  categoryData: INewCategory = {} as INewCategory;

  constructor(private categoryService: CategoryService, private lsService: LocalstorageService,
    private alertService: AlertsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.Categoryform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      warning: ['', [Validators.minLength(10)]],
      // image: ['', [Validators.required]]
    });
  }

  categorySubmit() {
    if (this.Categoryform.invalid) {
      this.alertService.error(undefined, 'Formulario invalido');
      return;
    }

    if (this.Categoryform.value.warning === '') {
      this.Categoryform.value.warning = null;
    }
    

    this.categoryData = this.Categoryform.value;
    this.categoryService.newCategory(this.categoryData).subscribe({
      next: (resp: any) => {
        this.Categoryform.reset();
        this.alertService.success(resp.message);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(undefined, err.error.errors.name[0]);
      }
    });
  }

  // Validaciones del formulario

  get name() {
    return this.Categoryform.get('name') as FormGroup;
  }

  get description() {
    return this.Categoryform.get('description') as FormGroup;
  }

  get warning() {
    return this.Categoryform.get('warning') as FormGroup;
  }
}
